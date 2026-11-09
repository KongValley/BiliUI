import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MessageItem from '../message.vue'
import { BiliMessage } from '../method'

afterEach(() => {
  BiliMessage.closeAll()
  vi.useRealTimers()
})

const findMessage = (text: string): HTMLElement | null => {
  const nodes = Array.from(document.body.querySelectorAll<HTMLElement>('.bili-message'))
  return nodes.find(node => node.textContent?.includes(text)) ?? null
}

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
