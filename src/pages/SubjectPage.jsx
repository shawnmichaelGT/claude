import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getSubjectStats } from '../utils/storage'
import { BADGE_LABELS } from '../utils/quizHelpers'
import { MATH_TOPICS } from '../data/math'
import { SCIENCE_TOPICS } from '../data/science'
import { ELA_TOPICS } from '../data/ela'
import { SPANISH_TOPICS } from '../data/spanish'

const TOPICS_MAP = {
  math: MATH_TOPICS,
  science: SCIENCE_TOPICS,
  ela: ELA_TOPICS,
  spanish: SPANISH_TOPICS,
}

const SUBJECT_META = {
  math:    { label: 'Math', icon: '🔢', desc: 'Challenge yourself with Grade 5-6 math!' },
  science: { label: 'Science', icon: '🔬', desc: 'Explore space, life, earth & physical science.' },
  ela:     { label: 'English', icon: '📚', desc: 'Build your vocabulary, grammar & reading skills.' },
  spanish: { label: 'Spanish', icon: '🇪🇸', desc: 'Learn words, phrases, colors & more!' },
}

export default function SubjectPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const topics = TOPICS_MAP[subjectId] || []
  const meta = SUBJECT_META[subjectId] || { label: subjectId, icon: '📖', desc: '' }
  const stats = getSubjectStats(subjectId)

  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.id || '')

  const topicBest = stats.topicBests?.[selectedTopic]
  const canStart = !!selectedTopic

  function startQuiz() {
    if (canStart) navigate(`/quiz/${subjectId}/${selectedTopic}`)
  }

  return (
    <div className={`fade-in subject-${subjectId}`}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{meta.icon}</div>
        <h1 style={{ fontSize: 'var(--font-size-heading)', fontWeight: 900 }}>{meta.label}</h1>
        <p className="text-light" style={{ marginTop: 6 }}>{meta.desc}</p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, marginBottom: 4 }}>
          Pick a Topic
        </h2>
        <p className="text-sm text-light" style={{ marginBottom: 12 }}>
          Each quiz is 10 questions
        </p>
        <div className="topic-grid">
          {topics.map(t => (
            <button
              key={t.id}
              className={`topic-btn ${selectedTopic === t.id ? 'selected' : ''}`}
              onClick={() => setSelectedTopic(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {topicBest && (
          <p className="text-sm text-light mt-16">
            Your best for <strong>{topics.find(t => t.id === selectedTopic)?.label}</strong>: {topicBest.bestPct}% ({topicBest.quizCount} quiz{topicBest.quizCount !== 1 ? 'zes' : ''})
          </p>
        )}

        <div className="mt-24">
          <button
            className="btn btn--primary w-full"
            disabled={!canStart}
            onClick={startQuiz}
            style={{ background: 'var(--subject-color)' }}
          >
            Start Quiz! 🚀
          </button>
        </div>
      </div>

      {stats.badges.length > 0 && (
        <div className="card mt-24">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, marginBottom: 12 }}>
            Your Badges
          </h2>
          <div className="badge-row">
            {stats.badges.map(b => {
              const info = BADGE_LABELS[b]
              if (!info) return null
              return (
                <span key={b} className="badge">
                  <span className="badge-icon">{info.icon}</span>
                  {info.label}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
