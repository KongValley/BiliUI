import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Affix from '../affix.vue'

const rect = (top: number, left: number, width: number, height: number): DOMRect =>
  ({
    top,
    bottom: top + height,
    left,
    right: left + width,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({})
  }) as DOMRect

const mountAffix = (props: Record<string, unknown> = {}) => {
  const wrapper = mount(Affix, {
    attachTo: document.body,
    props: { offset: 10, ...props },
    slots: { default: '<button class="affix-slot">操作</button>' }
  })
  const root = wrapper.find('.bili-affix').element as HTMLElement
  const content = wrapper.find('.bili-affix__content').element as HTMLElement
  const state = { top: 0, bottom: 40, left: 30, width: 100, height: 40 }

  root.getBoundingClientRect = () => rect(state.top, state.left, state.width, state.height)
  content.getBoundingClientRect = () => rect(0, state.left, state.width, state.height)

  return { wrapper, root, content, state }
}

const dispatchScroll = async () => {
  window.dispatchEvent(new Event('scroll'))
  await new Promise(resolve => setTimeout(resolve, 30))
  await nextTick()
}

const originalInnerHeight = window.innerHeight

afterEach(() => {
  document.body.innerHTML = ''
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: originalInnerHeight
  })
})

describe('BiliAffix', () => {
  it('makes the content fixed after scrolling past the top offset', async () => {
    const { wrapper, content, state } = mountAffix()
    await nextTick()

    state.top = -20
    state.bottom = 20
    await dispatchScroll()

    const fixedContent = wrapper.find('.bili-affix__content')
    expect(wrapper.find('.bili-affix').classes()).toContain('is-fixed')
    expect(fixedContent.classes()).toContain('is-fixed')
    expect(wrapper.find('.bili-affix').attributes('style')).toContain('--bili-affix-width: 100px')
    expect(wrapper.find('.bili-affix').attributes('style')).toContain('--bili-affix-height: 40px')
    expect(fixedContent.attributes('style')).toContain('--bili-affix-top: 10px')
    expect(fixedContent.attributes('style')).toContain('--bili-affix-left: 30px')
    expect(fixedContent.attributes('style')).toContain('--bili-affix-width: 100px')
    expect(fixedContent.attributes('style')).toContain('--bili-affix-z-index: 100')
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
    expect((content as HTMLElement).tagName).toBe('DIV')
  })

  it('returns to the normal flow when scrolled back', async () => {
    const { wrapper, state } = mountAffix()
    await nextTick()

    state.top = -20
    state.bottom = 20
    await dispatchScroll()
    expect(wrapper.find('.bili-affix').classes()).toContain('is-fixed')

    state.top = 120
    state.bottom = 160
    await dispatchScroll()

    expect(wrapper.find('.bili-affix').classes()).not.toContain('is-fixed')
    expect(wrapper.find('.bili-affix__content').attributes('style') || '').toBe('')
    expect(wrapper.emitted('change')?.at(-1)).toEqual([false])
  })

  it('supports bottom positioning', async () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
    const { wrapper, state } = mountAffix({ position: 'bottom', offset: 12 })
    await nextTick()

    state.top = 580
    state.bottom = 620
    await dispatchScroll()

    const style = wrapper.find('.bili-affix__content').attributes('style') || ''
    expect(wrapper.find('.bili-affix').classes()).toContain('is-fixed')
    expect(style).toContain('--bili-affix-bottom: 12px')
    expect(style).not.toContain('--bili-affix-top')
  })

  it('keeps the fixed element inside the target boundary', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    target.getBoundingClientRect = () => rect(-100, 0, 400, 130)

    const { wrapper, state } = mountAffix({ target })
    await nextTick()

    state.top = -20
    state.bottom = 20
    await dispatchScroll()

    const style = wrapper.find('.bili-affix__content').attributes('style') || ''
    expect(style).toContain('--bili-affix-top: -10px')
  })

  it('exposes update and emits change only once per state', async () => {
    const { wrapper, state } = mountAffix()
    await nextTick()

    state.top = -20
    state.bottom = 20
    ;(wrapper.vm as unknown as { update: () => void }).update()
    ;(wrapper.vm as unknown as { update: () => void }).update()
    await nextTick()

    expect(wrapper).toBeTruthy()
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('renders slot content', async () => {
    const { wrapper } = mountAffix()
    await nextTick()
    expect(wrapper.find('.affix-slot').text()).toBe('操作')
  })
})
