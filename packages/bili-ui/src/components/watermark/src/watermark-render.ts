import type { WatermarkFont } from './watermark'

export interface WatermarkRenderOptions {
  content: string[]
  image?: HTMLImageElement | null
  imageOpacity?: number
  font: Required<WatermarkFont>
  width: number
  height: number
  rotate: number
  gapX: number
  gapY: number
}

export const defaultWatermarkFont: Required<WatermarkFont> = {
  color: 'rgba(0, 0, 0, 0.15)',
  fontSize: 16,
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
  fontStyle: 'normal'
}

export const normalizePair = (
  value: number | [number, number],
  fallback: [number, number] = [0, 0]
): [number, number] => {
  if (Array.isArray(value)) {
    return [value[0] ?? fallback[0], value[1] ?? fallback[1]]
  }
  return [value, value]
}

/** Render one repeated watermark tile and return a PNG data URL. */
export function renderWatermark(options: WatermarkRenderOptions): string {
  if (typeof document === 'undefined') return ''

  const { content, image, imageOpacity = 0.3, font, width, height, rotate, gapX, gapY } = options
  const tileWidth = Math.max(1, width + gapX)
  const tileHeight = Math.max(1, height + gapY)
  const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(tileWidth * ratio)
  canvas.height = Math.round(tileHeight * ratio)

  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.scale(ratio, ratio)
  ctx.translate(tileWidth / 2, tileHeight / 2)
  ctx.rotate((rotate * Math.PI) / 180)

  if (image) {
    const drawWidth = Math.min(width, tileWidth)
    const drawHeight = Math.min(height, tileHeight)
    ctx.globalAlpha = Math.min(1, Math.max(0, imageOpacity))
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    ctx.globalAlpha = 1
    return canvas.toDataURL('image/png')
  }

  if (content.length === 0) return ''

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = font.color
  ctx.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize}px ${font.fontFamily}`

  const lineHeight = font.fontSize * 1.4
  const totalHeight = content.length * lineHeight
  const startY = -totalHeight / 2 + lineHeight / 2

  content.forEach((line, index) => {
    ctx.fillText(line, 0, startY + index * lineHeight)
  })

  return canvas.toDataURL('image/png')
}

export function loadWatermarkImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}
