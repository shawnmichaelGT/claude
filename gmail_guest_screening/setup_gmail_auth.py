#!/usr/bin/env python3
"""
One-time setup script to authorize Gmail access and generate
the base64-encoded secrets you'll store in GitHub Actions.

Usage:
  1. Download your OAuth credentials from Google Cloud Console
     (APIs & Services → Credentials → OAuth 2.0 Client ID → Download JSON)
     and save as credentials.json in this directory.
  2. Run:  python setup_gmail_auth.py
  3. A browser window will open for you to authorize access.
  4. Copy the two base64 strings printed at the end into your
     GitHub repository secrets (Settings → Secrets → Actions).
"""

import base64
import json
import os
from pathlib import Path

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
]

CREDS_FILE = Path(__file__).parent / "credentials.json"
TOKEN_FILE = Path(__file__).parent / "token.json"


def main():
    try:
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
    except ImportError:
        print("Install dependencies first:\n  pip install -r requirements.txt")
        raise SystemExit(1)

    if not CREDS_FILE.exists():
        print(
            f"ERROR: {CREDS_FILE} not found.\n"
            "Download your OAuth 2.0 credentials JSON from Google Cloud Console\n"
            "and save it as credentials.json in the same directory as this script."
        )
        raise SystemExit(1)

    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_FILE.write_text(creds.to_json())

    token_b64 = base64.b64encode(TOKEN_FILE.read_bytes()).decode()
    creds_b64 = base64.b64encode(CREDS_FILE.read_bytes()).decode()

    print("\n" + "=" * 60)
    print("Authorization successful. Add these to GitHub Secrets:\n")
    print("Secret name:  GMAIL_TOKEN_JSON")
    print(f"Secret value: {token_b64}\n")
    print("Secret name:  GMAIL_CREDS_JSON")
    print(f"Secret value: {creds_b64}")
    print("=" * 60)
    print(
        "\nAlso add:\n"
        "  MY_EMAIL          → your Gmail address\n"
        "  ANTHROPIC_API_KEY → your Anthropic API key\n"
    )


if __name__ == "__main__":
    main()
