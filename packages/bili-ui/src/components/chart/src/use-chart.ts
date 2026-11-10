import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { addUnit } from '../../../utils/dom'

/** Tracks the container width so SVG coordinates stay pixel-accurate. */
export function useChartSize(root: Ref<HTMLElement | null>) {
  const width = ref(0)
  let observer: ResizeObserver | null = null

  onMounted(() => {
    const el = root.value
    if (!el) return
    width.value = Math.max(0, el.clientWidth)
    if (typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver(entries => {
      const next = entries[0]?.contentRect.width ?? 0
      width.value = Math.max(0, Math.round(next))
    })
    observer.observe(el)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return { width }
}

export const toPxNumber = (value: string | number, fallback = 0): number => {
  if (typeof value === 'number') return value
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const toCssSize = (value: string | number): string =>
  typeof value === 'number' ? addUnit(value) : value

export const paletteColor = (index: number, namespace = 'bili'): string =>
  `var(--${namespace}-chart-color-${(index % 8) + 1})`

/**
 * Expands [min, max] to "nice" round bounds so axis ticks read naturally.
 * Returns [low, high] with a non-zero span.
 */
export function niceDomain(
  values: number[],
  options: { min?: number; max?: number; beginAtZero?: boolean } = {}
): [number, number] {
  const finite = values.filter(value => Number.isFinite(value))
  if (!finite.length) return [0, 1]

  let low = options.min ?? Math.min(...finite)
  let high = options.max ?? Math.max(...finite)

  if (options.beginAtZero && options.min === undefined) low = Math.min(0, low)
  if (low === high) {
    const offset = Math.abs(low) > 0 ? Math.abs(low) * 0.1 : 1
    low -= offset
    high += offset
  }

  const span = high - low
  const step = niceStep(span / 4)
  if (options.min === undefined) low = Math.floor(low / step) * step
  if (options.max === undefined) high = Math.ceil(high / step) * step
  if (low === high) high = low + step

  return [low, high]
}

/** A 1/2/5 × 10^n step, the classic axis interval. */
export function niceStep(rawStep: number): number {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1
  const exponent = Math.floor(Math.log10(rawStep))
  const magnitude = Math.pow(10, exponent)
  const normalized = rawStep / magnitude

  if (normalized <= 1) return magnitude
  if (normalized <= 2) return 2 * magnitude
  if (normalized <= 5) return 5 * magnitude
  return 10 * magnitude
}

export function buildTicks(low: number, high: number, count = 4): number[] {
  const step = niceStep((high - low) / Math.max(1, count))
  const start = Math.ceil(low / step) * step
  const ticks: number[] = []
  for (let value = start; value <= high + step * 0.001; value += step) {
    // Trim floating point noise such as 0.30000000000000004.
    ticks.push(Number(value.toFixed(10)))
  }
  return ticks
}

export const defaultNumberFormat = (value: number): string => {
  if (!Number.isFinite(value)) return '-'
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`
  if (abs >= 10_000) return `${Number((value / 1000).toFixed(1))}k`
  return Number(value.toFixed(2)).toLocaleString('zh-CN')
}

export interface Point {
  x: number
  y: number
}

const straightPath = (points: Point[]): string =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')

/**
 * Catmull-Rom → cubic Bézier conversion: smooth without overshooting much,
 * and it stays a plain path string so it works with CSS transitions.
 */
const smoothPath = (points: Point[]): string => {
  if (points.length < 3) return straightPath(points)

  let d = `M${points[0].x} ${points[0].y}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[index + 2] ?? p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`
  }
  return d
}

/**
 * Builds a path for one series. `null` values break the line into segments so a
 * gap in the data reads as a gap instead of a straight jump.
 */
export function buildLinePath(segments: Point[][], smooth = false): string {
  return segments
    .filter(segment => segment.length > 0)
    .map(segment => (smooth ? smoothPath(segment) : straightPath(segment)))
    .join(' ')
}

export function buildAreaPath(segment: Point[], baselineY: number, smooth = false): string {
  if (!segment.length) return ''
  const line = smooth ? smoothPath(segment) : straightPath(segment)
  const first = segment[0]
  const last = segment[segment.length - 1]
  return `${line} L${last.x} ${baselineY} L${first.x} ${baselineY} Z`
}

export const polarPoint = (cx: number, cy: number, radius: number, angle: number): Point => {
  // 0° points up, angles grow clockwise.
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  }
}

/** Ring segment between two radii; used by pie, donut and gauge. */
export function arcPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  startAngle: number,
  endAngle: number
): string {
  const sweep = endAngle - startAngle
  if (sweep <= 0) return ''

  // A full circle cannot be expressed by a single arc command.
  if (sweep >= 359.999) {
    const top = polarPoint(cx, cy, outer, 0)
    const bottom = polarPoint(cx, cy, outer, 180)
    const innerTop = polarPoint(cx, cy, inner, 0)
    const innerBottom = polarPoint(cx, cy, inner, 180)
    return [
      `M${top.x} ${top.y}`,
      `A${outer} ${outer} 0 1 1 ${bottom.x} ${bottom.y}`,
      `A${outer} ${outer} 0 1 1 ${top.x} ${top.y}`,
      `M${innerTop.x} ${innerTop.y}`,
      `A${inner} ${inner} 0 1 0 ${innerBottom.x} ${innerBottom.y}`,
      `A${inner} ${inner} 0 1 0 ${innerTop.x} ${innerTop.y}`,
      'Z'
    ].join(' ')
  }

  const largeArc = sweep > 180 ? 1 : 0
  const outerStart = polarPoint(cx, cy, outer, startAngle)
  const outerEnd = polarPoint(cx, cy, outer, endAngle)
  const innerEnd = polarPoint(cx, cy, inner, endAngle)
  const innerStart = polarPoint(cx, cy, inner, startAngle)

  if (inner <= 0) {
    return [
      `M${cx} ${cy}`,
      `L${outerStart.x} ${outerStart.y}`,
      `A${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      'Z'
    ].join(' ')
  }

  return [
    `M${outerStart.x} ${outerStart.y}`,
    `A${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L${innerEnd.x} ${innerEnd.y}`,
    `A${inner} ${inner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z'
  ].join(' ')
}

/**
 * Open arc along the centreline, meant to be stroked with a thick
 * `stroke-linecap: round`. Unlike `arcPath` (a closed ring segment) it has
 * real endpoints, so the stroke ends get round caps instead of radial cuts.
 */
export function arcStrokePath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const sweep = endAngle - startAngle
  if (sweep <= 0) return ''

  // A full circle cannot be expressed by a single arc command.
  if (sweep >= 359.999) {
    const top = polarPoint(cx, cy, radius, 0)
    const bottom = polarPoint(cx, cy, radius, 180)
    return [
      `M${top.x} ${top.y}`,
      `A${radius} ${radius} 0 1 1 ${bottom.x} ${bottom.y}`,
      `A${radius} ${radius} 0 1 1 ${top.x} ${top.y}`
    ].join(' ')
  }

  const start = polarPoint(cx, cy, radius, startAngle)
  const end = polarPoint(cx, cy, radius, endAngle)
  const largeArc = sweep > 180 ? 1 : 0
  return `M${start.x} ${start.y} A${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/**
 * Rounded bar with only the growing end rounded — a full-radius rect looks
 * wrong where the bar meets the baseline.
 */
export function barPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 0,
  horizontal = false
): string {
  if (width <= 0 || height <= 0) return ''
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))

  if (horizontal) {
    return [
      `M${x} ${y}`,
      `H${x + width - r}`,
      `Q${x + width} ${y} ${x + width} ${y + r}`,
      `V${y + height - r}`,
      `Q${x + width} ${y + height} ${x + width - r} ${y + height}`,
      `H${x}`,
      'Z'
    ].join(' ')
  }

  return [
    `M${x} ${y + height}`,
    `V${y + r}`,
    `Q${x} ${y} ${x + r} ${y}`,
    `H${x + width - r}`,
    `Q${x + width} ${y} ${x + width} ${y + r}`,
    `V${y + height}`,
    'Z'
  ].join(' ')
}
