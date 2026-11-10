import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Rate from '../rate.vue'

const mockRect = (element: Element, width = 20) => {
  element.getBoundingClientRect = () =>
    ({
      left: 0,
      top: 0,
      right: width,
      bottom: width,
      width,
      height: width,
      x: 0,
      y: 0,
      toJSON: () => ({})
    }) as DOMRect
}

describe('BiliRate', () => {
  it('renders the configured number of stars', () => {
    const wrapper = mount(Rate, { props: { modelValue: 2, count: 4 } })
    expect(wrapper.findAll('.bili-rate__item')).toHaveLength(4)
    expect(wrapper.attributes('aria-valuemax')).toBe('4')
    expect(wrapper.attributes('aria-valuenow')).toBe('2')
  })

  it('sets the value when a star is clicked', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 0 } })
    await wrapper.findAll('.bili-rate__item')[2].trigger('click', { clientX: 15 })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
  })

  it('supports half stars', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 0, allowHalf: true } })
    const star = wrapper.findAll('.bili-rate__item')[1]
    mockRect(star.element)

    await star.trigger('click', { clientX: 5 })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1.5])
  })

  it('renders a half-filled star for fractional values', () => {
    const wrapper = mount(Rate, { props: { modelValue: 2.5, allowHalf: true } })
    const items = wrapper.findAll('.bili-rate__item')

    expect(items[0].classes()).toContain('is-active')
    expect(items[2].classes()).toContain('is-half')
    expect(items[2].find('.bili-rate__fill').attributes('style')).toContain('width: 50%')
    expect(items[3].classes()).not.toContain('is-active')
  })

  it('clears the value when the same star is clicked again', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 3 } })
    const star = wrapper.findAll('.bili-rate__item')[2]
    mockRect(star.element)

    await star.trigger('click', { clientX: 15 })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('shows text for the current score', () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 4,
        showText: true,
        texts: ['很差', '一般', '不错', '很好', '极佳']
      }
    })
    expect(wrapper.find('.bili-rate__text').text()).toBe('很好')
  })

  it('supports keyboard adjustment', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 3, allowHalf: true } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3.5])

    await wrapper.setProps({ modelValue: 3.5 })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([3])
  })

  it('does not emit when disabled or readonly', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 2, disabled: true } })
    await wrapper.findAll('.bili-rate__item')[4].trigger('click')
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    const readonly = mount(Rate, { props: { modelValue: 2, readonly: true } })
    await readonly.findAll('.bili-rate__item')[1].trigger('click')
    expect(readonly.emitted('update:modelValue')).toBeUndefined()
  })
})
