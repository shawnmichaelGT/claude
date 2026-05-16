const KEY = 'edu_progress'

const SUBJECTS = ['math', 'science', 'ela', 'spanish']

function defaultSubject() {
  return { totalQuizzes: 0, totalCorrect: 0, totalAnswered: 0, bestPct: 0, topicBests: {}, badges: [] }
}

function defaultProgress() {
  return Object.fromEntries(SUBJECTS.map(s => [s, defaultSubject()]))
}

let memoryFallback = null

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw)
    // Ensure all subjects exist
    SUBJECTS.forEach(s => { if (!parsed[s]) parsed[s] = defaultSubject() })
    return parsed
  } catch {
    if (!memoryFallback) memoryFallback = defaultProgress()
    return memoryFallback
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    memoryFallback = data
  }
}

export function getProgress() {
  return load()
}

export function getSubjectStats(subject) {
  return load()[subject] || defaultSubject()
}

export function saveQuizResult(subject, topicId, { score, total, pct }) {
  const data = load()
  const s = data[subject]

  s.totalQuizzes += 1
  s.totalCorrect += score
  s.totalAnswered += total
  if (pct > s.bestPct) s.bestPct = pct

  if (!s.topicBests[topicId] || pct > s.topicBests[topicId].bestPct) {
    s.topicBests[topicId] = { bestPct: pct, quizCount: (s.topicBests[topicId]?.quizCount || 0) + 1 }
  } else {
    s.topicBests[topicId].quizCount = (s.topicBests[topicId].quizCount || 0) + 1
  }

  // Determine new badges
  const newBadges = []
  const allBadges = s.badges

  if (!allBadges.includes(`${subject}-first`)) {
    newBadges.push(`${subject}-first`)
  }
  if (pct >= 70 && !allBadges.includes(`${subject}-bronze`)) {
    newBadges.push(`${subject}-bronze`)
  }
  if (pct >= 85 && !allBadges.includes(`${subject}-silver`)) {
    newBadges.push(`${subject}-silver`)
  }
  if (pct >= 95 && !allBadges.includes(`${subject}-gold`)) {
    newBadges.push(`${subject}-gold`)
  }

  s.badges = [...allBadges, ...newBadges]

  // all-rounder badge: all four subjects have at least one quiz
  const allBadgesFlat = [...Object.values(data).flatMap(d => d.badges || []), ...newBadges]
  const hasAllSubjects = SUBJECTS.every(sub => (data[sub].totalQuizzes + (sub === subject ? 1 : 0)) > 0)
  if (hasAllSubjects && !allBadgesFlat.includes('all-rounder')) {
    newBadges.push('all-rounder')
    s.badges.push('all-rounder')
  }

  save(data)
  return newBadges
}

export function getVoiceEnabled() {
  try { return localStorage.getItem('voice_enabled') !== 'false' } catch { return true }
}

export function setVoiceEnabled(val) {
  try { localStorage.setItem('voice_enabled', val ? 'true' : 'false') } catch {}
}

export function clearProgress() {
  try { localStorage.removeItem(KEY) } catch { memoryFallback = null }
}
