import IconCard from './IconCard'

function IconGrid({ icons, onSelect }) {
  return (
    <div className="icon-grid" role="list">
      {icons.map(icon => (
        <IconCard key={icon.id} icon={icon} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default IconGrid
