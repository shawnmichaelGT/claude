import { useState, useRef } from 'react'
import { isSTTSupported, listenForAnswer } from '../../utils/speechUtils'
import { answersMatch } from '../../utils/quizHelpers'

export default function FreeInput({ onSubmit, answered, correctAnswer, inputMode = 'numeric' }) {
  const [value, setValue] = useState('')
  const [listening, setListening] = useState(false)
  const inputRef = useRef(null)

  function getInputClass() {
    if (!answered) return 'free-input'
    return answersMatch(value, correctAnswer) ? 'free-input correct' : 'free-input wrong'
  }

  function handleSubmit() {
    if (!value.trim() || answered) return
    onSubmit(value.trim())
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  function handleMic() {
    if (listening) return
    setListening(true)
    listenForAnswer(
      (transcript) => {
        setListening(false)
        setValue(transcript)
        setTimeout(() => onSubmit(transcript), 100)
      },
      () => setListening(false)
    )
  }

  return (
    <div className="free-input-wrap">
      <input
        ref={inputRef}
        type="text"
        inputMode={inputMode}
        className={getInputClass()}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={answered}
        placeholder={inputMode === 'numeric' ? 'Your answer…' : 'Type answer…'}
        autoFocus
        aria-label="Your answer"
      />
      {!answered && (
        <>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!value.trim()}
            style={{ flexShrink: 0 }}
          >
            Check ✓
          </button>
          {isSTTSupported() && (
            <button
              className={`btn btn--icon ${listening ? 'listening' : ''}`}
              onClick={handleMic}
              disabled={listening}
              title={listening ? 'Listening…' : 'Say your answer'}
              aria-label="Voice answer"
              style={{ flexShrink: 0 }}
            >
              {listening ? '🎙️' : '🎤'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
