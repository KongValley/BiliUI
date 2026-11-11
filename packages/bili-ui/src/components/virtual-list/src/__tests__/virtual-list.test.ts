import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import VirtualList from '../virtual-list.vue'

const items = Array.from({ length: 100 }, (_, index) => `row-${index}`)

const mountList = (props: Record<string, unknown> = {}) =>
  mount(VirtualList, {
    props: { data: items, itemHeight: 20, height: 100, buffer: 1, ...props }
  })

describe('BiliVirtualList', () => {
  it('renders only the visible window with spacers', () => {
    const wrapper = mountList()
    expect(wrapper.findAll('.bili-virtual-list__item')).toHaveLength(6)
    expect(wrapper.find('.bili-virtual-list__phantom').attributes('style')).toContain(
      'height: 2000px'
    )
  })

  it('updates the window after scrolling', async () => {
    const wrapper = mountList()
    const scroller = wrapper.element as HTMLElement
    scroller.scrollTop = 100
    await wrapper.trigger('scroll')

    const rendered = wrapper.findAll('.bili-virtual-list__item')
    expect(rendered).toHaveLength(7)
    expect(rendered[0].text()).toBe('row-4')
    expect(
      wrapper.find('.bili-virtual-list__phantom').element.children[0].getAttribute('style')
    ).toContain('height: 80px')
  })

  it('emits scroll with the current offset', async () => {
    const wrapper = mountList()
    ;(wrapper.element as HTMLElement).scrollTop = 120
    await wrapper.trigger('scroll')
    expect(wrapper.emitted('scroll')?.[0]).toEqual([120])
  })

  it('scrolls to an index through the exposed method', async () => {
    const wrapper = mountList()
    ;(wrapper.vm as unknown as { scrollToIndex: (index: number) => void }).scrollToIndex(50)
    await wrapper.vm.$nextTick()

    expect((wrapper.element as HTMLElement).scrollTop).toBe(1000)
    expect(wrapper.findAll('.bili-virtual-list__item')[0].text()).toBe('row-49')
    expect(wrapper.emitted('scroll')?.[0]).toEqual([1000])
  })

  it('clamps scrollTo to the content height', async () => {
    const wrapper = mountList()
    ;(wrapper.vm as unknown as { scrollTo: (top: number) => void }).scrollTo(9000)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('scroll')?.[0]).toEqual([2000])
  })

  it('passes the absolute index to the item slot', async () => {
    const wrapper = mount(VirtualList, {
      props: { data: items, itemHeight: 20, height: 100, buffer: 1 },
      slots: {
        default: ({ item, index }: { item: string; index: number }) =>
          h('span', { class: 'cell' }, `${index}:${item}`)
      }
    })
    ;(wrapper.element as HTMLElement).scrollTop = 100
    await wrapper.trigger('scroll')

    expect(wrapper.findAll('.cell')[0].text()).toBe('4:row-4')
  })

  it('renders an empty phantom when there is no data', () => {
    const wrapper = mount(VirtualList, { props: { data: [] } })
    expect(wrapper.findAll('.bili-virtual-list__item')).toHaveLength(0)
    expect(wrapper.find('.bili-virtual-list__phantom').attributes('style')).toContain(
      'height: 0px'
    )
  })
})
