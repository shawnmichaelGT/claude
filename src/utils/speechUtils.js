export function isTTSSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function isSTTSupported() {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}

let currentUtterance = null

export function speak(text, lang = 'en-US') {
  if (!isTTSSupported()) return
  stopSpeaking()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  utter.rate = 0.9
  utter.pitch = 1.05
  currentUtterance = utter
  window.speechSynthesis.speak(utter)
}

export function speakSpanish(text) {
  speak(text, 'es-MX')
}

export function stopSpeaking() {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()
  currentUtterance = null
}

const WORD_TO_NUM = {
  zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,
  ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,
  seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,
  sixty:60,seventy:70,eighty:80,ninety:90,hundred:100,
}

function wordToNumber(str) {
  const lower = str.trim().toLowerCase()
  // Direct mapping
  if (WORD_TO_NUM[lower] !== undefined) return String(WORD_TO_NUM[lower])
  // "twenty three" -> 23
  const parts = lower.split(/[\s-]+/)
  let total = 0
  for (const part of parts) {
    if (WORD_TO_NUM[part] !== undefined) total += WORD_TO_NUM[part]
    else if (!isNaN(Number(part))) total += Number(part)
  }
  return total > 0 ? String(total) : str
}

export function normalizeSTTResult(transcript) {
  const trimmed = transcript.trim()
  // If it looks like a number word, convert it
  const converted = wordToNumber(trimmed)
  if (!isNaN(Number(converted))) return converted
  return trimmed
}

let activeRecognition = null

export function listenForAnswer(onResult, onError, timeout = 10000) {
  if (!isSTTSupported()) {
    onError?.('STT not supported')
    return
  }
  stopListening()

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  const timer = setTimeout(() => {
    recognition.stop()
    onError?.('timeout')
  }, timeout)

  recognition.onresult = (e) => {
    clearTimeout(timer)
    const raw = e.results[0][0].transcript
    onResult(normalizeSTTResult(raw))
  }

  recognition.onerror = (e) => {
    clearTimeout(timer)
    onError?.(e.error)
  }

  recognition.onend = () => {
    clearTimeout(timer)
    activeRecognition = null
  }

  activeRecognition = recognition
  recognition.start()
}

export function listenForAnswerSpanish(onResult, onError, timeout = 10000) {
  if (!isSTTSupported()) { onError?.('STT not supported'); return }
  stopListening()
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.lang = 'es-MX'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  const timer = setTimeout(() => { recognition.stop(); onError?.('timeout') }, timeout)
  recognition.onresult = (e) => { clearTimeout(timer); onResult(e.results[0][0].transcript.trim()) }
  recognition.onerror = (e) => { clearTimeout(timer); onError?.(e.error) }
  recognition.onend = () => { clearTimeout(timer); activeRecognition = null }

  activeRecognition = recognition
  recognition.start()
}

export function stopListening() {
  if (activeRecognition) {
    try { activeRecognition.stop() } catch {}
    activeRecognition = null
  }
}
