export default function ProgressBar({ current, total, subject }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className={`subject-${subject}`} style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="text-sm text-light font-bold">Question {current} of {total}</span>
        <span className="text-sm text-light font-bold">{pct}%</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
