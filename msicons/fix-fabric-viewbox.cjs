const fs = require('fs');
const dir = 'public/icons/fabric';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
let fixed = 0, skipped = 0;

for (const f of files) {
  let c = fs.readFileSync(dir + '/' + f, 'utf8');
  const m = c.match(/<svg([^>]*)>/);
  if (!m) { skipped++; continue; }

  const attrs = m[1];
  const wm = attrs.match(/width="(\d+(?:\.\d+)?)"/);
  const hm = attrs.match(/height="(\d+(?:\.\d+)?)"/);
  if (!wm || !hm) { skipped++; continue; }

  const w = wm[1];
  const h = hm[1];

  let newAttrs = attrs
    .replace(/\s*width="[^"]*"/, '')
    .replace(/\s*height="[^"]*"/, '');
  newAttrs += ` viewBox="0 0 ${w} ${h}"`;

  c = c.replace(/<svg([^>]*)>/, `<svg${newAttrs}>`);
  fs.writeFileSync(dir + '/' + f, c);
  fixed++;
}

console.log(`Fixed: ${fixed}  Skipped: ${skipped}`);
