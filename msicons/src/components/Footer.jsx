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
        <nav className="footer-nav" aria-label="Footer links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href="https://ourcloudnetwork.com/" target="_blank" rel="noopener noreferrer">Blog</a>
          <a href="https://msmessagecenter.com/" target="_blank" rel="noopener noreferrer">MS Message Center</a>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
