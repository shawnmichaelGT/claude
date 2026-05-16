import { BADGE_LABELS } from '../../utils/quizHelpers'

export default function Badge({ id }) {
  const info = BADGE_LABELS[id]
  if (!info) return null
  return (
    <span className="badge pop-in" title={info.label}>
      <span className="badge-icon">{info.icon}</span>
      {info.label}
    </span>
  )
}
