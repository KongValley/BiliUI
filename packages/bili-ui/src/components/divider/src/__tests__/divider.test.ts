import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from '../divider.vue'

describe('BiliDivider', () => {
  it('renders a horizontal separator by default', () => {
    const wrapper = mount(Divider)
    expect(wrapper.classes()).toContain('bili-divider')
    expect(wrapper.classes()).toContain('bili-divider--horizontal')
    expect(wrapper.classes()).toContain('bili-divider--content-center')
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('applies the vertical modifier and hides text', () => {
    const wrapper = mount(Divider, {
      props: { direction: 'vertical' },
      slots: { default: '或' }
    })
    expect(wrapper.classes()).toContain('bili-divider--vertical')
    expect(wrapper.find('.bili-divider__text').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('is-with-text')
  })

  it('renders text with the with-text state', () => {
    const wrapper = mount(Divider, { slots: { default: '分组' } })
    expect(wrapper.classes()).toContain('is-with-text')
    expect(wrapper.find('.bili-divider__text').text()).toBe('分组')
  })

  it('supports dashed borders', () => {
    const wrapper = mount(Divider, { props: { dashed: true } })
    expect(wrapper.classes()).toContain('is-dashed')
  })

  it.each([
    ['left', 'bili-divider--content-left'],
    ['center', 'bili-divider--content-center'],
    ['right', 'bili-divider--content-right']
  ] as const)('applies the %s content position', (contentPosition, className) => {
    const wrapper = mount(Divider, { props: { contentPosition } })
    expect(wrapper.classes()).toContain(className)
  })
})
