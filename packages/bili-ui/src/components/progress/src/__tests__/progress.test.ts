import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Progress from '../progress.vue'

describe('BiliProgress', () => {
  it('renders a line bar with the given width', () => {
    const wrapper = mount(Progress, { props: { percentage: 40 } })

    expect(wrapper.classes()).toContain('bili-progress--line')
    expect(wrapper.find('.bili-progress__inner').attributes('style')).toContain('width: 40%')
    expect(wrapper.find('.bili-progress__text').text()).toBe('40%')
  })

  it('clamps out-of-range percentages', () => {
    expect(
      mount(Progress, { props: { percentage: 140 } }).find('.bili-progress__inner').attributes('style')
    ).toContain('width: 100%')
    expect(
      mount(Progress, { props: { percentage: -20 } }).find('.bili-progress__inner').attributes('style')
    ).toContain('width: 0%')
  })

  it('switches to success at 100%', () => {
    const wrapper = mount(Progress, { props: { percentage: 100 } })
    expect(wrapper.classes()).toContain('bili-progress--success')
  })

  it('honours an explicit status and colour', () => {
    expect(
      mount(Progress, { props: { percentage: 30, status: 'error' } }).classes()
    ).toContain('bili-progress--error')

    const custom = mount(Progress, { props: { percentage: 30, color: '#ff8800' } })
    // jsdom normalises the hex colour to rgb() when reading inline styles.
    const style = custom.find('.bili-progress__inner').attributes('style') ?? ''
    expect(style).toMatch(/#ff8800|rgb\(255,\s*136,\s*0\)/)
  })

  it('formats the label and can hide it', () => {
    const wrapper = mount(Progress, {
      props: { percentage: 33, format: (value: number) => `${value} 分` }
    })
    expect(wrapper.find('.bili-progress__text').text()).toBe('33 分')

    const hidden = mount(Progress, { props: { percentage: 33, showText: false } })
    expect(hidden.find('.bili-progress__text').exists()).toBe(false)
  })

  it('renders a second progress segment', () => {
    const wrapper = mount(Progress, { props: { percentage: 80, successPercentage: 50 } })
    expect(wrapper.find('.bili-progress__second').attributes('style')).toContain('width: 50%')
  })

  it('renders circle geometry with dash arrays', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, type: 'circle' } })

    const circles = wrapper.findAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.find('.bili-progress__circle-text').text()).toBe('50%')

    const inner = wrapper.find('.bili-progress__circle-inner')
    expect(inner.attributes('stroke-dasharray')).toBeTruthy()
  })

  it('renders a dashboard arc with a rotation gap', () => {
    const wrapper = mount(Progress, { props: { percentage: 70, type: 'dashboard' } })
    expect(wrapper.classes()).toContain('bili-progress--dashboard')
    expect(wrapper.find('g').attributes('transform')).toContain('rotate(135')
  })

  it('applies striped animations', () => {
    const animated = mount(Progress, { props: { percentage: 40, stripedAnimated: true } })
    expect(animated.find('.bili-progress__inner').classes()).toContain('is-striped')

    const staticStripes = mount(Progress, { props: { percentage: 40, striped: true } })
    expect(staticStripes.find('.bili-progress__bar').classes()).toContain('is-striped')
  })
})
