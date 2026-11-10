export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSV {
  h: number
  s: number
  v: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/** Accepts `#rgb` or `#rrggbb` and returns a lowercase `#rrggbb`, or null. */
export function normalizeHex(input: string): string | null {
  const value = input.trim().toLowerCase()
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(value)
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
  if (/^#[0-9a-f]{6}$/.test(value)) return value
  return null
}

export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex) ?? '#000000'
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16)
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) =>
    Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360

  return {
    h,
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100)
  }
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const saturation = clamp(s, 0, 100) / 100
  const value = clamp(v, 0, 100) / 100
  const hue = ((h % 360) + 360) % 360
  const c = value * saturation
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = value - c

  let r: number
  let g: number
  let b: number
  if (hue < 60) [r, g, b] = [c, x, 0]
  else if (hue < 120) [r, g, b] = [x, c, 0]
  else if (hue < 180) [r, g, b] = [0, c, x]
  else if (hue < 240) [r, g, b] = [0, x, c]
  else if (hue < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

export const hsvToHex = (hsv: HSV): string => {
  const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v)
  return rgbToHex(r, g, b)
}
