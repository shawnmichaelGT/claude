import { useNavigate } from 'react-router-dom'

const META = {
  math:    { icon: '🔢', label: 'Math' },
  science: { icon: '🔬', label: 'Science' },
  ela:     { icon: '📚', label: 'English' },
  spanish: { icon: '🇪🇸', label: 'Spanish' },
}

export default function SubjectCard({ subject, totalQuizzes, bestPct }) {
  const navigate = useNavigate()
  const { icon, label } = META[subject] || { icon: '📖', label: subject }

  return (
    <button
      className={`subject-card subject-${subject}`}
      onClick={() => navigate(`/subject/${subject}`)}
      aria-label={`${label} — ${totalQuizzes} quizzes completed`}
    >
      <span className="subject-card-icon">{icon}</span>
      <div className="subject-card-name">{label}</div>
      <div className="subject-card-stats">
        {totalQuizzes > 0
          ? `Best: ${bestPct}% · ${totalQuizzes} quiz${totalQuizzes !== 1 ? 'zes' : ''}`
          : 'Tap to start!'}
      </div>
    </button>
  )
}
