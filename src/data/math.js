import { shuffleArray } from '../utils/quizHelpers'
import { generateMathQuestion } from '../utils/mathGenerator'

export const MATH_TOPICS = [
  { id: 'multiplication', label: 'Multiplication' },
  { id: 'division',       label: 'Division' },
  { id: 'fractions',      label: 'Fractions' },
  { id: 'decimals',       label: 'Decimals' },
  { id: 'algebra',        label: 'Algebra' },
  { id: 'geometry',       label: 'Geometry' },
  { id: 'wordproblems',   label: 'Word Problems' },
  { id: 'mixed',          label: 'Mixed!' },
]

export const STATIC_MATH = [
  // ── Multiplication ──
  {
    id:'math-mult-001', subject:'math', topic:'multiplication',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 47 × 8?',
    context:null,
    choices:['376','356','368','384'],
    answer:'376',
    explanation:'47 × 8: (40 × 8) + (7 × 8) = 320 + 56 = 376.',
  },
  {
    id:'math-mult-002', subject:'math', topic:'multiplication',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 63 × 7?',
    context:null,
    choices:['441','423','432','449'],
    answer:'441',
    explanation:'63 × 7: (60 × 7) + (3 × 7) = 420 + 21 = 441.',
  },
  {
    id:'math-mult-003', subject:'math', topic:'multiplication',
    type:'multiple-choice', difficulty:3, generated:false,
    prompt:'What is 124 × 13?',
    context:null,
    choices:['1612','1508','1524','1620'],
    answer:'1612',
    explanation:'124 × 13 = 124 × 10 + 124 × 3 = 1240 + 372 = 1612.',
  },
  // ── Division ──
  {
    id:'math-div-001', subject:'math', topic:'division',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 252 ÷ 7?',
    context:null,
    choices:['36','34','38','32'],
    answer:'36',
    explanation:'7 × 36 = 252. You can check: 7 × 30 = 210, 7 × 6 = 42, 210 + 42 = 252.',
  },
  {
    id:'math-div-002', subject:'math', topic:'division',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 396 ÷ 9?',
    context:null,
    choices:['44','42','46','40'],
    answer:'44',
    explanation:'9 × 44 = 396. Check: 9 × 40 = 360, 9 × 4 = 36, 360 + 36 = 396.',
  },
  // ── Fractions ──
  {
    id:'math-frac-001', subject:'math', topic:'fractions',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 3/4 + 1/6?',
    context:null,
    choices:['4/10','11/12','5/6','7/12'],
    answer:'11/12',
    explanation:'Common denominator is 12. 3/4 = 9/12, 1/6 = 2/12. 9/12 + 2/12 = 11/12.',
  },
  {
    id:'math-frac-002', subject:'math', topic:'fractions',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'Which fraction is greater: 5/8 or 3/5?',
    context:null,
    choices:['5/8','3/5','They are equal','Cannot be determined'],
    answer:'5/8',
    explanation:'Convert to the same denominator (40): 5/8 = 25/40, 3/5 = 24/40. Since 25 > 24, 5/8 is greater.',
  },
  {
    id:'math-frac-003', subject:'math', topic:'fractions',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 2/3 × 3/4?',
    context:null,
    choices:['1/2','5/7','6/12','2/4'],
    answer:'1/2',
    explanation:'Multiply across: (2×3)/(3×4) = 6/12. Simplify: 6/12 = 1/2.',
  },
  // ── Decimals ──
  {
    id:'math-dec-001', subject:'math', topic:'decimals',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 4.75 + 2.8?',
    context:null,
    choices:['7.55','7.45','6.55','7.65'],
    answer:'7.55',
    explanation:'4.75 + 2.80 = 7.55. Line up the decimal points when adding.',
  },
  {
    id:'math-dec-002', subject:'math', topic:'decimals',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is 3.6 × 5?',
    context:null,
    choices:['18.0','16.5','17.0','18.5'],
    answer:'18.0',
    explanation:'3.6 × 5 = 18.0. Think of it as 36 tenths × 5 = 180 tenths = 18.0.',
  },
  // ── Algebra ──
  {
    id:'math-alg-001', subject:'math', topic:'algebra',
    type:'free-input', difficulty:2, generated:false,
    prompt:'Solve for x:  3x + 7 = 22',
    context:null, choices:null,
    answer:'5',
    explanation:'Subtract 7 from both sides: 3x = 15. Divide both sides by 3: x = 5.',
  },
  {
    id:'math-alg-002', subject:'math', topic:'algebra',
    type:'free-input', difficulty:2, generated:false,
    prompt:'Solve for x:  5x − 4 = 31',
    context:null, choices:null,
    answer:'7',
    explanation:'Add 4 to both sides: 5x = 35. Divide both sides by 5: x = 7.',
  },
  {
    id:'math-alg-003', subject:'math', topic:'algebra',
    type:'free-input', difficulty:3, generated:false,
    prompt:'Solve for x:  4x + 3 = 2x + 13',
    context:null, choices:null,
    answer:'5',
    explanation:'Subtract 2x from both sides: 2x + 3 = 13. Subtract 3: 2x = 10. Divide by 2: x = 5.',
  },
  {
    id:'math-alg-004', subject:'math', topic:'algebra',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'If n + 15 = 34, what is n?',
    context:null,
    choices:['19','17','21','49'],
    answer:'19',
    explanation:'Subtract 15 from both sides: n = 34 − 15 = 19.',
  },
  // ── Geometry ──
  {
    id:'math-geo-001', subject:'math', topic:'geometry',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'A rectangle is 12 cm long and 5 cm wide. What is its area?',
    context:null,
    choices:['34 cm²','60 cm²','17 cm²','120 cm²'],
    answer:'60 cm²',
    explanation:'Area of a rectangle = length × width = 12 × 5 = 60 cm².',
  },
  {
    id:'math-geo-002', subject:'math', topic:'geometry',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'What is the perimeter of a square with side length 9 cm?',
    context:null,
    choices:['18 cm','27 cm','36 cm','81 cm'],
    answer:'36 cm',
    explanation:'Perimeter of a square = 4 × side = 4 × 9 = 36 cm.',
  },
  {
    id:'math-geo-003', subject:'math', topic:'geometry',
    type:'multiple-choice', difficulty:3, generated:false,
    prompt:'A triangle has a base of 10 cm and a height of 6 cm. What is its area?',
    context:null,
    choices:['60 cm²','30 cm²','16 cm²','48 cm²'],
    answer:'30 cm²',
    explanation:'Area of a triangle = ½ × base × height = ½ × 10 × 6 = 30 cm².',
  },
  {
    id:'math-geo-004', subject:'math', topic:'geometry',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'A circle has a radius of 7 cm. Using π ≈ 3.14, what is its area (rounded)?',
    context:null,
    choices:['44 cm²','154 cm²','43.96 cm²','196 cm²'],
    answer:'154 cm²',
    explanation:'Area = π × r² ≈ 3.14 × 7² = 3.14 × 49 ≈ 153.86 ≈ 154 cm².',
  },
  // ── Word Problems ──
  {
    id:'math-word-001', subject:'math', topic:'wordproblems',
    type:'multiple-choice', difficulty:3, generated:false,
    prompt:'A store sells 3 boxes of 48 cookies each. If 27 cookies are eaten, how many remain?',
    context:null,
    choices:['117','119','105','144'],
    answer:'117',
    explanation:'3 × 48 = 144 cookies total. 144 − 27 = 117 remaining.',
  },
  {
    id:'math-word-002', subject:'math', topic:'wordproblems',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'Maya reads 35 pages per day. How many pages will she read in 2 weeks?',
    context:null,
    choices:['350','245','420','490'],
    answer:'490',
    explanation:'2 weeks = 14 days. 35 × 14 = 490 pages.',
  },
  {
    id:'math-word-003', subject:'math', topic:'wordproblems',
    type:'multiple-choice', difficulty:3, generated:false,
    prompt:'A recipe needs 3/4 cup of sugar. If you make 6 batches, how much sugar do you need?',
    context:null,
    choices:['4 cups','4.5 cups','5 cups','3.5 cups'],
    answer:'4.5 cups',
    explanation:'3/4 × 6 = 18/4 = 4.5 cups (or 4 and 1/2 cups).',
  },
  {
    id:'math-word-004', subject:'math', topic:'wordproblems',
    type:'multiple-choice', difficulty:2, generated:false,
    prompt:'A train travels at 80 km/h. How far does it travel in 2.5 hours?',
    context:null,
    choices:['160 km','180 km','200 km','220 km'],
    answer:'200 km',
    explanation:'Distance = speed × time = 80 × 2.5 = 200 km.',
  },
]

const GENERATABLE_TOPICS = ['multiplication', 'division', 'fractions', 'decimals', 'algebra']

export function getQuestions(topic, count = 10) {
  let bank
  if (topic === 'mixed') {
    bank = STATIC_MATH
  } else {
    bank = STATIC_MATH.filter(q => q.topic === topic)
  }

  const shuffled = shuffleArray(bank)
  const questions = []

  // 40% from static bank
  const staticCount = Math.ceil(count * 0.4)
  questions.push(...shuffled.slice(0, staticCount))

  // Fill rest from generator (if topic is generatable)
  const genTopics = topic === 'mixed' ? GENERATABLE_TOPICS : [topic]
  const generatable = genTopics.some(t => GENERATABLE_TOPICS.includes(t))

  while (questions.length < count) {
    if (generatable) {
      const genTopic = topic === 'mixed'
        ? GENERATABLE_TOPICS[Math.floor(Math.random() * GENERATABLE_TOPICS.length)]
        : topic
      const q = generateMathQuestion(genTopic, 2)
      if (q) questions.push(q)
      else if (bank.length > 0) questions.push(shuffled[questions.length % shuffled.length])
      else break
    } else if (bank.length > 0) {
      questions.push(shuffled[questions.length % shuffled.length])
    } else break
  }

  return questions.slice(0, count)
}
