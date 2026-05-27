const specials = { ai: 'AI', iot: 'IoT', devops: 'DevOps' }

export function formatCategory(cat) {
  return cat
    .split(' ')
    .map(w => specials[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Convert an icon name to a URL slug, e.g. "Batch AI" → "batch-ai" */
export function iconSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
