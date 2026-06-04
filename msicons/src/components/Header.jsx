import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'

function Header() {
  const { favorites } = useFavorites()

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo" to="/" aria-label="MSIcons home">
          <img src="/android-chrome-192x192.png" alt="" className="logo-img" aria-hidden="true" />
          <div className="logo-text-wrap">
            <span className="logo-text">
              <span className="logo-ms">MS</span> Icons
            </span>
            <span className="logo-sub">A public repository of Microsoft architecture icons</span>
          </div>
        </Link>

        <nav className="header-nav" aria-label="Site links">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/submit" className="nav-link">Submit Icon</Link>
          <span className="nav-divider" aria-hidden="true"></span>
          <a href="https://msmessagecenter.com/" target="_blank" rel="noopener noreferrer" className="nav-link">
            MS Message Center
          </a>
          <a href="https://msdocstracker.com/" target="_blank" rel="noopener noreferrer" className="nav-link">
            MSDocsTracker
          </a>
          <a href="https://ourcloudnetwork.com/" target="_blank" rel="noopener noreferrer" className="nav-link">
            Blog
          </a>
          <Link
            to="/favorites"
            className="nav-link nav-favourites"
            aria-label={`Saved icons${favorites.length > 0 ? ` (${favorites.length})` : ''}`}
            title="Your saved icons"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill={favorites.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favorites.length > 0 && (
              <span className="fav-nav-count" aria-hidden="true">{favorites.length}</span>
            )}
          </Link>
          <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="nav-link rss-link" aria-label="RSS Feed">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20 4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
