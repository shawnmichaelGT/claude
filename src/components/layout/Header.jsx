import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getVoiceEnabled, setVoiceEnabled } from '../../utils/storage'
import { isTTSSupported, stopSpeaking } from '../../utils/speechUtils'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [voiceOn, setVoiceOn] = useState(getVoiceEnabled)

  useEffect(() => {
    setVoiceEnabled(voiceOn)
    if (!voiceOn) stopSpeaking()
  }, [voiceOn])

  return (
    <header className="app-header">
      {isHome ? (
        <span className="app-header-logo">🌟 Learning Adventure</span>
      ) : (
        <Link to="/" className="app-header-logo">← Home</Link>
      )}
      <div className="header-actions">
        {isTTSSupported() && (
          <button
            className="btn btn--icon"
            onClick={() => setVoiceOn(v => !v)}
            title={voiceOn ? 'Turn voice off' : 'Turn voice on'}
            aria-label={voiceOn ? 'Voice on — click to mute' : 'Voice off — click to enable'}
          >
            {voiceOn ? '🔊' : '🔇'}
          </button>
        )}
      </div>
    </header>
  )
}
