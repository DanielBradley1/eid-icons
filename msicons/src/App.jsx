import { useMemo, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import icons from './data/icons.json'
import Header from './components/Header'
import IconGrid from './components/IconGrid'
import Footer from './components/Footer'
import ComparePanel from './components/ComparePanel'
import IconPage from './pages/IconPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FavoritesPage from './pages/FavoritesPage'
import { FavoritesProvider } from './context/FavoritesContext'
import { CompareProvider } from './context/CompareContext'
import { formatCategory } from './utils/format'
import { searchIcons } from './utils/search'
import './App.css'

const ICONS_PER_PAGE = 80

const allCategories = [...new Set(icons.map(i => i.category))].sort((a, b) =>
  a.localeCompare(b)
)

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const hasFilters = search.trim() !== '' || category !== 'all'

  const setSearch = useCallback((val) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('q', val); else next.delete('q')
      next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setCategory = useCallback((cat) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (cat !== 'all') next.set('category', cat); else next.delete('category')
      next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setPage = useCallback((p) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (p > 1) next.set('page', String(p)); else next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const filtered = useMemo(() => searchIcons(icons, search, category), [search, category])

  const totalPages = Math.ceil(filtered.length / ICONS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ICONS_PER_PAGE, page * ICONS_PER_PAGE)

  return (
    <div className="app">
      <Header />

      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="welcome-inner">
          <p>
            A community-built icon browser for Microsoft architecture icons, helping you find,
            preview, and download the icons you need for diagrams, documentation, and presentations.
            This is a personal project by Microsoft MVP{' '}
            <a href="https://www.linkedin.com/in/danielbradley2/" target="_blank" rel="noopener noreferrer">
              Daniel Bradley
            </a>
            , not affiliated with Microsoft in any way. Icons are the property of Microsoft and subject
            to their respective terms of use.
          </p>
        </div>
      </div>

      {/* Search + Filter panel */}
      <div className="search-section">
        <div className="search-section-inner">
          <div className="search-box-row">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                className="search-input"
                placeholder="Search by name, e.g. Virtual Machine, Storage, Kubernetes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search icons"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
              )}
            </div>
          </div>

          <div className="filters-row">
            <select
              className="filter-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{formatCategory(cat)}</option>
              ))}
            </select>

            {hasFilters && (
              <button className="clear-btn" onClick={clearFilters}>Clear filters</button>
            )}

            <span className="results-info">
              {filtered.length.toLocaleString()} of {icons.length.toLocaleString()} icons
              {search.trim() ? ` for "${search.trim()}"` : ''}
            </span>
          </div>
        </div>
      </div>

      <main className="main">
        {paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-title">No icons found</p>
            <p className="empty-sub">Try a different search term or category</p>
          </div>
        ) : (
          <IconGrid icons={paginated} />
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              ← Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next →
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function AppInner() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/:iconSlug" element={<IconPage />} />
      </Routes>
      <ComparePanel />
    </>
  )
}

function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </CompareProvider>
    </FavoritesProvider>
  )
}

export default App
