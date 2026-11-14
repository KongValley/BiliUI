const THEME_STYLE_ID = 'bili-theme-color'
const DARK_SURFACE = '#171a1f'
const DARK_TEXT = '#1f2329'
const WHITE = '#ffffff'

export interface ThemeColorPreset {
  name: string
  color: string
}

/** Brand-adjacent presets used by the docs site and available to consumers. */
export const themeColorPresets: ThemeColorPreset[] = [
  { name: '招牌粉', color: '#e0356b' },
  { name: '星云蓝', color: '#4f7cff' },
  { name: '薄荷绿', color: '#22a06b' },
  { name: '琥珀橙', color: '#e6a23c' },
  { name: '暮光紫', color: '#8b5cf6' },
  { name: '湖水青', color: '#06b6d4' },
  { name: '珊瑚橙', color: '#f97316' },
  { name: '岩石灰', color: '#64748b' }
]

export const defaultThemeColor = themeColorPresets[0].color

interface Rgb {
  r: number
  g: number
  b: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/** Accepts `#rgb` or `#rrggbb`; returns lowercase `#rrggbb` or null. */
const normalizeHex = (input: string): string | null => {
  const value = input.trim().toLowerCase()
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(value)
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
  return /^#[0-9a-f]{6}$/.test(value) ? value : null
}

const toRgb = (hex: string): Rgb => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16)
})

const toHex = ({ r, g, b }: Rgb): string =>
  `#${[r, g, b]
    .map(value =>
      Math.round(clamp(value, 0, 255))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`

/** Mix `weight` of `target` into `base`, matching Sass `color.mix`. */
const mix = (base: Rgb, target: Rgb, weight: number): Rgb => ({
  r: base.r + (target.r - base.r) * weight,
  g: base.g + (target.g - base.g) * weight,
  b: base.b + (target.b - base.b) * weight
})

const luminance = ({ r, g, b }: Rgb): number => {
  const channel = (value: number) => {
    const normalized = value / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const contrast = (a: Rgb, b: Rgb): number => {
  const first = luminance(a)
  const second = luminance(b)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

/** Prefer white text on saturated brand colours; fall back to dark for light fills. */
const readableOn = (color: Rgb): string =>
  contrast(color, toRgb(WHITE)) >= 3 ? WHITE : DARK_TEXT

const buildVariables = (base: Rgb, dark: boolean): string => {
  const hover = mix(base, toRgb(WHITE), 0.12)
  const active = mix(base, toRgb('#000000'), 0.12)
  const light = dark
    ? mix(base, toRgb(DARK_SURFACE), 0.82)
    : mix(base, toRgb(WHITE), 0.92)
  const ring = `rgba(${Math.round(base.r)}, ${Math.round(base.g)}, ${Math.round(base.b)}, ${
    dark ? 0.22 : 0.16
  })`

  return [
    `--bili-color-primary:${toHex(base)};`,
    `--bili-color-primary-hover:${toHex(hover)};`,
    `--bili-color-primary-active:${toHex(active)};`,
    `--bili-color-primary-light:${toHex(light)};`,
    `--bili-color-primary-ring:${ring};`,
    `--bili-color-on-primary:${readableOn(base)};`,
    `--bili-chart-color-1:${toHex(base)};`
  ].join('')
}

let currentThemeColor = defaultThemeColor

/**
 * Apply a primary colour at runtime. The generated stylesheet contains both
 * light and dark derivations, so toggling `html.dark` needs no extra call.
 */
export function setThemeColor(color: string): boolean {
  if (typeof document === 'undefined') return false

  const normalized = normalizeHex(color)
  if (!normalized) return false

  const base = toRgb(normalized)
  // Dark mode needs a slightly lighter surface colour to stay legible.
  const darkBase = mix(base, toRgb(WHITE), 0.18)

  let style = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = THEME_STYLE_ID
    document.head.appendChild(style)
  }

  style.textContent = [
    `:root{${buildVariables(base, false)}}`,
    `html.dark{${buildVariables(darkBase, true)}}`
  ].join('\n')

  currentThemeColor = normalized
  return true
}

/** Remove runtime overrides and fall back to the built-in brand palette. */
export function resetThemeColor(): void {
  if (typeof document !== 'undefined') {
    document.getElementById(THEME_STYLE_ID)?.remove()
  }
  currentThemeColor = defaultThemeColor
}

/** Last colour applied through `setThemeColor` (defaults to the brand pink). */
export function getThemeColor(): string {
  return currentThemeColor
}
