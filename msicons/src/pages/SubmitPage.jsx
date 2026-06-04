import Header from '../components/Header'
import Footer from '../components/Footer'

const SUBMIT_URL =
  'https://github.com/DanielBradley1/msicons/issues/new?template=icon-submission.yml'

function SubmitPage() {
  return (
    <div className="app">
      <Header />
      <main className="content-main">
        <article className="content-article">
          <h1 className="content-h1">Submit an Icon</h1>
          <p className="content-sub">
            Know of a Microsoft icon that's missing from the library? Submit it via a GitHub issue.
          </p>

          <div className="content-body">
            <div className="contact-section">
              <p>
                Submissions are handled through GitHub Issues. You'll need a free GitHub account
                to submit. Fill in the form with the icon name, category, and either paste the SVG
                code directly or attach the <code>.svg</code> file to the issue after submitting.
              </p>
              <p>
                All submitted icons are reviewed before being added to the library. Icons must come
                from an official Microsoft source and are subject to Microsoft's terms of use.
              </p>
              <a
                href={SUBMIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="submit-btn"
              >
                Open submission form on GitHub →
              </a>
            </div>

            <div className="contact-section">
              <p className="contact-label">What to include</p>
              <ul className="contact-links">
                <li>The icon name as it should appear on the site</li>
                <li>The category it belongs to</li>
                <li>The SVG file or code (pasted or attached)</li>
                <li>A link to the official Microsoft source page</li>
              </ul>
            </div>

            <div className="contact-section">
              <p className="contact-label">Don't have a GitHub account?</p>
              <p>
                You can email the icon directly to{' '}
                <a href="mailto:daniel@ourcloudnetwork.com">daniel@ourcloudnetwork.com</a>{' '}
                with the icon name, category, and the <code>.svg</code> file attached.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default SubmitPage
