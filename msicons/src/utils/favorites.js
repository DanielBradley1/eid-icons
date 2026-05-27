const KEY = 'msicons-favorites'

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addFavorite(id) {
  const f = getFavorites()
  if (!f.includes(id)) localStorage.setItem(KEY, JSON.stringify([...f, id]))
}

export function removeFavorite(id) {
  localStorage.setItem(KEY, JSON.stringify(getFavorites().filter(x => x !== id)))
}

export function clearFavorites() {
  localStorage.removeItem(KEY)
}

/**
 * Fetches all favorited SVGs and bundles them into a downloadable ZIP file.
 * Uses JSZip loaded dynamically to keep the initial bundle small.
 */
export async function downloadFavoritesZip(iconsList) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()

  await Promise.allSettled(
    iconsList.map(async (icon) => {
      try {
        const res = await fetch(icon.path)
        if (!res.ok) return
        const blob = await res.blob()
        // Use category slug as sub-folder so the ZIP is organized
        const folder = icon.slug || icon.category.replace(/\s+/g, '-')
        zip.file(`${folder}/${icon.id}.svg`, blob)
      } catch {
        // Skip icons that fail to fetch — don't abort the whole ZIP
      }
    })
  )

  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = 'msicons-favourites.zip'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
