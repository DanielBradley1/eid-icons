/**
 * generate-stubs.cjs
 *
 * Run after `vite build`. For every icon slug and static route, copies
 * dist/index.html into dist/<slug>/index.html so that GitHub Pages returns
 * HTTP 200 (not 404) for all deep-link URLs. Without this, GitHub Pages only
 * serves the root index.html with 200; every other path returns 404, which
 * prevents Google from indexing any icon page.
 */

'use strict'

const fs   = require('fs')
const path = require('path')

const distDir   = path.join(__dirname, 'dist')
const iconsPath = path.join(__dirname, 'src', 'data', 'icons.json')

const icons    = JSON.parse(fs.readFileSync(iconsPath, 'utf-8'))
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

/** Mirrors the iconSlug() helper in src/utils/format.js */
function iconSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function writeStub(slug) {
  // Write dist/<slug>.html (not dist/<slug>/index.html). GitHub Pages serves
  // foo.html at /foo with HTTP 200 and no trailing-slash redirect. Using a
  // subdirectory would cause GitHub Pages to 301 /foo → /foo/ which breaks
  // canonical URLs and confuses search engines.
  fs.writeFileSync(path.join(distDir, `${slug}.html`), template)
}

// Static app routes
const staticRoutes = ['about', 'contact', 'favorites']
for (const route of staticRoutes) {
  writeStub(route)
}

// Icon routes (deduplicated — some icons share the same slug)
const seen = new Set()
for (const icon of icons) {
  const slug = iconSlug(icon.name)
  if (seen.has(slug)) continue
  seen.add(slug)
  writeStub(slug)
}

console.log(
  `✓ Generated ${seen.size} icon stub pages + ${staticRoutes.length} static route stubs.`
)
