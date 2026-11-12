import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Flex from '../flex.vue'

const getStyle = (wrapper: ReturnType<typeof mount>) => wrapper.attributes('style') ?? ''

describe('BiliFlex', () => {
  it('renders a flex container with slots', () => {
    const wrapper = mount(Flex, { slots: { default: '<span class="item">A</span>' } })
    expect(wrapper.classes()).toContain('bili-flex')
    expect(wrapper.find('.item').text()).toBe('A')
  })

  it('switches to a vertical column', () => {
    const wrapper = mount(Flex, { props: { vertical: true } })
    expect(wrapper.classes()).toContain('is-vertical')
    expect(getStyle(wrapper)).toContain('flex-direction: column')
  })

  it('maps semantic gap sizes', () => {
    expect(getStyle(mount(Flex, { props: { gap: 'small' } }))).toContain('gap: 8px')
    expect(getStyle(mount(Flex, { props: { gap: 'middle' } }))).toContain('gap: 16px')
    expect(getStyle(mount(Flex, { props: { gap: 'large' } }))).toContain('gap: 24px')
  })

  it('accepts numeric and raw gap values', () => {
    expect(getStyle(mount(Flex, { props: { gap: 12 } }))).toContain('gap: 12px')
    expect(getStyle(mount(Flex, { props: { gap: '1rem' } }))).toContain('gap: 1rem')
  })

  it('maps start/end alignment to flex values', () => {
    const wrapper = mount(Flex, { props: { justify: 'space-between', align: 'end' } })
    expect(getStyle(wrapper)).toContain('justify-content: space-between')
    expect(getStyle(wrapper)).toContain('align-items: flex-end')
  })

  it('supports boolean and string wrap values', () => {
    const wrapped = mount(Flex, { props: { wrap: true } })
    expect(wrapped.classes()).toContain('is-wrap')
    expect(getStyle(wrapped)).toContain('flex-wrap: wrap')

    const reversed = mount(Flex, { props: { wrap: 'wrap-reverse' } })
    expect(getStyle(reversed)).toContain('flex-wrap: wrap-reverse')
  })

  it('applies its own flex shorthand', () => {
    expect(getStyle(mount(Flex, { props: { flex: 1 } }))).toContain('flex: 1')
    expect(getStyle(mount(Flex, { props: { flex: '0 0 200px' } }))).toContain('flex: 0 0 200px')
  })

  it('renders a custom wrapper element', () => {
    const wrapper = mount(Flex, { props: { component: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
