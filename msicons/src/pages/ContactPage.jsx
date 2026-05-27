import Header from '../components/Header'
import Footer from '../components/Footer'

function ContactPage() {
  return (
    <div className="app">
      <Header />
      <main className="content-main">
        <article className="content-article">
          <h1 className="content-h1">Contact</h1>
          <p className="content-sub">
            Spotted a bug, have a feature idea, or just want to say hi? Get in touch.
          </p>

          <div className="content-body">
            <div className="contact-section">
              <p className="contact-label">Email</p>
              <a href="mailto:daniel@ourcloudnetwork.com" className="contact-email">
                daniel@ourcloudnetwork.com
              </a>
              <p className="contact-note">
                I read every message, but please bear with me on replies — this is a side project.
              </p>
            </div>

            <div className="contact-section">
              <p className="contact-label">Elsewhere</p>
              <ul className="contact-links">
                <li>
                  <a href="https://www.linkedin.com/in/danielbradley2/" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  {' '}— for professional connections
                </li>
                <li>
                  <a href="https://x.com/DanielatOCN" target="_blank" rel="noopener noreferrer">
                    X (@DanielatOCN)
                  </a>
                  {' '}— for quick questions and replies
                </li>
                <li>
                  <a href="https://ourcloudnetwork.com/" target="_blank" rel="noopener noreferrer">
                    ourcloudnetwork.com
                  </a>
                  {' '}— my blog
                </li>
              </ul>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
