/**
 * generate-manifest.cjs
 * Run with: node generate-manifest.cjs
 * Copies all SVG icons from ../icons/ into public/icons/ and generates src/data/icons.json
 * Folder names are slugified to avoid URL encoding issues (e.g. "ai + machine learning" → "ai-machine-learning")
 */
const fs = require('fs');
const path = require('path');

const iconsSourceDir = path.join(__dirname, '..', 'icons');
const iconsDestDir = path.join(__dirname, 'public', 'icons');
const manifestPath = path.join(__dirname, 'src', 'data', 'icons.json');

/** Convert a category folder name into a clean URL-safe slug */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s*\+\s*/g, '-')   // "ai + machine learning" → "ai-machine learning"
    .replace(/\s+/g, '-')         // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '')   // strip all other chars
    .replace(/-+/g, '-')          // collapse multiple hyphens
    .replace(/^-|-$/g, '');       // trim leading/trailing hyphens
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Clear old public/icons to avoid stale slugged folders from previous runs
if (fs.existsSync(iconsDestDir)) {
  fs.rmSync(iconsDestDir, { recursive: true, force: true });
}
ensureDir(iconsDestDir);
ensureDir(path.join(__dirname, 'src', 'data'));

const icons = [];
const processedCategories = [];

const categoryFolders = fs.readdirSync(iconsSourceDir).filter(item =>
  fs.statSync(path.join(iconsSourceDir, item)).isDirectory()
);

for (const category of categoryFolders) {
  const categoryPath = path.join(iconsSourceDir, category);
  const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.svg'));

  if (files.length === 0) continue;

  processedCategories.push(category);

  const slug = slugify(category);
  const categoryDestPath = path.join(iconsDestDir, slug);
  ensureDir(categoryDestPath);

  for (const file of files) {
    fs.copyFileSync(
      path.join(categoryPath, file),
      path.join(categoryDestPath, file)
    );

    const id = file.replace(/\.svg$/, '');
    const name = id
      .replace(/^\d+-/, '')
      .replace(/^icon-service-/, '')
      .replace(/-/g, ' ')
      .trim();

    icons.push({
      id,
      name,
      category,
      slug,
      path: `/icons/${slug}/${file}`
    });
  }

  process.stdout.write(`  ✓ ${category} (${files.length} icons)\n`);
}

fs.writeFileSync(manifestPath, JSON.stringify(icons, null, 2));
console.log(`\nDone! ${icons.length} icons across ${processedCategories.length} categories → src/data/icons.json`);

// ── SEO files ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://msicons.app';

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

