import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FloatButton from '../float-button.vue'
import FloatButtonGroup from '../float-button-group.vue'
import { h } from 'vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliFloatButton', () => {
  it('renders a button with the default icon and emits click', async () => {
    const wrapper = mount(FloatButton)

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.find('.bili-icon').exists()).toBe(true)

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies type, shape, size and position', () => {
    const wrapper = mount(FloatButton, {
      props: { type: 'primary', shape: 'square', size: 'lg', right: 40, bottom: 56, zIndex: 20 }
    })

    expect(wrapper.classes()).toContain('bili-float-button--primary')
    expect(wrapper.classes()).toContain('bili-float-button--square')
    expect(wrapper.attributes('style')).toContain('--bili-float-button-size: 48px')
    expect(wrapper.attributes('style')).toContain('--bili-float-button-right: 40px')
    expect(wrapper.attributes('style')).toContain('--bili-float-button-bottom: 56px')
    expect(wrapper.attributes('style')).toContain('--bili-float-button-z-index: 20')
  })

  it('renders an anchor when href is provided', () => {
    const wrapper = mount(FloatButton, {
      props: { href: 'https://example.com', target: '_blank', description: 'Docs' }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
    expect(wrapper.find('.bili-float-button__description').text()).toBe('Docs')
  })

  it('scrolls to the top when backTop is enabled', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const wrapper = mount(FloatButton, { props: { backTop: true } })

    await wrapper.trigger('click')
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('stays enabled in a group and inherits group positioning', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { gap: 8, right: 32, bottom: 48 },
      slots: {
        default: () => [
          h(FloatButton, { icon: 'message-circle' }),
          h(FloatButton, { icon: 'phone' })
        ]
      }
    })

    const group = wrapper.find('.bili-float-button-group')
    expect(group.attributes('style')).toContain('gap: 8px')
    expect(group.attributes('style')).toContain('right: 32px')
    expect(group.classes()).toContain('bili-float-button-group--vertical')

    const buttons = wrapper.findAll('.bili-float-button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].classes()).toContain('is-in-group')
    expect(buttons[0].attributes('style')).toBeUndefined()
  })
})
