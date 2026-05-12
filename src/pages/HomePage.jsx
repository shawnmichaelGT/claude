import { useEffect, useState } from 'react'
import SubjectCard from '../components/home/SubjectCard'
import { getProgress } from '../utils/storage'

const SUBJECTS = ['math', 'science', 'ela', 'spanish']

export default function HomePage() {
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  if (!progress) return null

  const totalQuizzes = SUBJECTS.reduce((sum, s) => sum + (progress[s]?.totalQuizzes || 0), 0)
  const totalCorrect = SUBJECTS.reduce((sum, s) => sum + (progress[s]?.totalCorrect || 0), 0)
  const totalAnswered = SUBJECTS.reduce((sum, s) => sum + (progress[s]?.totalAnswered || 0), 0)
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--font-size-heading)', fontWeight: 900, lineHeight: 1.1 }}>
        Hi there! 👋<br />
        <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-xl)' }}>
          What do you want to learn today?
        </span>
      </h1>

      <div className="subject-cards-grid">
        {SUBJECTS.map(s => (
          <SubjectCard
            key={s}
            subject={s}
            totalQuizzes={progress[s]?.totalQuizzes || 0}
            bestPct={progress[s]?.bestPct || 0}
          />
        ))}
      </div>

      {totalQuizzes > 0 && (
        <div className="stats-bar fade-in">
          <div className="stat-item">
            <div className="stat-number">{totalQuizzes}</div>
            <div className="stat-label">Quizzes Done</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{totalCorrect}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{overallPct}%</div>
            <div className="stat-label">Overall Score</div>
          </div>
        </div>
      )}
    </div>
  )
}
