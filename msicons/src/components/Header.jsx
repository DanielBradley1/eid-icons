function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" href="/" aria-label="MSIcons home">
          <span className="logo-text">
            <span className="logo-ms">MS</span> Icons
          </span>
          <span className="logo-sub">A public repository of Microsoft architecture icons</span>
        </a>

        <nav className="header-nav" aria-label="Site links">
          <a href="https://msmessagecenter.com/" target="_blank" rel="noopener noreferrer" className="nav-link">
            MS Message Center
          </a>
          <a href="https://msdocstracker.com/" target="_blank" rel="noopener noreferrer" className="nav-link">
            MSDocsTracker
          </a>
          <a href="https://ourcloudnetwork.com/" target="_blank" rel="noopener noreferrer" className="nav-link">
            Blog
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
