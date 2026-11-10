import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ColorPicker from '../color-picker.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliColorPicker', () => {
  it('opens the panel on click', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#e0356b' },
      attachTo: document.body
    })

    await wrapper.find('.bili-color-picker').trigger('click')
    await flushPromises()

    expect(document.body.querySelector('.bili-color-picker__panel')).not.toBeNull()
    expect(document.body.querySelector('.bili-color-picker__sv')).not.toBeNull()
    expect(document.body.querySelectorAll('.bili-color-picker__preset').length).toBeGreaterThan(0)
  })

  it('applies popper-class to the teleported panel', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#e0356b', popperClass: 'custom-color-panel' },
      attachTo: document.body
    })

    await wrapper.find('.bili-color-picker').trigger('click')
    await flushPromises()

    expect(
      document.body.querySelector('.bili-color-picker__panel.custom-color-panel')
    ).not.toBeNull()
  })

  it('shows the value and colour swatch in the trigger', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#13c2c2' } })
    expect(wrapper.find('.bili-color-picker__value').text()).toBe('#13C2C2')
    expect(wrapper.find('.bili-color-picker__swatch').attributes('style')).toContain(
      'background-color: rgb(19, 194, 194)'
    )
  })

  it('selects a preset colour', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#000000' },
      attachTo: document.body
    })

    await wrapper.find('.bili-color-picker').trigger('click')
    await flushPromises()

    const presets = document.body.querySelectorAll<HTMLElement>('.bili-color-picker__preset')
    presets[6].click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#1677ff'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['#1677ff'])
  })

  it('commits a typed hex value', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#000000' },
      attachTo: document.body
    })

    await wrapper.find('.bili-color-picker').trigger('click')
    await flushPromises()

    const input = document.body.querySelector<HTMLInputElement>('.bili-color-picker__hex')
    input!.value = '#00ff00'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    input!.dispatchEvent(new Event('blur', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#00ff00'])
  })

  it('reverts invalid hex input without emitting', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#e0356b' },
      attachTo: document.body
    })

    await wrapper.find('.bili-color-picker').trigger('click')
    await flushPromises()

    const input = document.body.querySelector<HTMLInputElement>('.bili-color-picker__hex')
    input!.value = 'not-a-color'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    input!.dispatchEvent(new Event('blur', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input!.value).toBe('#E0356B')
  })

  it('clears the current colour', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#e0356b', clearable: true }
    })

    await wrapper.find('.bili-color-picker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#e0356b', disabled: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-color-picker').trigger('click')
    await flushPromises()
    expect(document.body.querySelector('.bili-color-picker__panel')).toBeNull()
  })
})
