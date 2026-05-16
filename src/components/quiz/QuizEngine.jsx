import { useState } from 'react'
import QuestionDisplay from './QuestionDisplay'
import AnswerChoices from './AnswerChoices'
import FreeInput from './FreeInput'
import FeedbackPanel from './FeedbackPanel'
import ProgressBar from '../layout/ProgressBar'
import { answersMatch, pickRandom, CORRECT_MESSAGES, WRONG_MESSAGES } from '../../utils/quizHelpers'
import { stopSpeaking } from '../../utils/speechUtils'

export default function QuizEngine({ questions, subject, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [results, setResults] = useState([])
  const [encouragement, setEncouragement] = useState('')

  const question = questions[currentIndex]

  function handleAnswer(answer) {
    if (answered) return
    const correct = answersMatch(answer, question.answer)
    setSelectedAnswer(answer)
    setAnswered(true)
    setResults(r => [...r, correct])
    setEncouragement(pickRandom(correct ? CORRECT_MESSAGES : WRONG_MESSAGES))
  }

  function handleNext() {
    stopSpeaking()
    if (currentIndex + 1 >= questions.length) {
      const finalResults = [...results]
      onFinish(finalResults)
    } else {
      setCurrentIndex(i => i + 1)
      setAnswered(false)
      setSelectedAnswer(null)
      setEncouragement('')
    }
  }

  const isCorrect = answered && answersMatch(selectedAnswer, question.answer)

  return (
    <div className="fade-in">
      <ProgressBar current={currentIndex + (answered ? 1 : 0)} total={questions.length} subject={subject} />

      <div className={`card subject-${subject}`}>
        <QuestionDisplay
          question={question}
          index={currentIndex}
          total={questions.length}
          subject={subject}
        />

        <div className="mt-16">
          {question.type === 'free-input' ? (
            <FreeInput
              onSubmit={handleAnswer}
              answered={answered}
              correctAnswer={question.answer}
              inputMode={subject === 'math' ? 'numeric' : 'text'}
            />
          ) : (
            <AnswerChoices
              choices={question.choices}
              selectedAnswer={selectedAnswer}
              answered={answered}
              correctAnswer={question.answer}
              onSelect={handleAnswer}
              subject={subject}
            />
          )}
        </div>

        {answered && (
          <FeedbackPanel
            isCorrect={isCorrect}
            explanation={question.explanation}
            encouragement={encouragement}
            correctAnswer={question.answer}
            subject={subject}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  )
}
