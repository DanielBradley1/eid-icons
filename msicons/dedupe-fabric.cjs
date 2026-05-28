/**
 * dedupe-fabric.cjs
 * For each icon base+variant group (e.g. add_pipeline_non-item),
 * keeps only the largest size, renames it to remove the size number,
 * and deletes all other size variants.
 * Then appends all fabric icons to icons.json.
 * Run with: node dedupe-fabric.cjs
 */
const fs = require('fs');
const path = require('path');

const fabricDir = path.join(__dirname, 'public', 'icons', 'fabric');
const manifestPath = path.join(__dirname, 'src', 'data', 'icons.json');

const KNOWN_SIZES = new Set(['10','12','16','20','24','28','32','40','48','64']);
const KNOWN_VARIANTS = ['non-item','filled','regular','item','color','filed'];

// Build a regex that matches _SIZE_VARIANT at the end of a filename (before .svg)
const variantPat = KNOWN_VARIANTS.map(v => v.replace('-', '\\-')).join('|');
const sizePat = [...KNOWN_SIZES].join('|');
const iconRe = new RegExp(`^(.+)_(${sizePat})_(${variantPat})\\.svg$`);

const files = fs.readdirSync(fabricDir).filter(f => f.endsWith('.svg'));

// Group files by base+variant key
const groups = new Map();
for (const file of files) {
  const m = file.match(iconRe);
  if (m) {
    const base = `${m[1]}_${m[3]}`; // e.g. "add_pipeline_non-item"
    const size = parseInt(m[2], 10);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push({ file, size });
  } else {
    // No size in name — treat as already clean, no action needed
    if (!groups.has(file.replace(/\.svg$/, ''))) {
      groups.set(file.replace(/\.svg$/, ''), [{ file, size: -1 }]);
    }
  }
}

let deleted = 0;
let renamed = 0;
const finalFiles = [];

for (const [base, members] of groups) {
  // Sort largest size first
  members.sort((a, b) => b.size - a.size);
  const keep = members[0];
  const targetName = `${base}.svg`;
  const targetPath = path.join(fabricDir, targetName);

  // Delete smaller duplicates first
  for (const m of members.slice(1)) {
    fs.unlinkSync(path.join(fabricDir, m.file));
    deleted++;
  }

  // Rename keeper if it has a size in its name
  if (keep.size !== -1) {
    fs.renameSync(path.join(fabricDir, keep.file), targetPath);
    renamed++;
  }

  finalFiles.push(targetName);
}

console.log(`Deleted: ${deleted} duplicates`);
console.log(`Renamed: ${renamed} files`);
console.log(`Total fabric icons remaining: ${finalFiles.length}`);

// --- Update icons.json ---
const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Remove any old fabric entries
const nonFabric = existing.filter(i => i.slug !== 'fabric');

// Build new fabric entries
const fabricEntries = finalFiles.sort().map(file => {
  const id = file.replace(/\.svg$/, '');
  // Convert underscores to spaces and title-case for display name
  const name = id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return {
    id,
    name,
    category: 'fabric',
    slug: 'fabric',
    path: `/icons/fabric/${file}`
  };
});

const updated = [...nonFabric, ...fabricEntries];
fs.writeFileSync(manifestPath, JSON.stringify(updated, null, 2));
console.log(`icons.json: added ${fabricEntries.length} fabric entries (${updated.length} total)`);
