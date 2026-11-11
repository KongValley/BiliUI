import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Scrollbar from '../scrollbar.vue'

const setMetrics = (
  element: HTMLElement,
  metrics: { clientWidth?: number; clientHeight?: number; scrollWidth?: number; scrollHeight?: number }
) => {
  Object.entries(metrics).forEach(([key, value]) => {
    Object.defineProperty(element, key, { configurable: true, value })
  })
}

const mountScrollbar = (props: Record<string, unknown> = {}) =>
  mount(Scrollbar, {
    attachTo: document.body,
    props,
    slots: { default: '<div class="content">content</div>' }
  })

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliScrollbar', () => {
  it('renders the wrap, view and slot content', () => {
    const wrapper = mountScrollbar()

    expect(wrapper.find('.bili-scrollbar__wrap').exists()).toBe(true)
    expect(wrapper.find('.bili-scrollbar__view').exists()).toBe(true)
    expect(wrapper.find('.content').text()).toBe('content')
  })

  it('applies height and max-height', async () => {
    const wrapper = mountScrollbar({ height: 160, maxHeight: '50vh' })
    const wrap = wrapper.find('.bili-scrollbar__wrap')
    expect(wrap.attributes('style')).toContain('height: 160px')
    expect(wrap.attributes('style')).toContain('max-height: 50vh')
  })

  it('sizes the vertical thumb from the scroll metrics', async () => {
    const wrapper = mountScrollbar({ always: true })
    const wrap = wrapper.find('.bili-scrollbar__wrap').element as HTMLElement
    setMetrics(wrap, { clientHeight: 200, scrollHeight: 1000, clientWidth: 200, scrollWidth: 200 })
    ;(wrapper.vm as unknown as { update: () => void }).update()
    await nextTick()

    const bar = wrapper.find('.bili-scrollbar__bar-vertical')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('style')).not.toContain('display: none')

    const thumb = wrapper.find('.bili-scrollbar__thumb')
    expect(thumb.attributes('style')).toContain('height: 40px')
  })

  it('moves the thumb when the wrap scrolls', async () => {
    const wrapper = mountScrollbar()
    const wrap = wrapper.find('.bili-scrollbar__wrap').element as HTMLElement
    setMetrics(wrap, { clientHeight: 200, scrollHeight: 1000, clientWidth: 200, scrollWidth: 200 })
    ;(wrapper.vm as unknown as { update: () => void }).update()
    await nextTick()

    wrap.scrollTop = 400
    wrap.dispatchEvent(new Event('scroll'))
    await nextTick()

    const thumb = wrapper.find('.bili-scrollbar__thumb')
    expect(thumb.attributes('style')).toContain('translateY(78px)')
    expect(wrapper.emitted('scroll')?.[0]).toEqual([{ scrollTop: 400, scrollLeft: 0 }])
  })

  it('hides custom bars in native mode', async () => {
    const wrapper = mountScrollbar({ native: true })
    const wrap = wrapper.find('.bili-scrollbar__wrap').element as HTMLElement
    setMetrics(wrap, { clientHeight: 100, scrollHeight: 400, clientWidth: 100, scrollWidth: 100 })
    ;(wrapper.vm as unknown as { update: () => void }).update()
    await nextTick()

    expect(wrapper.find('.bili-scrollbar__bar').exists()).toBe(false)
    expect(wrapper.classes()).toContain('is-native')
  })

  it('sets the scroll position through the exposed method', async () => {
    const wrapper = mountScrollbar()
    const wrap = wrapper.find('.bili-scrollbar__wrap').element as HTMLElement
    ;(wrapper.vm as unknown as { setScrollTop: (top: number) => void }).setScrollTop(120)
    expect(wrap.scrollTop).toBe(120)
  })
})
