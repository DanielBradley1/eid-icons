/**
 * generate-manifest.cjs
 * Run with: node generate-manifest.cjs
 * Reads SVG icons directly from public/icons/ and generates src/data/icons.json
 */
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');
const manifestPath = path.join(__dirname, 'src', 'data', 'icons.json');

/** Derive a display category name from a folder/slug name */
function categoryFromFolder(folder) {
  return folder.toLowerCase().replace(/-/g, ' ');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Convert a PascalCase/underscore filename (without extension) to a display name.
 *  e.g. "BusinessCentral_scalable" → "Business Central"
 *       "AIBuilder_scalable"       → "AI Builder"
 */
function toDisplayName(id) {
  return id
    .replace(/_scalable$/, '')
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim();
}

ensureDir(path.join(__dirname, 'src', 'data'));

// Folders whose icon filenames use a colour-variant prefix instead of the standard naming
const colourVariantFolders = new Set(['microsoft-teams', 'Microsoft']);
const colourLabels = {
  'dark-purple': 'Dark Purple', 'grey-purple': 'Grey & Purple', 'light-purple': 'Light Purple',
  'dark-blue': 'Dark Blue',     'grey-blue': 'Grey & Blue',     'light-blue': 'Light Blue',
};

const icons = [];

const allFolders = fs.readdirSync(iconsDir)
  .filter(item => fs.statSync(path.join(iconsDir, item)).isDirectory())
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

for (const folder of allFolders) {
  const folderPath = path.join(iconsDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.svg')).sort();
  if (files.length === 0) continue;

  const slug = folder;
  const category = categoryFromFolder(folder);

  for (const file of files) {
    const id = file.replace(/\.svg$/, '');
    let name;

    if (colourVariantFolders.has(folder)) {
      const m = id.match(/^(dark-purple|grey-purple|light-purple|dark-blue|grey-blue|light-blue)-(.+)$/i);
      if (m) {
        name = `${m[2]} (${colourLabels[m[1].toLowerCase()]})`;
      } else {
        name = id.replace(/_/g, ' ');
      }
    } else if (/^\d+-icon-service-/.test(id)) {
      // Standard Azure icon naming: "00028-icon-service-Batch-AI" → "Batch AI"
      name = id
        .replace(/^\d+-/, '')
        .replace(/^icon-service-/, '')
        .replace(/-/g, ' ')
        .trim();
    } else {
      // Fabric-style CamelCase / underscore names
      // Also handle all-lowercase dash-separated names (e.g. "microsoft-office-sharepoint-2025")
      if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(id)) {
        name = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      } else {
        name = toDisplayName(id) || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    icons.push({ id, name, category, slug, path: `/icons/${folder}/${file}` });
  }

  process.stdout.write(`  ✓ ${folder} (${files.length} icons)\n`);
}

fs.writeFileSync(manifestPath, JSON.stringify(icons, null, 2));
console.log(`\nDone! ${icons.length} icons across ${allFolders.length} folders → src/data/icons.json`);

// ── SEO files ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://msicons.com';

/** Replicate src/utils/format.js iconSlug */
function iconNameSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const now = new Date().toISOString();
const nowRfc = new Date().toUTCString();

// Deduplicate icon pages by slug (in case two icons produce the same slug)
const seenSlugs = new Set();
const uniqueIconSlugs = [];
for (const icon of icons) {
  const s = iconNameSlug(icon.name);
  if (!seenSlugs.has(s)) {
    seenSlugs.add(s);
    uniqueIconSlugs.push({ slug: s, icon });
  }
}

// ── sitemap.xml ──────────────────────────────────────────────────────────────
const staticUrls = [
  { loc: BASE_URL + '/',        priority: '1.0', freq: 'daily'   },
  { loc: BASE_URL + '/about',   priority: '0.7', freq: 'monthly' },
  { loc: BASE_URL + '/contact', priority: '0.5', freq: 'monthly' },
];

const iconUrls = uniqueIconSlugs.map(({ slug }) => ({
  loc: `${BASE_URL}/${slug}`,
  priority: '0.6',
  freq: 'monthly',
}));

const allUrls = [...staticUrls, ...iconUrls];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u =>
  `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n    <lastmod>${now.split('T')[0]}</lastmod>\n  </url>`
).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapXml);
console.log(`  ✓ sitemap.xml  (${allUrls.length} URLs)`);

// ── feed.xml (RSS) ───────────────────────────────────────────────────────────
// RSS items: one per icon (all of them — useful for AI/feed readers)
const rssItems = uniqueIconSlugs.map(({ slug, icon }) => `
  <item>
    <title>${icon.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
    <link>${BASE_URL}/${slug}</link>
    <guid isPermaLink="true">${BASE_URL}/${slug}</guid>
    <description>Download the ${icon.name.replace(/&/g, '&amp;')} Microsoft Azure architecture icon (${icon.category}) in SVG and PNG format.</description>
    <category>${icon.category.replace(/&/g, '&amp;')}</category>
    <pubDate>${nowRfc}</pubDate>
  </item>`).join('');

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MS Icons – Microsoft Azure Architecture Icons</title>
    <link>${BASE_URL}</link>
    <description>Browse, search and download all Microsoft Azure architecture icons in SVG and PNG format. A free community resource by Daniel Bradley, Microsoft MVP.</description>
    <language>en-us</language>
    <lastBuildDate>${nowRfc}</lastBuildDate>
    <managingEditor>daniel@ourcloudnetwork.com (Daniel Bradley)</managingEditor>
    <webMaster>daniel@ourcloudnetwork.com (Daniel Bradley)</webMaster>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/favicon.ico</url>
      <title>MS Icons</title>
      <link>${BASE_URL}</link>
    </image>${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, 'public', 'feed.xml'), feedXml);
console.log(`  ✓ feed.xml     (${uniqueIconSlugs.length} items)`);

