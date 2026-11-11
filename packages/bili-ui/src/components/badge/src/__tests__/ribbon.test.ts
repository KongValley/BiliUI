import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BadgeRibbon from '../ribbon.vue'

describe('BiliBadgeRibbon', () => {
  it('renders the ribbon text and wrapped content', () => {
    const wrapper = mount(BadgeRibbon, {
      props: { text: 'NEW' },
      slots: { default: '<div class="cover">cover</div>' }
    })

    expect(wrapper.find('.cover').text()).toBe('cover')
    expect(wrapper.find('.bili-badge-ribbon__text').text()).toBe('NEW')
    expect(wrapper.find('.bili-badge-ribbon__ribbon').classes()).toContain(
      'bili-badge-ribbon--end'
    )
  })

  it('supports placement and a custom colour', () => {
    const wrapper = mount(BadgeRibbon, {
      props: { text: 'HOT', placement: 'start', color: '#e0356b' }
    })

    const ribbon = wrapper.find('.bili-badge-ribbon__ribbon')
    expect(ribbon.classes()).toContain('bili-badge-ribbon--start')
    expect(ribbon.attributes('style')).toContain('--bili-badge-ribbon-bg: #e0356b')
  })

  it('renders the text slot', () => {
    const wrapper = mount(BadgeRibbon, {
      slots: { text: '<strong class="custom">VIP</strong>' }
    })

    expect(wrapper.find('.custom').text()).toBe('VIP')
  })
})
