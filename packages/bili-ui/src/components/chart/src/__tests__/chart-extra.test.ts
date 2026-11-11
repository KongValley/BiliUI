import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RadarChart from '../radar-chart.vue'
import ScatterChart from '../scatter-chart.vue'
import FunnelChart from '../funnel-chart.vue'

const originalClientWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'clientWidth'
)

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 600
  })
})

afterAll(() => {
  if (originalClientWidth) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
  }
})

afterEach(() => {
  document.body.innerHTML = ''
})

const mountChart = async (component: unknown, props: Record<string, unknown>) => {
  const wrapper = mount(component as Parameters<typeof mount>[0], { props })
  await nextTick()
  return wrapper
}

describe('BiliRadarChart', () => {
  const indicators = [
    { name: 'Speed' },
    { name: 'Power' },
    { name: 'Skill' },
    { name: 'Defense' },
    { name: 'Luck' }
  ]
  const series = [
    { name: 'A', data: [80, 60, 70, 50, 90] },
    { name: 'B', data: [50, 70, 60, 80, 40] }
  ]

  it('renders grid rings, axes, labels and series polygons', async () => {
    const wrapper = await mountChart(RadarChart, { indicators, series, height: 320 })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('.bili-chart__radar-grid')).toHaveLength(4)
    expect(wrapper.findAll('.bili-chart__radar-axis')).toHaveLength(5)
    expect(wrapper.findAll('.bili-chart__radar-point')).toHaveLength(10)
    expect(wrapper.findAll('.bili-chart-legend__item')).toHaveLength(2)
  })

  it('emits point-click with the indicator value', async () => {
    const wrapper = await mountChart(RadarChart, { indicators, series })

    await wrapper.findAll('.bili-chart__radar-point')[0].trigger('click')
    expect(wrapper.emitted('point-click')?.[0]).toEqual([
      { series: 'A', indicator: 'Speed', value: 80, index: 0 }
    ])
  })

  it('shows a tooltip on point hover', async () => {
    const wrapper = await mountChart(RadarChart, { indicators, series })

    await wrapper.findAll('.bili-chart__radar-point')[0].trigger('mouseenter')
    expect(wrapper.find('.bili-chart-tooltip').exists()).toBe(true)
    expect(wrapper.findAll('.bili-chart-tooltip__row')).toHaveLength(2)
  })

  it('renders the empty state for fewer than three indicators', async () => {
    const wrapper = await mountChart(RadarChart, {
      indicators: indicators.slice(0, 2),
      series
    })

    expect(wrapper.find('.bili-chart__empty').exists()).toBe(true)
  })
})

describe('BiliScatterChart', () => {
  const series = [
    {
      name: 'Group A',
      data: [
        { x: 10, y: 20 },
        { x: 30, y: 40 }
      ]
    },
    {
      name: 'Group B',
      data: [{ x: 20, y: 60 }]
    }
  ]

  it('renders points for every series', async () => {
    const wrapper = await mountChart(ScatterChart, { series })

    expect(wrapper.findAll('.bili-chart__scatter-point')).toHaveLength(3)
    expect(wrapper.findAll('.bili-chart-legend__item')).toHaveLength(2)
  })

  it('emits point-click with the raw coordinates', async () => {
    const wrapper = await mountChart(ScatterChart, { series })

    await wrapper.findAll('.bili-chart__scatter-point')[1].trigger('click')
    expect(wrapper.emitted('point-click')?.[0]).toEqual([
      { series: 'Group A', x: 30, y: 40, index: 1 }
    ])
  })

  it('respects explicit domains and point size', async () => {
    const wrapper = await mountChart(ScatterChart, {
      series,
      xMin: 0,
      xMax: 100,
      yMin: 0,
      yMax: 100,
      pointSize: 7
    })

    const circle = wrapper.find('.bili-chart__scatter-point')
    expect(circle.attributes('r')).toBe('7')
  })

  it('renders the empty state', async () => {
    const wrapper = await mountChart(ScatterChart, { series: [] })
    expect(wrapper.find('.bili-chart__empty').exists()).toBe(true)
  })
})

describe('BiliFunnelChart', () => {
  const data = [
    { name: 'Visit', value: 1000 },
    { name: 'Signup', value: 600 },
    { name: 'Order', value: 300 },
    { name: 'Pay', value: 120 }
  ]

  it('renders one stage per datum with labels', async () => {
    const wrapper = await mountChart(FunnelChart, { data, height: 320 })

    expect(wrapper.findAll('.bili-chart__funnel-polygon')).toHaveLength(4)
    expect(wrapper.findAll('.bili-chart__funnel-label').length).toBeGreaterThan(0)
  })

  it('emits slice-click with percent', async () => {
    const wrapper = await mountChart(FunnelChart, { data })

    await wrapper.findAll('.bili-chart__funnel-polygon')[0].trigger('click')
    expect(wrapper.emitted('slice-click')?.[0]).toEqual([
      { name: 'Visit', value: 1000, percent: (1000 / 2020) * 100, index: 0 }
    ])
  })

  it('hides labels when disabled', async () => {
    const wrapper = await mountChart(FunnelChart, { data, showLabels: false })
    expect(wrapper.find('.bili-chart__funnel-label').exists()).toBe(false)
  })

  it('renders the empty state', async () => {
    const wrapper = await mountChart(FunnelChart, { data: [] })
    expect(wrapper.find('.bili-chart__empty').exists()).toBe(true)
  })
})
