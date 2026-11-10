import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Anchor from '../anchor.vue'
import AnchorLink from '../anchor-link.vue'

const rect = (top: number, height = 300): DOMRect =>
  ({
    top,
    bottom: top + height,
    left: 0,
    right: 100,
    width: 100,
    height,
    x: 0,
    y: top,
    toJSON: () => ({})
  }) as DOMRect

const setupDom = () => {
  const host = document.createElement('div')
  host.innerHTML = `
    <div class="scroller">
      <section id="a"></section>
      <section id="b"></section>
      <section id="c"></section>
    </div>
  `
  document.body.appendChild(host)

  const scroller = host.querySelector('.scroller') as HTMLElement
  Object.defineProperty(scroller, 'scrollHeight', { configurable: true, value: 900 })
  Object.defineProperty(scroller, 'clientHeight', { configurable: true, value: 300 })
  scroller.getBoundingClientRect = () => rect(0, 300)

  const tops: Record<string, number> = { a: 0, b: 300, c: 600 }
  for (const id of ['a', 'b', 'c']) {
    const section = host.querySelector(`#${id}`) as HTMLElement
    section.getBoundingClientRect = () => rect(tops[id] - scroller.scrollTop)
  }

  return { host, scroller, tops }
}

const mountAnchor = async (props: Record<string, unknown> = {}, links?: () => unknown) => {
  const dom = setupDom()
  const wrapper = mount(Anchor, {
    attachTo: dom.host,
    props: { container: '.scroller', duration: 0, ...props },
    slots: {
      default:
        links ??
        (() => [
          h(AnchorLink, { href: '#a', title: '章节 A' }),
          h(AnchorLink, { href: '#b', title: '章节 B' }),
          h(AnchorLink, { href: '#c', title: '章节 C' })
        ])
    }
  })
  await nextTick()
  return { ...dom, wrapper }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliAnchor', () => {
  it('renders links with href and title', async () => {
    const { wrapper } = await mountAnchor()
    const links = wrapper.findAll('.bili-anchor__link')

    expect(links).toHaveLength(3)
    expect(links[0].attributes('href')).toBe('#a')
    expect(links[0].text()).toBe('章节 A')
  })

  it('marks the first section active on mount', async () => {
    const { wrapper } = await mountAnchor()
    const links = wrapper.findAll('.bili-anchor__link')

    expect(links[0].classes()).toContain('is-active')
    expect(links[0].classes()).toContain('is-exact-active')
    expect(links[0].attributes('aria-current')).toBe('location')
  })

  it('scrolls the container and updates the active link on click', async () => {
    const { wrapper, scroller } = await mountAnchor()

    await wrapper.findAll('.bili-anchor__link')[1].trigger('click')

    expect(scroller.scrollTop).toBe(300)
    expect(wrapper.findAll('.bili-anchor__link')[1].classes()).toContain('is-exact-active')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['#b'])
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('updates the active link on scroll', async () => {
    const { wrapper, scroller } = await mountAnchor()

    scroller.scrollTop = 300
    scroller.dispatchEvent(new Event('scroll'))
    await new Promise(resolve => setTimeout(resolve, 40))
    await nextTick()

    const links = wrapper.findAll('.bili-anchor__link')
    expect(links[1].classes()).toContain('is-exact-active')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['#b'])
  })

  it('highlights parents of the active child link', async () => {
    const { wrapper } = await mountAnchor({}, () => [
      h(
        AnchorLink,
        { href: '#a', title: '章节 A' },
        {
          'sub-link': () => h(AnchorLink, { href: '#b', title: '子章节 B' })
        }
      )
    ])

    const child = wrapper.findAll('.bili-anchor__link')[1]
    await child.trigger('click')

    const links = wrapper.findAll('.bili-anchor__link')
    expect(links[0].classes()).toContain('is-active')
    expect(links[0].classes()).not.toContain('is-exact-active')
    expect(links[1].classes()).toContain('is-exact-active')
    expect(wrapper.findAll('.bili-anchor__marker.is-visible')).toHaveLength(1)
  })

  it('keeps the last link active at the bottom of the container', async () => {
    const { wrapper, scroller } = await mountAnchor()

    scroller.scrollTop = 600
    scroller.dispatchEvent(new Event('scroll'))
    await new Promise(resolve => setTimeout(resolve, 40))
    await nextTick()

    expect(wrapper.findAll('.bili-anchor__link')[2].classes()).toContain('is-exact-active')
  })

  it('supports horizontal direction and disabling the marker', async () => {
    const { wrapper } = await mountAnchor({ direction: 'horizontal', marker: false })

    expect(wrapper.classes()).toContain('bili-anchor--horizontal')
    expect(wrapper.find('.bili-anchor__marker').exists()).toBe(false)
  })

  it('resolves the container from an element reference', async () => {
    const { wrapper, scroller } = await mountAnchor({ container: undefined })
    await wrapper.setProps({ container: scroller })
    await nextTick()

    await wrapper.findAll('.bili-anchor__link')[2].trigger('click')
    expect(scroller.scrollTop).toBe(600)
  })
})
