import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InputNumber from '../input-number.vue'

const mountInput = (props: Record<string, any> = {}) =>
  mount(InputNumber, { props: { modelValue: 5, ...props } })

describe('BiliInputNumber', () => {
  it('renders the current value', () => {
    const wrapper = mountInput()
    expect(wrapper.find('input').element.value).toBe('5')
  })

  it('increments and decrements within bounds', async () => {
    const wrapper = mountInput({ modelValue: 5, min: 0, max: 6 })

    await wrapper.findAll('.bili-input-number__button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
    expect(wrapper.emitted('change')?.[0]).toEqual([6])

    await wrapper.setProps({ modelValue: 5 })
    await wrapper.findAll('.bili-input-number__button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([4])
  })

  it('clamps to min and max', async () => {
    const wrapper = mountInput({ modelValue: 5, min: 5, max: 10 })
    // Decrement is blocked at the lower bound.
    expect(
      wrapper.findAll('.bili-input-number__button')[0].attributes('disabled')
    ).toBeDefined()
  })

  it('honours the step and precision', async () => {
    const wrapper = mountInput({ modelValue: 1, step: 0.1, precision: 2 })
    await wrapper.findAll('.bili-input-number__button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1.1])
  })

  it('commits a typed value on blur', async () => {
    const wrapper = mountInput({ modelValue: 1 })
    const input = wrapper.find('.bili-input-number__input')

    await input.trigger('focus')
    await input.setValue('42')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
  })

  it('clamps out-of-range typed values', async () => {
    const wrapper = mountInput({ modelValue: 1, max: 10 })
    const input = wrapper.find('.bili-input-number__input')

    await input.trigger('focus')
    await input.setValue('99')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('steps with the arrow keys', async () => {
    const wrapper = mountInput({ modelValue: 3 })
    const input = wrapper.find('.bili-input-number__input')

    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([2])
  })

  it('clears the value when the input is emptied', async () => {
    const wrapper = mountInput({ modelValue: 5 })
    const input = wrapper.find('.bili-input-number__input')

    await input.trigger('focus')
    await input.setValue('')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('disables the controls and input', () => {
    const wrapper = mountInput({ disabled: true })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('.bili-input-number__button')[0].attributes('disabled')).toBeDefined()
  })

  it('hides the steppers when controls is false', () => {
    const wrapper = mountInput({ controls: false })
    expect(wrapper.find('.bili-input-number__controls').exists()).toBe(false)
  })

  it('uses formatter and parser', async () => {
    const wrapper = mountInput({
      modelValue: 1000,
      formatter: (value: number | undefined) => `$ ${value}`,
      parser: (raw: string) => Number(raw.replace(/\$|\s/g, ''))
    })

    expect(wrapper.find('input').element.value).toBe('$ 1000')

    const input = wrapper.find('.bili-input-number__input')
    await input.trigger('focus')
    await input.setValue('$ 2000')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2000])
  })
})
