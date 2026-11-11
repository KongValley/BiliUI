import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Space from '../space.vue'

describe('BiliSpace', () => {
  it('renders a horizontal flex container with the medium gap', () => {
    const wrapper = mount(Space)
    expect(wrapper.classes()).toContain('bili-space')
    expect(wrapper.classes()).toContain('bili-space--horizontal')
    expect((wrapper.element as HTMLElement).style.gap).toBe('12px')
  })

  it.each([
    ['sm', '8px'],
    ['md', '12px'],
    ['lg', '16px'],
    [20, '20px']
  ] as const)('maps the %s size to %s', (size, expected) => {
    const wrapper = mount(Space, { props: { size } })
    expect((wrapper.element as HTMLElement).style.gap).toBe(expected)
  })

  it('accepts a raw CSS length', () => {
    const wrapper = mount(Space, { props: { size: '1.5rem' } })
    expect((wrapper.element as HTMLElement).style.gap).toBe('1.5rem')
  })

  it('applies the vertical direction', () => {
    const wrapper = mount(Space, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('bili-space--vertical')
  })

  it('maps alignment to align-items', () => {
    const wrapper = mount(Space, { props: { align: 'center' } })
    expect((wrapper.element as HTMLElement).style.alignItems).toBe('center')
  })

  it('toggles wrap and fill states and renders the slot', () => {
    const wrapper = mount(Space, {
      props: { wrap: true, fill: true },
      slots: { default: '<span class="child">A</span>' }
    })
    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.classes()).toContain('is-fill')
    expect(wrapper.find('.child').exists()).toBe(true)
  })
})
