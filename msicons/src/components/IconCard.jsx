import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { iconSlug } from '../utils/format'
import { copySVGText } from '../utils/clipboard'
import { useFavorites } from '../context/FavoritesContext'
import { useCompare } from '../context/CompareContext'

function IconCard({ icon }) {
  const [imgError, setImgError] = useState(false)
  const [bg, setBg] = useState('white')   // 'white' | 'dark' | 'grid'
  const [copying, setCopying] = useState(false)  // false | 'doing' | 'done'

  const { favorites, toggle: toggleFav } = useFavorites()
  const { compareList, toggle: toggleCompare } = useCompare()

  const isFav = favorites.includes(icon.id)
  const inCompare = compareList.includes(icon.id)
  const canCompare = compareList.length < 3 || inCompare
  const isNew = icon.category === 'new icons'

  const handleFav = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFav(icon.id)
  }, [icon.id, toggleFav])

  const handleCopy = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (copying) return
    setCopying('doing')
    try {
      await copySVGText(icon.path)
    } catch {
      // still show done state
    }
    setCopying('done')
    setTimeout(() => setCopying(false), 1500)
  }, [icon.path, copying])

  const handleCompare = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canCompare) return
    toggleCompare(icon.id)
  }, [icon.id, canCompare, toggleCompare])

  const handleBg = useCallback((e, newBg) => {
    e.preventDefault()
    e.stopPropagation()
    setBg(prev => prev === newBg ? 'white' : newBg)
  }, [])

  const imgWrapClass = `icon-img-wrapper${bg === 'dark' ? ' bg-dark' : bg === 'grid' ? ' bg-grid' : ''}`
  const cardClass = `icon-card${inCompare ? ' in-compare' : ''}`

  return (
    <div className={cardClass} role="listitem">
      {isNew && <span className="new-badge" aria-label="New icon">New</span>}

      <Link
        className="icon-card-link"
        to={`/${iconSlug(icon.name)}`}
        aria-label={`${icon.name} — view details`}
      >
        <div className={imgWrapClass}>
          {imgError ? (
            <div className="icon-img-placeholder" aria-hidden="true">?</div>
          ) : (
            <img
              src={icon.path}
              alt=""
              className="icon-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <span className="icon-name">{icon.name}</span>
      </Link>

      {/* Hover-visible action toolbar */}
      <div className="card-toolbar" role="toolbar" aria-label="Icon actions">
        {/* Background toggles */}
        <div className="bg-dots" aria-label="Preview background">
          <button
            className={`bg-dot${bg === 'white' ? ' active' : ''}`}
            onClick={(e) => handleBg(e, 'white')}
            title="Light background"
            aria-label="Light background"
            aria-pressed={bg === 'white'}
          />
          <button
            className={`bg-dot bg-dot-dark${bg === 'dark' ? ' active' : ''}`}
            onClick={(e) => handleBg(e, 'dark')}
            title="Dark background"
            aria-label="Dark background"
            aria-pressed={bg === 'dark'}
          />
          <button
            className={`bg-dot bg-dot-grid${bg === 'grid' ? ' active' : ''}`}
            onClick={(e) => handleBg(e, 'grid')}
            title="Transparent background"
            aria-label="Transparent background"
            aria-pressed={bg === 'grid'}
          />
        </div>

        {/* Action buttons */}
        <div className="card-acts">
          <button
            className={`card-act-btn${isFav ? ' fav-active' : ''}`}
            onClick={handleFav}
            title={isFav ? 'Remove from saved' : 'Save icon'}
            aria-label={isFav ? 'Remove from saved' : 'Save icon'}
            aria-pressed={isFav}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <button
            className={`card-act-btn${copying === 'done' ? ' copy-done' : ''}`}
            onClick={handleCopy}
            title="Copy SVG to clipboard"
            aria-label="Copy SVG to clipboard"
          >
            {copying === 'done' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>

          <button
            className={`card-act-btn${inCompare ? ' compare-active' : ''}${!canCompare && !inCompare ? ' compare-disabled' : ''}`}
            onClick={handleCompare}
            title={inCompare ? 'Remove from compare' : !canCompare ? 'Max 3 icons' : 'Add to compare'}
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
            aria-pressed={inCompare}
            disabled={!canCompare && !inCompare}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="18" rx="1"/>
              <rect x="14" y="3" width="7" height="18" rx="1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default IconCard
