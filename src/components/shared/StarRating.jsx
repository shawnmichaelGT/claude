import { getStars } from '../../utils/quizHelpers'

export default function StarRating({ pct, animate = false }) {
  const count = getStars(pct)
  return (
    <div className="stars" aria-label={`${count} out of 3 stars`}>
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={`star ${i <= count ? 'filled' : ''} ${animate && i <= count ? 'pop' : ''}`}
          style={animate ? { animationDelay: `${(i - 1) * 0.15}s` } : {}}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}
