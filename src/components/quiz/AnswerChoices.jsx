import { useState } from 'react'
import { isSTTSupported } from '../../utils/speechUtils'
import { listenForAnswer } from '../../utils/speechUtils'

export default function AnswerChoices({ choices, selectedAnswer, answered, correctAnswer, onSelect, subject }) {
  const [listening, setListening] = useState(false)

  function getButtonClass(choice) {
    if (!answered) return 'btn btn--answer'
    if (choice === correctAnswer) return 'btn btn--answer correct'
    if (choice === selectedAnswer && choice !== correctAnswer) return 'btn btn--answer wrong'
    return 'btn btn--answer'
  }

  function handleMic() {
    if (listening) return
    setListening(true)
    listenForAnswer(
      (transcript) => {
        setListening(false)
        // Try to match transcript to a choice
        const lower = transcript.toLowerCase()
        const match = choices.find(c => c.toLowerCase() === lower)
          || choices.find(c => c.toLowerCase().includes(lower))
          || choices.find(c => lower.includes(c.toLowerCase()))
        if (match) onSelect(match)
      },
      () => setListening(false)
    )
  }

  return (
    <div>
      <div className="answer-grid">
        {choices.map((choice, i) => (
          <button
            key={i}
            className={getButtonClass(choice)}
            disabled={answered}
            onClick={() => onSelect(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      {isSTTSupported() && !answered && (
        <div className="mt-16 flex-center">
          <button
            className={`btn btn--icon ${listening ? 'listening' : ''}`}
            onClick={handleMic}
            disabled={listening || answered}
            title={listening ? 'Listening…' : 'Say your answer'}
            aria-label={listening ? 'Listening for your answer' : 'Click to answer by voice'}
          >
            {listening ? '🎙️' : '🎤'}
          </button>
          {listening && (
            <span className="text-sm text-light" style={{ marginLeft: 10 }}>
              Listening…
            </span>
          )}
        </div>
      )}
    </div>
  )
}
