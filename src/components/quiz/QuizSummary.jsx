import { useNavigate } from 'react-router-dom'
import StarRating from '../shared/StarRating'
import Badge from '../shared/Badge'
import { calculateScore, pickRandom, FINISH_MESSAGES } from '../../utils/quizHelpers'
import { speak, stopSpeaking } from '../../utils/speechUtils'
import { getVoiceEnabled } from '../../utils/storage'
import { useEffect } from 'react'

export default function QuizSummary({ subject, topic, results, newBadges, onPlayAgain }) {
  const navigate = useNavigate()
  const { correct, total, pct } = calculateScore(results)
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0
  const message = pickRandom(FINISH_MESSAGES[stars])

  useEffect(() => {
    if (getVoiceEnabled()) {
      stopSpeaking()
      speak(`Quiz finished! You got ${correct} out of ${total}. ${message}`)
    }
  }, [])

  return (
    <div className="card summary-wrap fade-in">
      <div style={{ fontSize: 56, marginBottom: 8 }}>
        {stars === 3 ? '🏆' : stars === 2 ? '🎉' : stars === 1 ? '💪' : '📚'}
      </div>

      <div className="summary-score">{correct}/{total}</div>
      <div className="summary-pct">{pct}% correct</div>

      <div className="mt-16">
        <StarRating pct={pct} animate />
      </div>

      <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginTop: 20 }}>
        {message}
      </p>

      {newBadges.length > 0 && (
        <div className="mt-16">
          <p className="text-sm text-light font-bold" style={{ marginBottom: 10 }}>
            🏅 New Badge{newBadges.length > 1 ? 's' : ''} Earned!
          </p>
          <div className="badge-row">
            {newBadges.map(b => <Badge key={b} id={b} />)}
          </div>
        </div>
      )}

      <div className="flex-row mt-32" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
        <button className="btn btn--primary" onClick={onPlayAgain}>
          Play Again 🔄
        </button>
        <button
          className="btn btn--secondary"
          onClick={() => { stopSpeaking(); navigate(`/subject/${subject}`) }}
        >
          Change Topic
        </button>
        <button
          className="btn btn--secondary"
          onClick={() => { stopSpeaking(); navigate('/') }}
        >
          Home 🏠
        </button>
      </div>
    </div>
  )
}
