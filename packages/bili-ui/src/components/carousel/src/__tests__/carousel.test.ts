import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Carousel from '../carousel.vue'
import CarouselItem from '../carousel-item.vue'

const mountCarousel = (props: Record<string, unknown> = {}, count = 3) =>
  mount(Carousel, {
    props: { autoplay: false, ...props },
    slots: {
      default: () =>
        Array.from({ length: count }, (_, index) =>
          h(CarouselItem, null, () => `slide ${index + 1}`)
        )
    }
  })

const activeIndex = (wrapper: ReturnType<typeof mountCarousel>) =>
  wrapper.findAll('.bili-carousel-item').findIndex(item => item.classes().includes('is-active'))

afterEach(() => {
  vi.useRealTimers()
})

describe('BiliCarousel', () => {
  it('renders slides and activates the first one', async () => {
    const wrapper = mountCarousel()
    await nextTick()

    expect(wrapper.findAll('.bili-carousel-item')).toHaveLength(3)
    expect(activeIndex(wrapper)).toBe(0)
    expect(wrapper.find('.bili-carousel__indicators').exists()).toBe(true)
  })

  it('honours and clamps initial-index', async () => {
    const middle = mountCarousel({ initialIndex: 1 })
    const outOfRange = mountCarousel({ initialIndex: 9 })
    await nextTick()

    expect(activeIndex(middle)).toBe(1)
    expect(activeIndex(outOfRange)).toBe(2)
  })

  it('navigates with arrows and emits change', async () => {
    const wrapper = mountCarousel()
    await nextTick()

    await wrapper.find('[aria-label="下一张"]').trigger('click')
    expect(activeIndex(wrapper)).toBe(1)
    expect(wrapper.emitted('change')?.[0]).toEqual([1, 0])

    await wrapper.find('[aria-label="上一张"]').trigger('click')
    expect(activeIndex(wrapper)).toBe(0)
    expect(wrapper.emitted('change')?.[1]).toEqual([0, 1])
  })

  it('loops by default and clamps when loop is disabled', async () => {
    const looped = mountCarousel()
    await nextTick()
    await looped.find('[aria-label="上一张"]').trigger('click')
    expect(activeIndex(looped)).toBe(2)

    const clamped = mountCarousel({ loop: false })
    await nextTick()
    await clamped.find('[aria-label="上一张"]').trigger('click')
    expect(activeIndex(clamped)).toBe(0)

    clamped.vm.setActiveItem(2)
    await nextTick()
    await clamped.find('[aria-label="下一张"]').trigger('click')
    expect(activeIndex(clamped)).toBe(2)
  })

  it('activates slides from indicators on click or hover', async () => {
    const clickable = mountCarousel()
    await nextTick()
    await clickable.findAll('.bili-carousel__indicator')[2].trigger('click')
    expect(activeIndex(clickable)).toBe(2)

    const hoverable = mountCarousel({ trigger: 'hover' })
    await nextTick()
    await hoverable.findAll('.bili-carousel__indicator')[1].trigger('mouseenter')
    expect(activeIndex(hoverable)).toBe(1)

    await hoverable.findAll('.bili-carousel__indicator')[1].trigger('click')
    expect(activeIndex(hoverable)).toBe(1)
  })

  it('autoplays and pauses while hovering', async () => {
    vi.useFakeTimers()
    const wrapper = mountCarousel({ autoplay: true, interval: 1000 })
    await nextTick()

    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(activeIndex(wrapper)).toBe(1)

    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(activeIndex(wrapper)).toBe(1)

    await wrapper.trigger('mouseleave')
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(activeIndex(wrapper)).toBe(2)
  })

  it('does not autoplay when disabled', async () => {
    vi.useFakeTimers()
    const wrapper = mountCarousel({ autoplay: false, interval: 500 })
    await nextTick()

    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(activeIndex(wrapper)).toBe(0)
  })

  it('translates items on the vertical axis', async () => {
    const wrapper = mountCarousel({ direction: 'vertical' })
    await nextTick()
    const items = wrapper.findAll('.bili-carousel-item')

    expect(wrapper.classes()).toContain('bili-carousel--vertical')
    expect(items[0].attributes('style')).toContain('translateY(0%)')
    expect(items[1].attributes('style')).toContain('translateY(100%)')
    expect(items[2].attributes('style')).toContain('translateY(100%)')
    expect(wrapper.find('[aria-label="下一张"] .bili-icon').exists()).toBe(true)
  })

  it('supports keyboard navigation', async () => {
    const wrapper = mountCarousel()
    await nextTick()

    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(activeIndex(wrapper)).toBe(1)

    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(activeIndex(wrapper)).toBe(0)

    await wrapper.trigger('keydown', { key: 'End' })
    expect(activeIndex(wrapper)).toBe(2)

    await wrapper.trigger('keydown', { key: 'Home' })
    expect(activeIndex(wrapper)).toBe(0)
  })

  it('renders indicators only where requested', async () => {
    const outside = mountCarousel({ indicatorPosition: 'outside' })
    const none = mountCarousel({ indicatorPosition: 'none' })
    await nextTick()

    expect(outside.find('.bili-carousel__indicators--outside').exists()).toBe(true)
    expect(none.find('.bili-carousel__indicators').exists()).toBe(false)
  })

  it('hides arrows when arrow is never', async () => {
    const wrapper = mountCarousel({ arrow: 'never' })
    await nextTick()

    expect(wrapper.find('[aria-label="下一张"]').exists()).toBe(false)
  })
})
