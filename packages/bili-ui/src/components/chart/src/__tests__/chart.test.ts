import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LineChart from '../line-chart.vue'
import BarChart from '../bar-chart.vue'
import PieChart from '../pie-chart.vue'
import GaugeChart from '../gauge-chart.vue'
import {
  arcPath,
  buildTicks,
  niceDomain,
  niceStep,
  polarPoint
} from '../use-chart'

/**
 * jsdom reports zero-width containers, so charts would render their empty
 * state. Define layout getters before mounting so the SVG branches run.
 */
const originalClientWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'clientWidth'
)
const originalRect = HTMLElement.prototype.getBoundingClientRect

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 600
  })
  HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return {
      width: 600,
      height: 280,
      top: 0,
      left: 0,
      right: 600,
      bottom: 280,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect
  }
})

afterAll(() => {
  if (originalClientWidth) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
  }
  HTMLElement.prototype.getBoundingClientRect = originalRect
})

const mountChart = (component: any, options: Record<string, any> = {}) =>
  mount(component, options)

describe('chart helpers', () => {
  it('computes nice steps', () => {
    expect(niceStep(1)).toBe(1)
    expect(niceStep(3)).toBe(5)
    expect(niceStep(7)).toBe(10)
    expect(niceStep(0.03)).toBeCloseTo(0.05)
  })

  it('expands the domain to round bounds', () => {
    expect(niceDomain([0, 97])).toEqual([0, 100])
    expect(niceDomain([13, 47])).toEqual([10, 50])
    expect(niceDomain([5, 5])[0]).toBeLessThan(5)
    expect(niceDomain([5, 5])[1]).toBeGreaterThan(5)
  })

  it('includes zero when requested', () => {
    const [low] = niceDomain([20, 80], { beginAtZero: true })
    expect(low).toBe(0)
  })

  it('builds ticks that stay within the domain', () => {
    const ticks = buildTicks(0, 100, 4)
    expect(ticks[0]).toBe(0)
    expect(ticks[ticks.length - 1]).toBeLessThanOrEqual(100)
    expect(ticks.length).toBeGreaterThan(1)
  })

  it('places polar points clockwise from 12 o’clock', () => {
    const top = polarPoint(0, 0, 10, 0)
    expect(top.x).toBeCloseTo(0)
    expect(top.y).toBeCloseTo(-10)

    const right = polarPoint(0, 0, 10, 90)
    expect(right.x).toBeCloseTo(10)
    expect(right.y).toBeCloseTo(0, 5)
  })

  it('renders a full ring for a 360° arc', () => {
    const path = arcPath(50, 50, 40, 20, 0, 360)
    expect(path.split('A').length - 1).toBe(4)
  })

  it('renders a plain wedge when inner radius is zero', () => {
    const path = arcPath(50, 50, 40, 0, 0, 90)
    expect(path.startsWith('M50 50')).toBe(true)
    expect(path.endsWith('Z')).toBe(true)
  })
})

const categories = ['一月', '二月', '三月', '四月']

const lineSeries = [
  { name: '访问量', data: [120, 200, 150, 280] },
  { name: '下单量', data: [60, 90, 70, 140], area: true, smooth: true }
]

const barSeries = [
  { name: '线上', data: [30, 50, 40, 60] },
  { name: '线下', data: [20, 30, 25, 35] }
]

const pieData = [
  { name: '直接访问', value: 40 },
  { name: '搜索引擎', value: 35 },
  { name: '邮件营销', value: 25 }
]

describe('BiliLineChart', () => {
  it('renders one path per series and the legend', async () => {
    const wrapper = mountChart(LineChart, {
      props: { categories, series: lineSeries }
    })
    await nextTick()

    expect(wrapper.findAll('.bili-chart__line')).toHaveLength(2)
    expect(wrapper.findAll('.bili-chart__area')).toHaveLength(1)
    expect(wrapper.find('.bili-chart-legend').text()).toContain('访问量')
    expect(wrapper.find('.bili-chart-legend').text()).toContain('下单量')
  })

  it('dims other series while a legend entry is hovered', async () => {
    const wrapper = mountChart(LineChart, {
      props: { categories, series: lineSeries }
    })
    await nextTick()

    const legendItems = wrapper.findAll('.bili-chart-legend__item')
    await legendItems[0].trigger('mouseenter')
    expect(wrapper.findAll('.bili-chart__series.is-muted')).toHaveLength(1)

    await legendItems[0].trigger('mouseleave')
    expect(wrapper.findAll('.bili-chart__series.is-muted')).toHaveLength(0)
  })

  it('breaks the line around null values', async () => {
    const wrapper = mountChart(LineChart, {
      props: {
        categories,
        series: [{ name: '有缺口', data: [10, null, 30, 40] }]
      }
    })
    await nextTick()

    const d = wrapper.find('.bili-chart__line').attributes('d') ?? ''
    // Two separate "M" commands mean two segments.
    expect(d.split('M').length - 1).toBe(2)
  })

  it('renders axis ticks and labels', async () => {
    const wrapper = mountChart(LineChart, {
      props: { categories, series: lineSeries }
    })
    await nextTick()

    const labels = wrapper.findAll('.bili-chart__axis-label').map(node => node.text())
    expect(labels).toContain('一月')
    expect(labels).toContain('四月')
  })

  it('shows the empty text when there is no data', async () => {
    const wrapper = mountChart(LineChart, {
      props: { categories: [], series: [] }
    })
    await nextTick()
    expect(wrapper.find('.bili-chart__empty').text()).toBe('暂无数据')
  })

  it('honours a custom value formatter', async () => {
    const wrapper = mountChart(LineChart, {
      props: {
        categories,
        series: lineSeries,
        valueFormatter: (value: number) => `${value}件`
      }
    })
    await nextTick()
    const labels = wrapper.findAll('.bili-chart__axis-label').map(node => node.text())
    expect(labels.some(text => text.endsWith('件'))).toBe(true)
  })
})

describe('BiliBarChart', () => {
  it('renders one bar path per data point when grouped', async () => {
    const wrapper = mountChart(BarChart, {
      props: { categories, series: barSeries }
    })
    await nextTick()
    expect(wrapper.findAll('.bili-chart__bar')).toHaveLength(8)
  })

  it('stacks series on top of each other', async () => {
    const wrapper = mountChart(BarChart, {
      props: { categories, series: [{ name: 'A', data: [10, 20] }, { name: 'B', data: [5, 5] }], stacked: true }
    })
    await nextTick()

    const bars = wrapper.findAll('.bili-chart__bar')
    expect(bars).toHaveLength(4)
    // Stacked bars share an x position within each category.
    const xs = bars.map(bar => bar.attributes('data-x'))
    expect(xs[0]).toBe(xs[1])
  })

  it('supports horizontal bars', async () => {
    const wrapper = mountChart(BarChart, {
      props: { categories, series: barSeries, horizontal: true }
    })
    await nextTick()

    const bar = wrapper.find('.bili-chart__bar')
    // Horizontal bars are wider than they are tall.
    expect(Number(bar.attributes('data-width'))).toBeGreaterThan(
      Number(bar.attributes('data-height'))
    )
  })

  it('highlights the hovered category with a band', async () => {
    const wrapper = mountChart(BarChart, {
      props: { categories, series: barSeries }
    })
    await nextTick()

    await wrapper.find('.bili-chart__canvas').trigger('mousemove', {
      clientX: 120,
      clientY: 80
    })
    expect(wrapper.find('.bili-chart__band').exists()).toBe(true)
  })

  it('emits bar-click with the category', async () => {
    const wrapper = mountChart(BarChart, {
      props: { categories, series: barSeries }
    })
    await nextTick()

    await wrapper.find('.bili-chart__bar').trigger('click')
    const payload = wrapper.emitted('bar-click')?.[0]?.[0] as any
    expect(payload.category).toBe('一月')
    expect(payload.value).toBe(30)
  })
})

describe('BiliPieChart', () => {
  it('renders a slice per datum', async () => {
    const wrapper = mountChart(PieChart, { props: { data: pieData } })
    await nextTick()

    expect(wrapper.findAll('.bili-chart__slice')).toHaveLength(3)
    expect(wrapper.find('.bili-chart-legend').text()).toContain('直接访问')
  })

  it('previews a slice when its legend entry is hovered', async () => {
    const wrapper = mountChart(PieChart, { props: { data: pieData } })
    await nextTick()

    const legendItems = wrapper.findAll('.bili-chart-legend__item')
    await legendItems[1].trigger('mouseenter')
    const active = wrapper.findAll('.bili-chart__slice.is-active')
    expect(active).toHaveLength(1)
    expect(active[0].attributes('style')).toContain('translate')

    await legendItems[1].trigger('mouseleave')
    expect(wrapper.findAll('.bili-chart__slice.is-active')).toHaveLength(0)
  })

  it('renders percentage labels for large slices', async () => {
    const wrapper = mountChart(PieChart, { props: { data: pieData } })
    await nextTick()

    const labels = wrapper.findAll('.bili-chart__slice-label').map(node => node.text())
    expect(labels).toContain('40%')
    expect(labels).toContain('25%')
  })

  it('renders a donut when innerRadius is set', async () => {
    const wrapper = mountChart(PieChart, {
      props: { data: pieData, innerRadius: 0.6 }
    })
    await nextTick()

    const d = wrapper.find('.bili-chart__slice').attributes('d') ?? ''
    // A donut slice has an inner arc command after the outer one.
    expect((d.match(/A/g) ?? []).length).toBe(2)
  })

  it('emits slice-click with the percentage', async () => {
    const wrapper = mountChart(PieChart, { props: { data: pieData } })
    await nextTick()

    await wrapper.find('.bili-chart__slice').trigger('click')
    const payload = wrapper.emitted('slice-click')?.[0]?.[0] as any
    expect(payload.name).toBe('直接访问')
    expect(payload.percent).toBeCloseTo(40)
  })

  it('shows empty state for an all-zero dataset', async () => {
    const wrapper = mountChart(PieChart, {
      props: { data: [{ name: '空', value: 0 }] }
    })
    await nextTick()
    expect(wrapper.find('.bili-chart__empty').exists()).toBe(true)
  })
})

describe('BiliGaugeChart', () => {
  it('renders the track and the value arc', async () => {
    const wrapper = mountChart(GaugeChart, {
      props: { value: 72, label: '完成率' }
    })
    await nextTick()

    expect(wrapper.find('.bili-chart__gauge-track').exists()).toBe(true)
    expect(wrapper.find('.bili-chart__gauge-value').exists()).toBe(true)
    expect(wrapper.find('.bili-chart__gauge-number').text()).toContain('72')
    expect(wrapper.find('.bili-chart__gauge-label').text()).toBe('完成率')
  })

  it('clamps values outside the range', async () => {
    const wrapper = mountChart(GaugeChart, { props: { value: 150, max: 100 } })
    await nextTick()
    expect(wrapper.find('.bili-chart__gauge-number').text()).toContain('150')
    expect(wrapper.find('.bili-chart__gauge-value').exists()).toBe(true)
  })

  it('renders no value arc at zero', async () => {
    const wrapper = mountChart(GaugeChart, { props: { value: 0 } })
    await nextTick()
    expect(wrapper.find('.bili-chart__gauge-track').exists()).toBe(true)
    expect(wrapper.find('.bili-chart__gauge-value').exists()).toBe(false)
  })
})
