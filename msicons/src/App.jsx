import { useState, useMemo, useCallback } from 'react'
import icons from './data/icons.json'
import Header from './components/Header'
import IconGrid from './components/IconGrid'
import DownloadModal from './components/DownloadModal'
import { formatCategory } from './utils/format'
import './App.css'

const ICONS_PER_PAGE = 80

const allCategories = [...new Set(icons.map(i => i.category))].sort((a, b) =>
  a.localeCompare(b)
)

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedIcon, setSelectedIcon] = useState(null)

  const hasFilters = search.trim() !== '' || category !== 'all'

  const clearFilters = useCallback(() => {
    setSearch('')
    setCategory('all')
    setPage(1)
  }, [])

  const filtered = useMemo(() => {
    let result = icons
    if (category !== 'all') {
      result = result.filter(i => i.category === category)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(q))
    }
    return result
  }, [search, category])

  const totalPages = Math.ceil(filtered.length / ICONS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ICONS_PER_PAGE, page * ICONS_PER_PAGE)

  const handleSearch = useCallback((val) => {
    setSearch(val)
    setPage(1)
  }, [])

  const handleCategory = useCallback((cat) => {
    setCategory(cat)
    setPage(1)
  }, [])

  return (
    <div className="app">
      <Header />

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
                onChange={e => handleSearch(e.target.value)}
                aria-label="Search icons"
              />
              {search && (
                <button className="search-clear" onClick={() => handleSearch('')} aria-label="Clear search">✕</button>
              )}
            </div>
          </div>

          <div className="filters-row">
            <select
              className="filter-select"
              value={category}
              onChange={e => handleCategory(e.target.value)}
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
          <IconGrid icons={paginated} onSelect={setSelectedIcon} />
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              ← Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next →
            </button>
          </div>
        )}
      </main>

      {selectedIcon && (
        <DownloadModal icon={selectedIcon} onClose={() => setSelectedIcon(null)} />
      )}
    </div>
  )
}



export default App
