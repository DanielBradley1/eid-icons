import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useCallback, useMemo, useEffect } from 'react'
import icons from '../data/icons.json'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { formatCategory, iconSlug as toSlug } from '../utils/format'
import { downloadSVG, downloadPNG } from '../utils/download'
import { copyText } from '../utils/clipboard'
import { useFavorites } from '../context/FavoritesContext'
import { useCompare } from '../context/CompareContext'

const PNG_SIZES = [16, 24, 32, 48, 64, 128, 256, 512]
const EMBED_SIZES = [32, 48, 64, 96, 128]
const CODE_TABS = ['React', 'HTML', 'Markdown', 'URL']

function IconPage() {
  const { iconSlug } = useParams()
  const navigate = useNavigate()
  const icon = icons.find(i => toSlug(i.name) === iconSlug)

  const [pngSize, setPngSize] = useState(64)
  const [status, setStatus] = useState('idle') // idle | downloading | done | error
  const [previewBg, setPreviewBg] = useState('white') // white | dark | grid
  const [codeTab, setCodeTab] = useState('React')
  const [embedSize, setEmbedSize] = useState(64)
  const [codeCopied, setCodeCopied] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)

  const { favorites, toggle: toggleFav } = useFavorites()
  const { compareList, toggle: toggleCompare } = useCompare()
  const isFav = icon ? favorites.includes(icon.id) : false
  const inCompare = icon ? compareList.includes(icon.id) : false
  const canCompare = compareList.length < 3 || inCompare

  const related = icon
    ? icons.filter(i => i.category === icon.category && i.id !== icon.id).slice(0, 12)
    : []

  useEffect(() => {
    if (icon) {
      document.title = `${icon.name} - MS Icons`
      const desc = document.querySelector('meta[name="description"]')
      if (desc) desc.setAttribute('content', `Download the ${icon.name} icon in SVG and PNG format. Part of the Microsoft architecture icon library on MS Icons.`)
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) canonical.setAttribute('href', `https://msicons.com/${iconSlug}`)
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', `${icon.name} - MS Icons`)
      const ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.setAttribute('content', `https://msicons.com/${iconSlug}`)

      const iconUrl = `https://msicons.com${icon.path}`
      const pageUrl = `https://msicons.com/${iconSlug}`
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        '@id': `${pageUrl}#image`,
        url: iconUrl,
        contentUrl: iconUrl,
        name: `${icon.name} Icon`,
        description: `Official high-resolution transparent SVG icon for ${icon.name}, optimized for cloud architecture diagrams.`,
        caption: `${icon.name} cloud architecture icon in vector SVG format.`,
        width: '512',
        height: '512',
        fileFormat: 'image/svg+xml',
        author: {
          '@type': 'Organization',
          name: 'MS Icons',
          url: 'https://msicons.com',
        },
        creator: {
          '@type': 'Person',
          name: 'Daniel Bradley',
          url: 'https://www.linkedin.com/in/danielbradley2/',
        },
        copyrightHolder: {
          '@type': 'Organization',
          name: 'Microsoft Corporation',
          description: 'Brand assets and trademarks belong to Microsoft.',
        },
        copyrightNotice: 'Trademark owned by Microsoft Corporation. Vector asset provided by MS Icons.',
        license: 'https://msicons.com/about',
        acquireLicensePage: `${pageUrl}/download`,
      }
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'icon-page-jsonld'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => {
      document.title = 'MS Icons – Microsoft Architecture Icon Library'
      const desc = document.querySelector('meta[name="description"]')
      if (desc) desc.setAttribute('content', 'Browse, search, filter and download all 700+ official Microsoft architecture icons in SVG and PNG format at any size. A free community resource by Daniel Bradley, Microsoft MVP.')
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) canonical.setAttribute('href', 'https://msicons.com/')
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', 'MS Icons – Microsoft Architecture Icon Library')
      const ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.setAttribute('content', 'https://msicons.com/')
      const existing = document.getElementById('icon-page-jsonld')
      if (existing) existing.remove()
    }
  }, [icon, iconSlug])

  const codeSnippets = useMemo(() => {
    if (!icon) return {}
    const origin = window.location.origin
    return {
      React:    `<img\n  src="${origin}${icon.path}"\n  alt="${icon.name}"\n  width={64}\n  height={64}\n/>`,
      HTML:     `<img\n  src="${origin}${icon.path}"\n  alt="${icon.name}"\n  width="64"\n  height="64"\n>`,
      Markdown: `![${icon.name}](${origin}${icon.path})`,
      URL:      `${origin}${icon.path}`,
    }
  }, [icon])

  const embedCode = useMemo(() => {
    if (!icon) return ''
    const origin = window.location.origin
    return `<a href="${origin}/${toSlug(icon.name)}" target="_blank" rel="noopener noreferrer">\n  <img\n    src="${origin}${icon.path}"\n    alt="${icon.name}"\n    width="${embedSize}"\n    height="${embedSize}"\n  >\n</a>`
  }, [icon, embedSize])

  const handleSVG = useCallback(async () => {
    if (!icon) return
    setStatus('downloading')
    try {
      await downloadSVG(icon.path, icon.name)
      setStatus('done')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 1500)
  }, [icon])

  const handlePNG = useCallback(async () => {
    if (!icon) return
    setStatus('downloading')
    try {
      await downloadPNG(icon.path, icon.name, pngSize)
      setStatus('done')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 1500)
  }, [icon, pngSize])

  const handleCodeCopy = useCallback(async () => {
    try {
      await copyText(codeSnippets[codeTab])
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 1500)
    } catch { /* ignore */ }
  }, [codeSnippets, codeTab])

  const handleEmbedCopy = useCallback(async () => {
    try {
      await copyText(embedCode)
      setEmbedCopied(true)
      setTimeout(() => setEmbedCopied(false), 1500)
    } catch { /* ignore */ }
  }, [embedCode])

  if (!icon) {
    return (
      <div className="app">
        <Header />
        <main className="main">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-title">Icon not found</p>
            <p className="empty-sub">
              <Link to="/" className="back-link">← Back to all icons</Link>
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />

      <main className="main icon-page-main">
        <div className="icon-page-back">
          <button className="back-link" onClick={() => navigate(-1)} aria-label="Go back">
            ← Back
          </button>
          <span className="back-sep">/</span>
          <Link to={`/?category=${encodeURIComponent(icon.category)}`} className="back-crumb">
            {formatCategory(icon.category)}
          </Link>
        </div>

        <div className="icon-page-layout">
          {/* Left: preview */}
          <div className="icon-page-preview">
            <div className="preview-bg-toggle" role="group" aria-label="Preview background">
              {['white', 'dark', 'grid'].map(bg => (
                <button
                  key={bg}
                  className={`preview-bg-btn${previewBg === bg ? ' active' : ''}`}
                  onClick={() => setPreviewBg(bg)}
                  aria-pressed={previewBg === bg}
                >
                  {bg === 'white' ? 'Light' : bg === 'dark' ? 'Dark' : 'Transparent'}
                </button>
              ))}
            </div>
            <div className={`icon-page-img-wrap${previewBg === 'dark' ? ' bg-dark' : previewBg === 'grid' ? ' bg-grid' : ''}`}>
              <img src={icon.path} alt={icon.name} className="icon-page-img" />
            </div>
          </div>

          {/* Right: info + downloads */}
          <div className="icon-page-info">
            <p className="icon-page-category">{formatCategory(icon.category)}</p>
            <h1 className="icon-page-name">{icon.name}</h1>
            <p className="icon-page-id">{icon.id}</p>

            {/* Quick actions: favourite + compare */}
            <div className="icon-page-quick-actions">
              <button
                className={`icon-page-act-btn${isFav ? ' active' : ''}`}
                onClick={() => toggleFav(icon.id)}
                aria-pressed={isFav}
              >
                <svg viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {isFav ? 'Saved' : 'Save'}
              </button>
              <button
                className={`icon-page-act-btn${inCompare ? ' active' : ''}`}
                onClick={() => canCompare && toggleCompare(icon.id)}
                disabled={!canCompare && !inCompare}
                aria-pressed={inCompare}
                title={!canCompare && !inCompare ? 'Max 3 icons in compare' : undefined}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="18" rx="1"/>
                  <rect x="14" y="3" width="7" height="18" rx="1"/>
                </svg>
                {inCompare ? 'In compare' : 'Compare'}
              </button>
            </div>

            {status === 'error' && (
              <p className="modal-status error">Download failed. Please try again.</p>
            )}
            {status === 'done' && (
              <p className="modal-status success">Download started!</p>
            )}

            <div className="icon-page-downloads">
              <div className="download-section">
                <div className="section-header">
                  <span className="section-label">SVG</span>
                  <span className="section-hint">Scalable vector – any size</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleSVG}
                  disabled={status === 'downloading'}
                >
                  {status === 'downloading' ? 'Downloading…' : '↓ Download SVG'}
                </button>
              </div>

              <div className="download-section">
                <div className="section-header">
                  <span className="section-label">PNG</span>
                  <span className="section-hint">Select a size then download</span>
                </div>
                <div className="size-selector">
                  {PNG_SIZES.map(s => (
                    <button
                      key={s}
                      className={`size-btn${pngSize === s ? ' active' : ''}`}
                      onClick={() => setPngSize(s)}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={handlePNG}
                  disabled={status === 'downloading'}
                >
                  {status === 'downloading' ? 'Downloading…' : `↓ Download PNG (${pngSize}px)`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <h2 className="related-title">More from {formatCategory(icon.category)}</h2>
              <Link
                to={`/?category=${encodeURIComponent(icon.category)}`}
                className="related-view-all"
              >
                View all →
              </Link>
            </div>
            <div className="related-grid">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/${toSlug(rel.name)}`}
                  className="related-card"
                  title={rel.name}
                >
                  <div className="related-img-wrap">
                    <img src={rel.path} alt="" className="related-img" loading="lazy" />
                  </div>
                  <span className="related-name">{rel.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Copy as code ──────────────────────────────────── */}
        <section className="code-section" aria-label="Copy as code">
          <h2 className="code-section-title">Use this icon</h2>
          <div className="code-tabs" role="tablist">
            {CODE_TABS.map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={codeTab === tab}
                className={`code-tab${codeTab === tab ? ' active' : ''}`}
                onClick={() => setCodeTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="code-block" role="tabpanel">
            <pre className="code-pre">{codeSnippets[codeTab]}</pre>
            <button
              className={`code-copy-btn${codeCopied ? ' copied' : ''}`}
              onClick={handleCodeCopy}
              aria-label="Copy code snippet"
            >
              {codeCopied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* ── Embed widget ──────────────────────────────────── */}
        <section className="embed-section" aria-label="Embed widget">
          <h2 className="embed-section-title">Embed on your site</h2>
          <p className="embed-section-desc">
            Paste this snippet to embed the icon with a link back to its page.
          </p>
          <div className="embed-size-selector">
            <span className="embed-size-label">Size:</span>
            {EMBED_SIZES.map(s => (
              <button
                key={s}
                className={`size-btn${embedSize === s ? ' active' : ''}`}
                onClick={() => setEmbedSize(s)}
              >
                {s}px
              </button>
            ))}
          </div>
          <div className="code-block">
            <pre className="code-pre">{embedCode}</pre>
            <button
              className={`code-copy-btn${embedCopied ? ' copied' : ''}`}
              onClick={handleEmbedCopy}
              aria-label="Copy embed code"
            >
              {embedCopied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default IconPage
