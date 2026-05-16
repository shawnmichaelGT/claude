function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function wrongChoices(correct, count, min, max) {
  const wrongs = new Set()
  const c = Number(correct)
  while (wrongs.size < count) {
    let v = c + rand(-Math.ceil(Math.abs(c) * 0.4 + 5), Math.ceil(Math.abs(c) * 0.4 + 5))
    if (v < min) v = c + rand(1, 10)
    if (v !== c && !wrongs.has(v)) wrongs.add(v)
  }
  return [...wrongs].map(String)
}

function makeChoices(correct, min = -999, max = 9999) {
  const wrongs = wrongChoices(correct, 3, min, max)
  const all = [String(correct), ...wrongs]
  // Shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

let genId = 0
function id(topic) {
  return `math-gen-${topic}-${Date.now()}-${genId++}`
}

export function generateMultiplication(difficulty = 2) {
  let a, b
  if (difficulty === 1) { a = rand(2, 9); b = rand(2, 9) }
  else if (difficulty === 2) { a = rand(12, 99); b = rand(2, 9) }
  else { a = rand(12, 99); b = rand(12, 99) }
  const answer = a * b
  return {
    id: id('mult'), subject: 'math', topic: 'multiplication',
    type: 'multiple-choice', difficulty,
    prompt: `What is ${a} × ${b}?`,
    context: null,
    choices: makeChoices(answer, 0),
    answer: String(answer),
    explanation: `${a} × ${b} = ${answer}`,
    generated: true,
  }
}

export function generateDivision(difficulty = 2) {
  let quotient, divisor
  if (difficulty === 1) { quotient = rand(2, 9); divisor = rand(2, 9) }
  else if (difficulty === 2) { quotient = rand(10, 99); divisor = rand(2, 9) }
  else { quotient = rand(10, 99); divisor = rand(2, 12) }
  const dividend = quotient * divisor
  return {
    id: id('div'), subject: 'math', topic: 'division',
    type: 'multiple-choice', difficulty,
    prompt: `What is ${dividend} ÷ ${divisor}?`,
    context: null,
    choices: makeChoices(quotient, 1),
    answer: String(quotient),
    explanation: `${dividend} ÷ ${divisor} = ${quotient}. Check: ${quotient} × ${divisor} = ${dividend}.`,
    generated: true,
  }
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }
function lcm(a, b) { return (a * b) / gcd(a, b) }
function simplify(num, den) {
  const g = gcd(Math.abs(num), Math.abs(den))
  return [num / g, den / g]
}
function fracStr(n, d) { return d === 1 ? String(n) : `${n}/${d}` }

export function generateFractionAddSub(difficulty = 2) {
  const op = Math.random() < 0.5 ? '+' : '-'
  let n1, d1, n2, d2
  if (difficulty === 1) {
    d1 = rand(2, 8); d2 = d1
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1)
  } else {
    d1 = rand(2, 6); d2 = rand(2, 6)
    while (d2 === d1) d2 = rand(2, 8)
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1)
  }
  const commonD = lcm(d1, d2)
  const resNum = op === '+' ? (n1 * (commonD / d1)) + (n2 * (commonD / d2))
                             : (n1 * (commonD / d1)) - (n2 * (commonD / d2))
  if (resNum <= 0) return generateFractionAddSub(difficulty)
  const [sn, sd] = simplify(resNum, commonD)
  const answer = fracStr(sn, sd)

  const wrongOptions = []
  const alts = [[resNum + 1, commonD], [resNum - 1, commonD], [n1 + n2, Math.max(d1, d2)]]
  for (const [wn, wd] of alts) {
    if (wn > 0) { const [ws, wds] = simplify(wn, wd); wrongOptions.push(fracStr(ws, wds)) }
  }
  const uniqueWrongs = [...new Set(wrongOptions)].filter(w => w !== answer).slice(0, 3)
  while (uniqueWrongs.length < 3) uniqueWrongs.push(fracStr(rand(1,9), rand(2,9)))

  const all = [answer, ...uniqueWrongs.slice(0,3)]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }

  return {
    id: id('frac'), subject: 'math', topic: 'fractions',
    type: 'multiple-choice', difficulty,
    prompt: `What is ${fracStr(n1, d1)} ${op} ${fracStr(n2, d2)}?`,
    context: null,
    choices: all,
    answer,
    explanation: `Convert to a common denominator of ${commonD}: ${fracStr(n1*(commonD/d1), commonD)} ${op} ${fracStr(n2*(commonD/d2), commonD)} = ${fracStr(resNum, commonD)}${resNum !== sn || commonD !== sd ? ` = ${answer} (simplified)` : ''}.`,
    generated: true,
  }
}

export function generateDecimal(difficulty = 2) {
  const ops = ['+', '-', '×']
  const op = difficulty === 1 ? (Math.random() < 0.5 ? '+' : '-') : ops[rand(0, ops.length - 1)]
  let a, b, answer, explanation

  if (op === '+' || op === '-') {
    a = +(rand(10, 99) / 10).toFixed(1)
    b = +(rand(10, 99) / 10).toFixed(1)
    if (op === '-' && b > a) [a, b] = [b, a]
    answer = +(op === '+' ? a + b : a - b).toFixed(2)
    explanation = `${a} ${op} ${b} = ${answer}`
  } else {
    a = +(rand(10, 50) / 10).toFixed(1)
    b = rand(2, 9)
    answer = +(a * b).toFixed(2)
    explanation = `${a} × ${b} = ${answer}`
  }

  return {
    id: id('dec'), subject: 'math', topic: 'decimals',
    type: 'multiple-choice', difficulty,
    prompt: `What is ${a} ${op} ${b}?`,
    context: null,
    choices: makeChoices(answer, -99, 9999),
    answer: String(answer),
    explanation,
    generated: true,
  }
}

export function generateAlgebra(difficulty = 2) {
  if (difficulty === 1) {
    // x + a = b  or  x - a = b
    const x = rand(2, 20)
    const a = rand(1, 15)
    const op = Math.random() < 0.5 ? '+' : '-'
    const b = op === '+' ? x + a : x - a
    if (b <= 0) return generateAlgebra(difficulty)
    return {
      id: id('alg'), subject: 'math', topic: 'algebra',
      type: 'free-input', difficulty,
      prompt: `Solve for x: x ${op} ${a} = ${b}`,
      context: null, choices: null,
      answer: String(x),
      explanation: `${op === '+' ? 'Subtract' : 'Add'} ${a} from both sides: x = ${b} ${op === '+' ? '−' : '+'} ${a} = ${x}.`,
      generated: true,
    }
  } else if (difficulty === 2) {
    // ax + b = c
    const a = rand(2, 8); const x = rand(1, 12); const b = rand(1, 20)
    const c = a * x + b
    return {
      id: id('alg'), subject: 'math', topic: 'algebra',
      type: 'free-input', difficulty,
      prompt: `Solve for x: ${a}x + ${b} = ${c}`,
      context: null, choices: null,
      answer: String(x),
      explanation: `Subtract ${b} from both sides: ${a}x = ${c - b}. Divide both sides by ${a}: x = ${x}.`,
      generated: true,
    }
  } else {
    // ax + b = cx + d
    let a = rand(3, 8), c = rand(1, a - 1), b = rand(1, 15), x = rand(1, 10)
    const d = (a - c) * x + b
    return {
      id: id('alg'), subject: 'math', topic: 'algebra',
      type: 'free-input', difficulty,
      prompt: `Solve for x: ${a}x + ${b} = ${c}x + ${d}`,
      context: null, choices: null,
      answer: String(x),
      explanation: `Subtract ${c}x from both sides: ${a - c}x + ${b} = ${d}. Subtract ${b}: ${a - c}x = ${d - b}. Divide by ${a - c}: x = ${x}.`,
      generated: true,
    }
  }
}

const GENERATORS = {
  multiplication: generateMultiplication,
  division: generateDivision,
  fractions: generateFractionAddSub,
  decimals: generateDecimal,
  algebra: generateAlgebra,
}

export function generateMathQuestion(topic, difficulty = 2) {
  const gen = GENERATORS[topic]
  if (!gen) return null
  return gen(difficulty)
}
