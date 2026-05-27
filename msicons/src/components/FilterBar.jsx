import { formatCategory } from '../App'

function FilterBar({ categories, active, onChange }) {
  return (
    <nav className="filter-bar" aria-label="Filter by category">
      <div className="filter-bar-inner">
        <button
          className={`filter-btn${active === 'all' ? ' active' : ''}`}
          onClick={() => onChange('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn${active === cat ? ' active' : ''}`}
            onClick={() => onChange(cat)}
          >
            {formatCategory(cat)}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default FilterBar
