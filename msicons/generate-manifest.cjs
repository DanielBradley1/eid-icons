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
