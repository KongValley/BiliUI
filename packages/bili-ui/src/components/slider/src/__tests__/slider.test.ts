import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Slider from '../slider.vue'

const mockRect = (width = 200, height = 20) => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value() {
      return {
        width,
        height,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect
    }
  })
}

/**
 * jsdom's PointerEvent lacks pointerId and its clientX is read-only, so build
 * the event with the coordinates baked in and dispatch it manually.
 */
const drag = (
  element: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  clientX: number,
  clientY = 10
) => {
  const event = new MouseEvent(type, { bubbles: true, clientX, clientY })
  Object.defineProperty(event, 'pointerId', { value: 1 })
  // jsdom only defines setPointerCapture on some elements; stub when absent.
  if (typeof (element as HTMLElement).setPointerCapture !== 'function') {
    Object.defineProperty(element, 'setPointerCapture', {
      configurable: true,
      value: () => undefined
    })
  }
  element.dispatchEvent(event)
}

afterEach(() => {
  // Restore the jsdom default so other suites are unaffected.
  delete (HTMLElement.prototype as unknown as Record<string, unknown>).getBoundingClientRect
})

describe('BiliSlider', () => {
  it('renders a single handle and a fill at the value position', () => {
    const wrapper = mount(Slider, { props: { modelValue: 40 } })

    expect(wrapper.findAll('.bili-slider__handle')).toHaveLength(1)
    expect(wrapper.find('.bili-slider__fill').attributes('style')).toContain('left: 40%')
    expect(wrapper.find('.bili-slider__fill').attributes('style')).toContain('width: 0%')
    expect(wrapper.find('.bili-slider__track').attributes('aria-valuenow')).toBe('40')
  })

  it('renders two handles for a range and fills between them', () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 70] } })

    expect(wrapper.classes()).toContain('is-range')
    expect(wrapper.findAll('.bili-slider__handle')).toHaveLength(2)
    const fill = wrapper.find('.bili-slider__fill').attributes('style') ?? ''
    expect(fill).toContain('left: 20%')
    expect(fill).toContain('width: 50%')
  })

  it('emits an updated value on track click', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { modelValue: 0 } })

    drag(wrapper.find('.bili-slider__track').element, 'pointerdown', 100, 10)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([50])
    expect(wrapper.emitted('change')?.[0]).toEqual([50])
  })

  it('snaps to the step', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { modelValue: 0, step: 25 } })

    drag(wrapper.find('.bili-slider__track').element, 'pointerdown', 130, 10)
    // 65% snaps to 75 with a step of 25.
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([75])
  })

  it('never lets the range handles cross', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { modelValue: [20, 70] } })

    // Drag the right handle past the left one.
    drag(wrapper.find('.bili-slider__track').element, 'pointerdown', 140, 10)
    drag(wrapper.find('.bili-slider__track').element, 'pointermove', 10, 10)

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as [number, number]
    expect(emitted[0]).toBeLessThanOrEqual(emitted[1])
  })

  it('steps with the arrow keys', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 10 } })
    const handle = wrapper.find('.bili-slider__handle')

    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([60])

    await handle.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([40])
  })

  it('does not emit when disabled', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { modelValue: 10, disabled: true } })

    drag(wrapper.find('.bili-slider__track').element, 'pointerdown', 100, 10)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders marks and custom tooltip text', () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 30,
        marks: { 0: '0%', 50: '50%', 100: '100%' },
        formatTooltip: (value: number) => `${value} 分`
      }
    })

    expect(wrapper.findAll('.bili-slider__mark')).toHaveLength(3)
    expect(wrapper.find('.bili-slider__tooltip').text()).toBe('30 分')
  })

  it('applies the vertical modifier', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, vertical: true } })
    expect(wrapper.classes()).toContain('bili-slider--vertical')
  })
})
