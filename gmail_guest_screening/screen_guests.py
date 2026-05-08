#!/usr/bin/env python3
"""
Scans unread inbox emails, screens podcast guest inquiries using Claude,
drafts replies for good fits, and emails a summary to the account owner.

Required environment variables:
  MY_EMAIL          - your Gmail address (used as sender/recipient for summary)
  ANTHROPIC_API_KEY - Anthropic API key
  GMAIL_TOKEN_JSON  - base64-encoded contents of your OAuth token.json
  GMAIL_CREDS_JSON  - base64-encoded contents of your OAuth credentials.json
"""

import base64
import json
import os
import re
import sys
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import anthropic
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCREENED_LABEL = "guest-screened"
MAX_EMAILS = 20
BODY_CHAR_LIMIT = 4000

SCREENING_PROMPT = """\
You are screening podcast guest inquiry emails. The sender has sent {message_count} message(s) — evaluate them together as a complete picture.

Criteria:
1. Relevant expertise / topic fit — does their background match a podcast's theme?
2. Clear pitch or hook — did they articulate why they'd make a compelling episode?
3. Social / media presence — do they have an audience, following, or published work?

Sender: {sender}
Most recent subject: {subject}
---
{body}
---

Respond with ONLY a valid JSON object (no markdown fences) in this exact shape:
{{
  "verdict": "strong_fit" | "possible_fit" | "not_a_fit",
  "score": <integer 1-10>,
  "strengths": ["...", "..."],
  "concerns": ["...", "..."],
  "summary": "<2-3 sentence plain-text assessment>",
  "suggested_reply": "<professional draft reply in plain text — warm interest + clarifying questions for fits; polite decline for not_a_fit>"
}}
"""


def get_gmail_service() -> object:
    token_data = json.loads(base64.b64decode(os.environ["GMAIL_TOKEN_JSON"]))
    creds_data = json.loads(base64.b64decode(os.environ["GMAIL_CREDS_JSON"]))

    creds = Credentials(
        token=token_data.get("token"),
        refresh_token=token_data.get("refresh_token"),
        token_uri=creds_data["installed"]["token_uri"],
        client_id=creds_data["installed"]["client_id"],
        client_secret=creds_data["installed"]["client_secret"],
        scopes=token_data.get("scopes"),
    )
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return build("gmail", "v1", credentials=creds)


def get_or_create_label(service, name: str) -> str:
    labels = service.users().labels().list(userId="me").execute().get("labels", [])
    for label in labels:
        if label["name"].lower() == name.lower():
            return label["id"]
    result = service.users().labels().create(
        userId="me",
        body={
            "name": name,
            "labelListVisibility": "labelShow",
            "messageListVisibility": "show",
        },
    ).execute()
    return result["id"]


def extract_body(msg: dict) -> str:
    payload = msg["payload"]

    def decode(data: str) -> str:
        return base64.urlsafe_b64decode(data + "==").decode("utf-8", errors="ignore")

    if "parts" in payload:
        for part in payload["parts"]:
            if part["mimeType"] == "text/plain":
                return decode(part["body"].get("data", ""))[:BODY_CHAR_LIMIT]
        # Fall back to first part with data
        for part in payload["parts"]:
            if part["body"].get("data"):
                return decode(part["body"]["data"])[:BODY_CHAR_LIMIT]
    else:
        return decode(payload["body"].get("data", ""))[:BODY_CHAR_LIMIT]
    return ""


def screen_with_claude(subject: str, sender: str, body: str, message_count: int = 1) -> dict | None:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    prompt = SCREENING_PROMPT.format(subject=subject, sender=sender, body=body, message_count=message_count)
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = response.content[0].text.strip()
    # Strip markdown fences if the model adds them anyway
    raw = re.sub(r"^```[a-z]*\n?", "", raw)
    raw = re.sub(r"\n?```$", "", raw)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    print(f"  WARNING: could not parse Claude response:\n{raw[:300]}", file=sys.stderr)
    return None


def create_draft(service, thread_id: str, to_address: str, subject: str, body_text: str):
    msg = MIMEMultipart()
    msg["to"] = to_address
    msg["subject"] = subject if subject.startswith("Re:") else f"Re: {subject}"
    msg.attach(MIMEText(body_text, "plain"))
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    service.users().drafts().create(
        userId="me",
        body={"message": {"raw": raw, "threadId": thread_id}},
    ).execute()


def send_summary(service, results: list[dict], my_email: str):
    if not results:
        return

    icons = {"strong_fit": "✅", "possible_fit": "⚠️", "not_a_fit": "❌"}
    total_messages = sum(r["message_count"] for r in results)
    lines = [
        f"Guest Screening Summary — {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}",
        f"Screened {len(results)} sender(s) across {total_messages} message(s)\n",
    ]
    for r in results:
        icon = icons.get(r["verdict"], "❓")
        verdict_label = r["verdict"].replace("_", " ").title()
        msg_note = f"{r['message_count']} message(s)" if r["message_count"] > 1 else "1 message"
        lines += [
            f"{icon}  {verdict_label}  (score {r['score']}/10)  [{msg_note}]",
            f"   From:    {r['sender']}",
            f"   Subject: {r['subject']}",
            f"   {r['summary']}",
        ]
        if r["verdict"] != "not_a_fit":
            lines.append("   → Draft reply created in your Gmail Drafts folder.")
        lines.append("")

    drafts = sum(1 for r in results if r["verdict"] != "not_a_fit")
    msg = MIMEMultipart()
    msg["to"] = my_email
    msg["from"] = my_email
    msg["subject"] = (
        f"[Guest Screening] {len(results)} sender(s) screened "
        f"— {drafts} draft(s) created"
    )
    msg.attach(MIMEText("\n".join(lines), "plain"))
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    service.users().messages().send(userId="me", body={"raw": raw}).execute()


def extract_email_address(sender: str) -> str:
    match = re.search(r"<(.+?)>", sender)
    return match.group(1) if match else sender.strip()


def main():
    my_email = os.environ["MY_EMAIL"]
    service = get_gmail_service()
    screened_label_id = get_or_create_label(service, SCREENED_LABEL)

    query = f"label:1--daily-power-boost-pending-reply -label:{SCREENED_LABEL}"
    result = service.users().messages().list(
        userId="me", q=query, maxResults=MAX_EMAILS
    ).execute()
    messages = result.get("messages", [])

    if not messages:
        print("No unread messages to process.")
        return

    print(f"Found {len(messages)} unread message(s). Fetching and grouping by sender...")

    # Fetch all messages and group by sender email address
    sender_groups: dict[str, dict] = {}

    for msg_ref in messages:
        try:
            msg = service.users().messages().get(
                userId="me", id=msg_ref["id"], format="full"
            ).execute()
        except HttpError as e:
            print(f"  Could not fetch message {msg_ref['id']}: {e}", file=sys.stderr)
            continue

        headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
        subject = headers.get("Subject", "(no subject)")
        sender = headers.get("From", "unknown")
        sender_email = extract_email_address(sender)
        internal_date = int(msg.get("internalDate", 0))

        if sender_email not in sender_groups:
            sender_groups[sender_email] = {"sender": sender, "messages": []}

        sender_groups[sender_email]["messages"].append({
            "id": msg_ref["id"],
            "subject": subject,
            "thread_id": msg["threadId"],
            "body": extract_body(msg),
            "internal_date": internal_date,
        })

    print(f"Grouped into {len(sender_groups)} unique sender(s).")
    screening_results = []

    for sender_email, group in sender_groups.items():
        sender = group["sender"]
        msgs = sorted(group["messages"], key=lambda m: m["internal_date"])
        latest = msgs[-1]

        # Combine all messages into one context block for Claude
        if len(msgs) == 1:
            combined_body = msgs[0]["body"]
        else:
            parts = [
                f"--- Message {i} of {len(msgs)} (Subject: {m['subject']}) ---\n{m['body']}"
                for i, m in enumerate(msgs, 1)
            ]
            combined_body = "\n\n".join(parts)

        print(f"  Screening {len(msgs)} message(s) from {sender[:60]}")

        screening = screen_with_claude(
            subject=latest["subject"],
            sender=sender,
            body=combined_body,
            message_count=len(msgs),
        )
        if screening is None:
            continue

        # Mark ALL messages from this sender as screened
        for m in msgs:
            service.users().messages().modify(
                userId="me",
                id=m["id"],
                body={"addLabelIds": [screened_label_id]},
            ).execute()

        if screening["verdict"] in ("strong_fit", "possible_fit"):
            create_draft(service, latest["thread_id"], sender_email, latest["subject"], screening["suggested_reply"])

        screening_results.append({
            "sender": sender,
            "subject": latest["subject"],
            "message_count": len(msgs),
            "verdict": screening["verdict"],
            "score": screening["score"],
            "summary": screening["summary"],
        })

    send_summary(service, screening_results, my_email)
    drafts_created = sum(1 for r in screening_results if r["verdict"] != "not_a_fit")
    total_msgs = sum(r["message_count"] for r in screening_results)
    print(
        f"Done. Screened {len(screening_results)} sender(s) across {total_msgs} message(s), "
        f"drafted {drafts_created} repl{'y' if drafts_created == 1 else 'ies'}."
    )


if __name__ == "__main__":
    main()
