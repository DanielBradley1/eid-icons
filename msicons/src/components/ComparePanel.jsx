import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { formatCategory, iconSlug as toSlug } from '../utils/format'
import { downloadSVG } from '../utils/download'
import icons from '../data/icons.json'

function CompareModal({ items, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Compare icons">
      <div className={`compare-modal compare-modal-${items.length}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close comparison">✕</button>
        <h2 className="compare-modal-title">Compare Icons</h2>
        <div className={`compare-items compare-items-${items.length}`}>
          {items.map(icon => (
            <div key={`${icon.id}-${icon.slug}`} className="compare-item">
              <div className="compare-img-wrap">
                <img src={icon.path} alt={icon.name} className="compare-img" />
              </div>
              <p className="compare-item-category">{formatCategory(icon.category)}</p>
              <p className="compare-item-name">{icon.name}</p>
              <p className="compare-item-id">{icon.id}</p>
              <div className="compare-item-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => downloadSVG(icon.path, icon.name)}
                >
                  ↓ SVG
                </button>
                <Link
                  to={`/${toSlug(icon.name)}`}
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ComparePanel() {
  const { compareList, toggle, clear } = useCompare()
  const [showModal, setShowModal] = useState(false)

  const items = icons.filter(i => compareList.includes(i.id))

  if (compareList.length === 0) return null

  return (
    <>
      <div className="compare-panel" role="region" aria-label="Icons selected for comparison">
        <div className="compare-panel-inner">
          <span className="compare-panel-count">{compareList.length} / 3 selected</span>

          <div className="compare-panel-icons">
            {items.map(icon => (
            <div key={`${icon.id}-${icon.slug}`} className="compare-panel-thumb">
                <img src={icon.path} alt={icon.name} title={icon.name} />
                <button
                  className="compare-panel-remove"
                  onClick={() => toggle(icon.id)}
                  aria-label={`Remove ${icon.name} from comparison`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="compare-panel-actions">
            <button
              className="compare-btn-now"
              onClick={() => setShowModal(true)}
              disabled={compareList.length < 2}
            >
              Compare →
            </button>
            <button className="compare-btn-clear" onClick={clear}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <CompareModal items={items} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
