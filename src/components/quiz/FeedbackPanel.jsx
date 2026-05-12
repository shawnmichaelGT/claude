import { useEffect } from 'react'
import { getVoiceEnabled } from '../../utils/storage'
import { speak, speakSpanish } from '../../utils/speechUtils'

export default function FeedbackPanel({ isCorrect, explanation, encouragement, correctAnswer, subject, onNext }) {
  useEffect(() => {
    if (getVoiceEnabled()) {
      const msg = `${encouragement}. ${explanation}`
      speak(msg)
    }
  }, [])

  const isSpanish = subject === 'spanish'

  return (
    <div className={`feedback-panel ${isCorrect ? 'correct-panel' : 'wrong-panel'} ${isCorrect ? 'bounce' : 'shake'}`}>
      <div className="feedback-title">
        {isCorrect ? '✅ ' : '❌ '}{encouragement}
      </div>
      <p className="feedback-explanation">{explanation}</p>

      {isSpanish && !isCorrect && (
        <button
          className="btn btn--icon mt-8"
          style={{ fontSize: 16, width: 'auto', padding: '6px 14px', borderRadius: 999 }}
          onClick={() => speakSpanish(correctAnswer)}
          title="Hear the Spanish pronunciation"
        >
          🔊 Hear it in Spanish
        </button>
      )}

      <div className="mt-16">
        <button className="btn btn--primary" onClick={onNext}>
          Next Question →
        </button>
      </div>
    </div>
  )
}
