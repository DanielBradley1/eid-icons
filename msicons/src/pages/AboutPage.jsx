import Header from '../components/Header'
import Footer from '../components/Footer'

function AboutPage() {
  return (
    <div className="app">
      <Header />
      <main className="content-main">
        <article className="content-article">
          <h1 className="content-h1">Who am I?</h1>
          <p className="content-sub">A short introduction to the person behind this project.</p>

          <div className="content-body">
            <p>
              Hi, I'm <strong>Daniel Bradley</strong>, a Microsoft MVP focused on Microsoft 365,
              security, and the wider Microsoft cloud ecosystem. I work day-to-day helping
              organisations get more value out of their Microsoft 365 estate, with a particular
              focus on automation, identity, and admin tooling.
            </p>
            <p>
              I built <strong>MS Icons</strong> as a community project — a faster, cleaner way to
              find and download Microsoft Azure architecture icons than hunting through official
              documentation. It's not affiliated with Microsoft in any way; it's just something I
              wanted to exist. Icons remain the property of Microsoft and are subject to their
              respective terms of use.
            </p>
            <p>
              Outside of this site, I write about Microsoft 365 on my blog{' '}
              <a href="https://ourcloudnetwork.com/" target="_blank" rel="noopener noreferrer">
                ourcloudnetwork.com
              </a>{' '}
              and run{' '}
              <a href="https://msmessagecenter.com/" target="_blank" rel="noopener noreferrer">
                MS Message Center
              </a>
              , a community viewer for Microsoft 365 Message Center announcements, and{' '}
              <a href="https://msdocstracker.com/" target="_blank" rel="noopener noreferrer">
                MSDocsTracker
              </a>
              , a tool that tracks changes to Microsoft Learn documentation.
            </p>
            <p>
              If you'd like to connect, the best places are{' '}
              <a href="https://www.linkedin.com/in/danielbradley2/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>{' '}
              or{' '}
              <a href="https://x.com/DanielatOCN" target="_blank" rel="noopener noreferrer">
                X
              </a>
              .
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
