import IconCard from './IconCard'

function IconGrid({ icons }) {
  return (
    <div className="icon-grid" role="list">
      {icons.map(icon => (
        <IconCard key={icon.id} icon={icon} />
      ))}
    </div>
  )
}

export default IconGrid
