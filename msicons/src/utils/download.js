/**
 * Downloads the SVG file at `svgPath` as `{name}.svg`
 */
export async function downloadSVG(svgPath, name) {
  const response = await fetch(svgPath)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const text = await response.text()
  const blob = new Blob([text], { type: 'image/svg+xml' })
  triggerDownload(URL.createObjectURL(blob), `${sanitizeName(name)}.svg`)
}

/**
 * Converts the SVG at `svgPath` to a PNG Blob of `size × size` pixels.
 */
export async function svgToPngBlob(svgPath, size) {
  const response = await fetch(svgPath)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const svgText = await response.text()

  // Inject explicit width/height so the canvas renders at the right resolution
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgEl = doc.documentElement
  svgEl.setAttribute('width', String(size))
  svgEl.setAttribute('height', String(size))
  const modifiedSVG = new XMLSerializer().serializeToString(svgEl)

  const svgBlob = new Blob([modifiedSVG], { type: 'image/svg+xml' })
  const svgUrl = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(svgUrl)
      canvas.toBlob(pngBlob => {
        if (pngBlob) resolve(pngBlob)
        else reject(new Error('Failed to convert canvas to PNG'))
      }, 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl)
      reject(new Error('Failed to load SVG for PNG conversion'))
    }
    img.src = svgUrl
  })
}

/**
 * Converts the SVG at `svgPath` to a PNG of `size × size` pixels and downloads it.
 */
export async function downloadPNG(svgPath, name, size) {
  const pngBlob = await svgToPngBlob(svgPath, size)
  const pngUrl = URL.createObjectURL(pngBlob)
  triggerDownload(pngUrl, `${sanitizeName(name)}_${size}x${size}.png`)
  URL.revokeObjectURL(pngUrl)
}

function triggerDownload(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9-_ ()]/g, '').trim()
}
