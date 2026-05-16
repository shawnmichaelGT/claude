import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import QuizEngine from '../components/quiz/QuizEngine'
import QuizSummary from '../components/quiz/QuizSummary'
import { getQuestions as getMathQ } from '../data/math'
import { getQuestions as getScienceQ } from '../data/science'
import { getQuestions as getElaQ } from '../data/ela'
import { getQuestions as getSpanishQ } from '../data/spanish'
import { saveQuizResult } from '../utils/storage'
import { calculateScore } from '../utils/quizHelpers'

const LOADERS = {
  math:    getMathQ,
  science: getScienceQ,
  ela:     getElaQ,
  spanish: getSpanishQ,
}

export default function QuizPage() {
  const { subjectId, topicId } = useParams()
  const [questions, setQuestions] = useState(null)
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])
  const [newBadges, setNewBadges] = useState([])

  useEffect(() => {
    const loader = LOADERS[subjectId]
    if (loader) {
      setQuestions(loader(topicId, 10))
    }
    setFinished(false)
    setResults([])
    setNewBadges([])
  }, [subjectId, topicId])

  function handleFinish(finalResults) {
    const { correct, total, pct } = calculateScore(finalResults)
    const badges = saveQuizResult(subjectId, topicId, { score: correct, total, pct })
    setResults(finalResults)
    setNewBadges(badges)
    setFinished(true)
  }

  function handlePlayAgain() {
    const loader = LOADERS[subjectId]
    if (loader) setQuestions(loader(topicId, 10))
    setFinished(false)
    setResults([])
    setNewBadges([])
  }

  if (!questions) {
    return (
      <div className="flex-center" style={{ minHeight: 200 }}>
        <span style={{ fontSize: 32 }}>Loading…</span>
      </div>
    )
  }

  if (finished) {
    return (
      <QuizSummary
        subject={subjectId}
        topic={topicId}
        results={results}
        newBadges={newBadges}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  return (
    <QuizEngine
      questions={questions}
      subject={subjectId}
      onFinish={handleFinish}
    />
  )
}
