export function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function calculateScore(results) {
  const correct = results.filter(Boolean).length
  const total = results.length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  return { correct, total, pct }
}

export function getStars(pct) {
  if (pct >= 90) return 3
  if (pct >= 70) return 2
  if (pct >= 50) return 1
  return 0
}

export function normalizeAnswer(str) {
  if (str === null || str === undefined) return ''
  return String(str).trim().toLowerCase().replace(/[.,!?;:]+$/, '')
}

export function answersMatch(userAnswer, correctAnswer) {
  const u = normalizeAnswer(userAnswer)
  const c = normalizeAnswer(correctAnswer)
  if (u === c) return true
  // Numeric equivalence
  const uNum = parseFloat(u)
  const cNum = parseFloat(c)
  if (!isNaN(uNum) && !isNaN(cNum) && uNum === cNum) return true
  // Strip "x =" prefix for algebra
  const stripX = s => s.replace(/^x\s*=\s*/, '').trim()
  if (stripX(u) === stripX(c)) return true
  return false
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const CORRECT_MESSAGES = [
  "Amazing! You nailed it! 🎉",
  "That's right! You're on fire! 🔥",
  "Excellent work! Keep it up! ⭐",
  "Brilliant! You're so smart! 🧠",
  "Perfect! Nothing stops you! 💪",
  "Wow, great job! 🌟",
  "Correct! You're a star! ✨",
]

export const WRONG_MESSAGES = [
  "Not quite — but you're learning! 💡",
  "Good try! Check the explanation below.",
  "Almost there! You've got this! 🌟",
  "That's okay — every mistake teaches us something!",
  "Keep going — you're getting stronger! 💪",
]

export const FINISH_MESSAGES = {
  3: ["WOW! You're a superstar! 🌟🌟🌟", "Perfect performance! You're incredible! 🏆"],
  2: ["Great job! You really know your stuff! 🎊", "Awesome work! Almost perfect! 🎉"],
  1: ["Good effort! Practice makes perfect! 📚", "You tried hard — keep going! 💪"],
  0: ["Don't give up! Every quiz makes you smarter! 🧠", "You'll do even better next time! 💪"],
}

export const BADGE_LABELS = {
  'math-first':      { icon: '🔢', label: 'First Math Quiz!' },
  'math-bronze':     { icon: '🥉', label: 'Math Bronze' },
  'math-silver':     { icon: '🥈', label: 'Math Silver' },
  'math-gold':       { icon: '🥇', label: 'Math Gold' },
  'science-first':   { icon: '🔬', label: 'First Science Quiz!' },
  'science-bronze':  { icon: '🥉', label: 'Science Bronze' },
  'science-silver':  { icon: '🥈', label: 'Science Silver' },
  'science-gold':    { icon: '🥇', label: 'Science Gold' },
  'ela-first':       { icon: '📚', label: 'First ELA Quiz!' },
  'ela-bronze':      { icon: '🥉', label: 'ELA Bronze' },
  'ela-silver':      { icon: '🥈', label: 'ELA Silver' },
  'ela-gold':        { icon: '🥇', label: 'ELA Gold' },
  'spanish-first':   { icon: '🇪🇸', label: 'First Spanish Quiz!' },
  'spanish-bronze':  { icon: '🥉', label: 'Spanish Bronze' },
  'spanish-silver':  { icon: '🥈', label: 'Spanish Silver' },
  'spanish-gold':    { icon: '🥇', label: 'Spanish Gold' },
  'all-rounder':     { icon: '🌍', label: 'All-Rounder!' },
}
