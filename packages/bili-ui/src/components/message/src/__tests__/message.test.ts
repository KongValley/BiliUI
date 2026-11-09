import { afterEach, describe, expect, it, vi } from 'vitest'
import { config, flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MessageItem from '../message.vue'
import { __resetMessages, BiliMessage } from '../method'

// Vue Test Utils stubs <Transition> by default. The stub never fires
// `after-leave`, so a closed message would stay mounted and its container would
// never be dropped. Use the real component to exercise the real lifecycle.
config.global.stubs = { transition: false, 'transition-group': false }

afterEach(async () => {
  // Restore real timers first so any pending transition callbacks can settle,
  // then tear down synchronously instead of racing the leave animation.
  vi.useRealTimers()
  __resetMessages()
  await flushPromises()
  document.body.innerHTML = ''
})

const findMessage = (text: string): HTMLElement | null => {
  const nodes = Array.from(document.body.querySelectorAll<HTMLElement>('.bili-message'))
  return nodes.find(node => node.textContent?.includes(text)) ?? null
}

const findContainer = (position: string): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`.bili-message-container--${position}`)

describe('BiliMessage', () => {
  it('renders a message through the imperative API', () => {
    BiliMessage.success('操作成功')
    const message = findMessage('操作成功')
    expect(message).not.toBeNull()
    expect(message?.classList.contains('bili-message--success')).toBe(true)
  })

  it('supports closable messages', () => {
    BiliMessage({ message: '可关闭', showClose: true })
    const message = findMessage('可关闭')
    expect(message?.querySelector('.bili-message__close')).not.toBeNull()
  })

  it('auto closes after the duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MessageItem, {
      props: { message: '自动关闭', duration: 100 }
    })

    expect(wrapper.emitted('close')).toBeUndefined()
    vi.advanceTimersByTime(100)
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not auto close when duration is zero', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MessageItem, {
      props: { message: '常驻', duration: 0 }
    })

    vi.advanceTimersByTime(5000)
    await nextTick()

    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('renders a countdown bar matching the duration', () => {
    const wrapper = mount(MessageItem, {
      props: { message: '倒计时', duration: 5000 }
    })
    const bar = wrapper.find('.bili-message__progress')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('style')).toContain('animation-duration: 5000ms')
    expect(bar.attributes('style')).toContain('animation-play-state: running')
  })

  it('hides the countdown bar for persistent messages', () => {
    const wrapper = mount(MessageItem, {
      props: { message: '常驻', duration: 0 }
    })
    expect(wrapper.find('.bili-message__progress').exists()).toBe(false)
  })

  it('hides the countdown bar when showProgress is false', () => {
    const wrapper = mount(MessageItem, {
      props: { message: '无进度条', duration: 3000, showProgress: false }
    })
    expect(wrapper.find('.bili-message__progress').exists()).toBe(false)
  })

  it('pauses and resumes the countdown on hover', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MessageItem, {
      props: { message: '悬停暂停', duration: 1000 }
    })
    const message = wrapper.find('.bili-message')

    vi.advanceTimersByTime(400)
    await message.trigger('mouseenter')

    const bar = wrapper.find('.bili-message__progress')
    expect(bar.attributes('style')).toContain('animation-play-state: paused')
    expect(wrapper.find('.bili-message').classes()).toContain('is-paused')

    // Countdown is frozen while hovered.
    vi.advanceTimersByTime(5000)
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()

    await message.trigger('mouseleave')
    expect(wrapper.find('.bili-message__progress').attributes('style')).toContain(
      'animation-play-state: running'
    )

    // Only the remaining 600ms should be needed to close.
    vi.advanceTimersByTime(599)
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()

    vi.advanceTimersByTime(2)
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('keeps counting down when pauseOnHover is disabled', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MessageItem, {
      props: { message: '不暂停', duration: 500, pauseOnHover: false }
    })

    await wrapper.find('.bili-message').trigger('mouseenter')
    vi.advanceTimersByTime(500)
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('BiliMessage positions', () => {
  it('defaults to the top container', () => {
    BiliMessage('默认位置')
    const container = findContainer('top')
    expect(container).not.toBeNull()
    expect(container?.textContent).toContain('默认位置')
    expect(findMessage('默认位置')?.classList.contains('bili-message--at-top')).toBe(true)
  })

  it('creates one container per position', () => {
    BiliMessage({ message: '左上', position: 'top-left' })
    BiliMessage({ message: '右上', position: 'top-right' })
    BiliMessage({ message: '左下', position: 'bottom-left' })
    BiliMessage({ message: '右下', position: 'bottom-right' })
    BiliMessage({ message: '下方', position: 'bottom' })

    expect(findContainer('top-left')?.textContent).toContain('左上')
    expect(findContainer('top-right')?.textContent).toContain('右上')
    expect(findContainer('bottom-left')?.textContent).toContain('左下')
    expect(findContainer('bottom-right')?.textContent).toContain('右下')
    expect(findContainer('bottom')?.textContent).toContain('下方')
    // The default top container stays untouched by positioned messages.
    expect(findContainer('top')).toBeNull()
  })

  it('adds the position modifier to the message element', () => {
    BiliMessage({ message: '底部提示', position: 'bottom' })
    const message = findMessage('底部提示')
    expect(message?.classList.contains('bili-message--at-bottom')).toBe(true)
  })

  it('keeps messages in separate stacks', () => {
    BiliMessage({ message: '顶部一', position: 'top' })
    BiliMessage({ message: '顶部二', position: 'top' })
    BiliMessage({ message: '底部一', position: 'bottom' })

    expect(findContainer('top')?.querySelectorAll('.bili-message')).toHaveLength(2)
    expect(findContainer('bottom')?.querySelectorAll('.bili-message')).toHaveLength(1)
  })

  it('closes every message when no position is given', async () => {
    BiliMessage({ message: '顶部', position: 'top', duration: 0 })
    BiliMessage({ message: '底部', position: 'bottom', duration: 0 })

    BiliMessage.closeAll()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 160))

    expect(document.body.querySelectorAll('.bili-message')).toHaveLength(0)
    expect(document.body.querySelectorAll('.bili-message-container')).toHaveLength(0)
  })

  it('closes messages of a single position only', async () => {
    BiliMessage({ message: '左上', position: 'top-left', duration: 0 })
    BiliMessage({ message: '右下', position: 'bottom-right', duration: 0 })

    BiliMessage.closeAll('top-left')
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 160))

    expect(findMessage('左上')).toBeNull()
    expect(findMessage('右下')).not.toBeNull()
    expect(findContainer('top-left')).toBeNull()
    expect(findContainer('bottom-right')).not.toBeNull()
  })
})
