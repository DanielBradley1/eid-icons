const specials = { ai: 'AI', iot: 'IoT', devops: 'DevOps' }

export function formatCategory(cat) {
  return cat
    .split(' ')
    .map(w => specials[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
