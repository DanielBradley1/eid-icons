import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">
          © {year} MS Icons — a community project by{' '}
          <a href="https://www.linkedin.com/in/danielbradley2/" target="_blank" rel="noopener noreferrer">
            Daniel Bradley
          </a>
          . Not affiliated with Microsoft.
        </p>
        <p className="footer-disclaimer">
          Icons are property of Microsoft. Please review the official terms of use:{' '}
          <a href="https://learn.microsoft.com/en-us/azure/architecture/icons/#icon-terms" target="_blank" rel="noopener noreferrer">Azure</a>
          {', '}
          <a href="https://learn.microsoft.com/en-us/entra/architecture/architecture-icons" target="_blank" rel="noopener noreferrer">Entra</a>
          {', '}
          <a href="https://learn.microsoft.com/en-us/previous-versions/microsoft-365/solutions/architecture-icons-templates" target="_blank" rel="noopener noreferrer">Microsoft 365</a>
          {', '}
          <a href="https://learn.microsoft.com/en-us/power-platform/guidance/icons" target="_blank" rel="noopener noreferrer">Power Platform</a>
          .
        </p>
        <nav className="footer-nav" aria-label="Footer links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/submit">Submit Icon</Link>
          <a href="https://ourcloudnetwork.com/" target="_blank" rel="noopener noreferrer">Blog</a>
          <a href="https://msmessagecenter.com/" target="_blank" rel="noopener noreferrer">MS Message Center</a>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
