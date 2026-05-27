import { useState } from 'react'

function IconCard({ icon, onSelect }) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      className="icon-card"
      onClick={() => onSelect(icon)}
      title={icon.name}
      role="listitem"
      aria-label={`${icon.name} icon`}
    >
      <div className="icon-img-wrapper">
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
    </button>
  )
}

export default IconCard
