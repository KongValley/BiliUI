import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Countdown from '../countdown.vue'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('BiliStatisticCountdown', () => {
  it('renders the remaining time', () => {
    const wrapper = mount(Countdown, {
      props: { value: Date.now() + 65_000, title: 'Sale ends in' }
    })

    expect(wrapper.find('.bili-statistic__title').text()).toBe('Sale ends in')
    expect(wrapper.find('.bili-statistic__value').text()).toBe('00:01:05')
  })

  it('ticks every second', async () => {
    const wrapper = mount(Countdown, { props: { value: Date.now() + 65_000 } })

    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('.bili-statistic__value').text()).toBe('00:01:04')

    vi.advanceTimersByTime(4000)
    await nextTick()
    expect(wrapper.find('.bili-statistic__value').text()).toBe('00:01:00')
  })

  it('supports day tokens and folds days into hours by default', () => {
    const target = Date.now() + 90_061_000

    const withDays = mount(Countdown, {
      props: { value: target, format: 'DD:HH:mm:ss' }
    })
    expect(withDays.find('.bili-statistic__value').text()).toBe('01:01:01:01')

    const folded = mount(Countdown, { props: { value: target, format: 'HH:mm:ss' } })
    expect(folded.find('.bili-statistic__value').text()).toBe('25:01:01')
  })

  it('emits finish once the countdown reaches zero', async () => {
    const wrapper = mount(Countdown, { props: { value: Date.now() + 2000 } })

    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(wrapper.find('.bili-statistic__value').text()).toBe('00:00:00')
    expect(wrapper.emitted('finish')).toHaveLength(1)

    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(wrapper.emitted('finish')).toHaveLength(1)
  })

  it('accepts date strings and supports manual start / stop', async () => {
    const wrapper = mount(Countdown, {
      props: { value: new Date(Date.now() + 10_000).toISOString(), autoStart: false }
    })

    expect(wrapper.find('.bili-statistic__value').text()).toBe('00:00:10')

    ;(wrapper.vm as unknown as { start: () => void }).start()
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('.bili-statistic__value').text()).toBe('00:00:09')

    ;(wrapper.vm as unknown as { stop: () => void }).stop()
    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(wrapper.find('.bili-statistic__value').text()).toBe('00:00:09')
  })
})
