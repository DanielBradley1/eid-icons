import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import IconGrid from '../components/IconGrid'
import { useFavorites } from '../context/FavoritesContext'
import { downloadFavoritesZip } from '../utils/favorites'
import icons from '../data/icons.json'

export default function FavoritesPage() {
  const { favorites, clear } = useFavorites()
  const [zipping, setZipping] = useState(false)
  const [zipDone, setZipDone] = useState(false)

  const favoriteIcons = icons.filter(i => favorites.includes(i.id))

  const handleZip = async () => {
    if (favoriteIcons.length === 0 || zipping) return
    setZipping(true)
    setZipDone(false)
    try {
      await downloadFavoritesZip(favoriteIcons)
      setZipDone(true)
      setTimeout(() => setZipDone(false), 2000)
    } catch {
      // fail silently
    }
    setZipping(false)
  }

  return (
    <div className="app">
      <Header />

      <div className="favourites-hero">
        <div className="favourites-hero-inner">
          <div className="favourites-hero-text">
            <h1 className="favourites-title">Your Saved Icons</h1>
            <p className="favourites-count">
              {favoriteIcons.length === 0
                ? 'No saved icons yet'
                : `${favoriteIcons.length} icon${favoriteIcons.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>

          {favoriteIcons.length > 0 && (
            <div className="favourites-actions">
              <button
                className="btn btn-primary"
                onClick={handleZip}
                disabled={zipping}
              >
                {zipping ? 'Preparing ZIP…' : zipDone ? '✓ Downloaded!' : `↓ Download All as ZIP`}
              </button>
              <button
                className="btn btn-secondary"
                onClick={clear}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="main">
        {favoriteIcons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤍</div>
            <p className="empty-title">No saved icons yet</p>
            <p className="empty-sub">
              Browse icons and click the heart to save your favourites.{' '}
              <Link to="/" className="back-link">Browse all icons →</Link>
            </p>
          </div>
        ) : (
          <IconGrid icons={favoriteIcons} />
        )}
      </main>

      <Footer />
    </div>
  )
}
