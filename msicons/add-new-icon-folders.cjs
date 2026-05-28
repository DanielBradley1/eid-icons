/**
 * add-new-icon-folders.cjs
 * Adds icons from manually-placed public/icons folders to icons.json
 */
const fs = require('fs');
const path = require('path');

const publicIconsDir = path.join(__dirname, 'public', 'icons');
const manifestPath = path.join(__dirname, 'src', 'data', 'icons.json');

// Folders to process with their display category name
const newFolders = [
  { folder: 'agent-365',     category: 'agent 365',      slug: 'agent-365' },
  { folder: 'Copilot-studio',category: 'copilot studio', slug: 'Copilot-studio' },
  { folder: 'dynamics-365',  category: 'dynamics 365',   slug: 'dynamics-365' },
  { folder: 'power-platform', category: 'power platform', slug: 'power-platform' },
];

/** Convert a CamelCase or PascalCase filename to a display name.
 *  e.g. "BusinessCentral_scalable" → "Business Central"
 *       "AIBuilder_scalable" → "AI Builder"
 */
function toDisplayName(filename) {
  return filename
    .replace(/_scalable$/, '')
    .replace(/_/g, ' ')
    // Insert space before a capital letter that follows a lowercase letter or digit
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    // Insert space between consecutive capitals followed by a lowercase (e.g. AIBuilder → AI Builder)
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim();
}

const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Remove any existing entries for these slugs so we don't duplicate
const slugsToReplace = new Set(newFolders.map(f => f.slug));
const base = existing.filter(i => !slugsToReplace.has(i.slug));

const newEntries = [];

for (const { folder, category, slug } of newFolders) {
  const dir = path.join(publicIconsDir, folder);
  if (!fs.existsSync(dir)) { console.warn(`Skipping missing folder: ${folder}`); continue; }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
  for (const file of files) {
    const id = file.replace(/\.svg$/, '');
    const name = toDisplayName(id);
    newEntries.push({ id, name, category, slug, path: `/icons/${folder}/${file}` });
    console.log(`  + ${name}  [${category}]`);
  }
}

const updated = [...base, ...newEntries];
fs.writeFileSync(manifestPath, JSON.stringify(updated, null, 2));
console.log(`\nAdded ${newEntries.length} new entries. Total: ${updated.length}`);
