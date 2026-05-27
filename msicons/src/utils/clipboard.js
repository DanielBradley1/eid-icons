/**
 * Fetches an SVG file and copies its text content to the clipboard.
 * Falls back to execCommand('copy') for insecure contexts / older browsers.
 */
export async function copySVGText(svgPath) {
  const res = await fetch(svgPath)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
  } else {
    // Fallback for non-secure contexts or older browsers
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

/**
 * Copies arbitrary text to the clipboard with the same fallback.
 */
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
  } else {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}
