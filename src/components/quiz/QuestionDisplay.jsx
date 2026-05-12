import { useEffect } from 'react'
import { getVoiceEnabled } from '../../utils/storage'
import { speak, speakSpanish } from '../../utils/speechUtils'

export default function QuestionDisplay({ question, index, total, subject, onReplay }) {
  const isSpanish = subject === 'spanish'

  useEffect(() => {
    if (getVoiceEnabled()) {
      const text = question.context
        ? `${question.context}. ${question.prompt}`
        : question.prompt
      if (isSpanish) speak(text, 'en-US')
      else speak(text)
    }
  }, [question.id])

  function handleReplay() {
    const text = question.context ? `${question.context}. ${question.prompt}` : question.prompt
    isSpanish ? speak(text, 'en-US') : speak(text)
    onReplay?.()
  }

  return (
    <div>
      <div className="question-counter">Question {index + 1} of {total}</div>

      {question.context && (
        <div className={`question-context subject-${subject}`}>
          {question.context}
        </div>
      )}

      <div className="flex-row" style={{ alignItems: 'flex-start', gap: 12 }}>
        <p className="question-text" style={{ flex: 1 }}>{question.prompt}</p>
        <button
          className="btn btn--icon"
          onClick={handleReplay}
          title="Read question aloud"
          aria-label="Replay question"
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          🔊
        </button>
      </div>
    </div>
  )
}
