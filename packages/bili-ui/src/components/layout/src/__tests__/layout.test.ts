import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Layout from '../layout.vue'
import LayoutHeader from '../layout-header.vue'
import LayoutAside from '../layout-aside.vue'
import LayoutContent from '../layout-content.vue'
import LayoutFooter from '../layout-footer.vue'

describe('BiliLayout', () => {
  it('renders a vertical layout by default', () => {
    const wrapper = mount(Layout, { slots: { default: 'content' } })
    const section = wrapper.find('section')
    expect(section.classes()).toContain('bili-layout')
    expect(section.classes()).toContain('bili-layout--vertical')
    expect(wrapper.text()).toBe('content')
  })

  it('switches to horizontal direction', () => {
    const wrapper = mount(Layout, { props: { direction: 'horizontal' } })
    expect(wrapper.find('section').classes()).toContain('bili-layout--horizontal')
  })

  it('applies full height', () => {
    const wrapper = mount(Layout, { props: { fullHeight: true } })
    expect(wrapper.find('section').classes()).toContain('is-full-height')
    expect(wrapper.find('section').attributes('style')).toContain('min-height: 100vh')
  })

  it('marks the layout as having an aside once an aside mounts', async () => {
    const wrapper = mount(Layout, {
      props: { direction: 'horizontal' },
      slots: {
        default: () => [
          h(LayoutAside, { width: 200 }, () => 'aside'),
          h(LayoutContent, {}, () => 'main')
        ]
      }
    })
    await nextTick()
    expect(wrapper.find('section').classes()).toContain('is-has-aside')
  })
})

describe('BiliLayoutHeader', () => {
  it('renders a header with the given height', () => {
    const wrapper = mount(LayoutHeader, { props: { height: 64 }, slots: { default: 'top' } })
    const header = wrapper.find('header')
    expect(header.classes()).toContain('bili-layout-header')
    expect(header.attributes('style')).toContain('height: 64px')
    expect(header.text()).toBe('top')
  })

  it('accepts a string height and the sticky class', () => {
    const wrapper = mount(LayoutHeader, { props: { height: '4rem', sticky: true } })
    expect(wrapper.find('header').attributes('style')).toContain('height: 4rem')
    expect(wrapper.find('header').classes()).toContain('is-sticky')
  })
})

describe('BiliLayoutAside', () => {
  it('uses width, and collapsedWidth when collapsed', async () => {
    const wrapper = mount(LayoutAside, { props: { width: 240 } })
    expect(wrapper.find('aside').attributes('style')).toContain('width: 240px')

    await wrapper.setProps({ collapsed: true, collapsedWidth: 60 })
    const style = wrapper.find('aside').attributes('style') ?? ''
    expect(style).toContain('width: 60px')
    expect(style).toContain('flex-basis: 60px')
    expect(wrapper.find('aside').classes()).toContain('is-collapsed')
  })
})

describe('BiliLayoutContent', () => {
  it('applies padding by default', () => {
    const wrapper = mount(LayoutContent, { slots: { default: 'body' } })
    expect(wrapper.find('main').attributes('style')).toContain('padding: 16px')
  })

  it('accepts custom padding and zero padding', () => {
    const padded = mount(LayoutContent, { props: { padding: 24 } })
    expect(padded.find('main').attributes('style')).toContain('padding: 24px')

    const flush = mount(LayoutContent, { props: { padding: 0 } })
    expect(flush.find('main').attributes('style')).toContain('padding: 0px')
  })
})

describe('BiliLayoutFooter', () => {
  it('renders a footer without a height by default', () => {
    const wrapper = mount(LayoutFooter, { slots: { default: 'bottom' } })
    const footer = wrapper.find('footer')
    expect(footer.classes()).toContain('bili-layout-footer')
    expect(footer.attributes('style') ?? '').not.toContain('height')
  })

  it('applies an explicit height', () => {
    const wrapper = mount(LayoutFooter, { props: { height: 48 } })
    expect(wrapper.find('footer').attributes('style')).toContain('height: 48px')
  })
})
