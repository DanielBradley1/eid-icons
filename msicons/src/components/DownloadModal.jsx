import { useState, useEffect, useCallback } from 'react'
import { formatCategory } from '../utils/format'
import { downloadSVG, downloadPNG } from '../utils/download'

const PNG_SIZES = [16, 24, 32, 48, 64, 128, 256, 512]

function DownloadModal({ icon, onClose }) {
  const [pngSize, setPngSize] = useState(64)
  const [status, setStatus] = useState('idle') // idle | downloading | done | error

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSVG = useCallback(async () => {
    setStatus('downloading')
    try {
      await downloadSVG(icon.path, icon.name)
      setStatus('done')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 1500)
  }, [icon])

  const handlePNG = useCallback(async () => {
    setStatus('downloading')
    try {
      await downloadPNG(icon.path, icon.name, pngSize)
      setStatus('done')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 1500)
  }, [icon, pngSize])

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Download icon">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-preview">
          <img src={icon.path} alt={icon.name} className="modal-icon" />
        </div>

        <div className="modal-info">
          <h2 className="modal-name">{icon.name}</h2>
          <p className="modal-category">{formatCategory(icon.category)}</p>
          <p className="modal-id">{icon.id}</p>
        </div>

        {status === 'error' && (
          <p className="modal-status error">Download failed. Please try again.</p>
        )}
        {status === 'done' && (
          <p className="modal-status success">Download started!</p>
        )}

        <div className="modal-actions">
          {/* SVG Download */}
          <div className="download-section">
            <div className="section-header">
              <span className="section-label">SVG</span>
              <span className="section-hint">Scalable vector – any size</span>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSVG}
              disabled={status === 'downloading'}
            >
              {status === 'downloading' ? 'Downloading…' : '↓ Download SVG'}
            </button>
          </div>

          {/* PNG Download */}
          <div className="download-section">
            <div className="section-header">
              <span className="section-label">PNG</span>
              <span className="section-hint">Rasterised at selected size</span>
            </div>
            <div className="size-selector" role="group" aria-label="Select PNG size">
              {PNG_SIZES.map(size => (
                <button
                  key={size}
                  className={`size-btn${pngSize === size ? ' active' : ''}`}
                  onClick={() => setPngSize(size)}
                  aria-pressed={pngSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              className="btn btn-secondary"
              onClick={handlePNG}
              disabled={status === 'downloading'}
            >
              {status === 'downloading' ? 'Downloading…' : `↓ Download ${pngSize}×${pngSize} PNG`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadModal
