import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import SubjectPage from './pages/SubjectPage'
import QuizPage from './pages/QuizPage'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/quiz/:subjectId/:topicId" element={<QuizPage />} />
        </Routes>
      </main>
    </div>
  )
}
