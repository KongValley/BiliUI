import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../badge.vue'

describe('BiliBadge', () => {
  it('renders a numeric value', () => {
    const wrapper = mount(Badge, { props: { value: 12 } })
    expect(wrapper.find('.bili-badge__content').text()).toBe('12')
  })

  it('caps values above max', () => {
    expect(mount(Badge, { props: { value: 120, max: 99 } }).text()).toBe('99+')
    expect(mount(Badge, { props: { value: 5, max: 99 } }).text()).toBe('5')
  })

  it('renders text values as-is', () => {
    expect(mount(Badge, { props: { value: 'NEW' } }).text()).toBe('NEW')
  })

  it('hides zero unless showZero is set', () => {
    const hidden = mount(Badge, { props: { value: 0 } })
    expect(hidden.find('.bili-badge__content').exists()).toBe(false)

    const shown = mount(Badge, { props: { value: 0, showZero: true } })
    expect(shown.find('.bili-badge__content').text()).toBe('0')
  })

  it('renders a dot without content', () => {
    const wrapper = mount(Badge, { props: { dot: true } })
    expect(wrapper.classes()).toContain('is-dot')
    expect(wrapper.find('.bili-badge__content').text()).toBe('')
  })

  it('wraps slot content and positions the badge over it', () => {
    const wrapper = mount(Badge, {
      props: { value: 3 },
      slots: { default: '<span class="child">头像</span>' }
    })

    expect(wrapper.find('.child').exists()).toBe(true)
    expect(wrapper.classes()).not.toContain('is-fixed')
  })

  it('marks standalone badges as fixed', () => {
    const wrapper = mount(Badge, { props: { value: 3 } })
    expect(wrapper.classes()).toContain('is-fixed')
  })

  it('hides the badge when hidden', () => {
    const wrapper = mount(Badge, { props: { value: 9, hidden: true } })
    expect(wrapper.classes()).toContain('is-hidden')
  })

  it('applies type colours', () => {
    expect(mount(Badge, { props: { value: 1, type: 'success' } }).classes()).toContain(
      'bili-badge--success'
    )
    const custom = mount(Badge, { props: { value: 1, color: '#123456' } })
    expect(custom.attributes('style')).toContain('--bili-badge-color: #123456')
  })

  it('renders a status dot with a label', () => {
    const wrapper = mount(Badge, { props: { status: 'processing' }, slots: { default: '进行中' } })

    expect(wrapper.classes()).toContain('bili-badge--status')
    expect(wrapper.classes()).toContain('bili-badge--processing')
    expect(wrapper.find('.bili-badge__status-dot').exists()).toBe(true)
    expect(wrapper.find('.bili-badge__status-text').text()).toBe('进行中')
  })
})
