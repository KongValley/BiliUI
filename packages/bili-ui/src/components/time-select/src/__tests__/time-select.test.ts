import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimeSelect from '../time-select.vue'

const mountSelect = (props: Record<string, unknown> = {}) =>
  mount(TimeSelect, {
    attachTo: document.body,
    props
  })

const panel = () => document.body.querySelector<HTMLElement>('.bili-time-select__panel')

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliTimeSelect', () => {
  it('generates options from start, end and step', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.bili-time-select').trigger('click')
    await nextTick()

    const options = document.body.querySelectorAll('.bili-time-select__option')
    expect(options).toHaveLength(19)
    expect(options[0].textContent?.trim()).toBe('09:00')
    expect(options[options.length - 1].textContent?.trim()).toBe('18:00')
  })

  it('accepts a custom option list', async () => {
    const wrapper = mountSelect({ options: ['08:00', '12:30'] })
    await wrapper.find('.bili-time-select').trigger('click')
    await nextTick()

    expect(document.body.querySelectorAll('.bili-time-select__option')).toHaveLength(2)
  })

  it('selects an option and closes the panel', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.bili-time-select').trigger('click')
    await nextTick()

    document.body.querySelectorAll<HTMLElement>('.bili-time-select__option')[3].click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:30'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['10:30'])
    expect(panel()).toBeNull()
  })

  it('shows the selected value and clears it', async () => {
    const wrapper = mountSelect({ modelValue: '11:00' })
    expect(wrapper.find('.bili-time-select__value').text()).toBe('11:00')

    await wrapper.find('.bili-time-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports keyboard navigation and escape', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.find('.bili-time-select')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(panel()).not.toBeNull()

    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['09:00'])

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(panel()).toBeNull()
  })

  it('does not open while disabled', async () => {
    const wrapper = mountSelect({ disabled: true })
    await wrapper.find('.bili-time-select').trigger('click')
    await nextTick()

    expect(panel()).toBeNull()
    expect(wrapper.find('.bili-time-select').attributes('tabindex')).toBe('-1')
  })

  it('applies popper-class and size classes', async () => {
    const wrapper = mountSelect({ popperClass: 'custom-time-panel', size: 'sm' })
    expect(wrapper.find('.bili-time-select').classes()).toContain('bili-time-select--sm')

    await wrapper.find('.bili-time-select').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.bili-time-select__panel.custom-time-panel')).not.toBeNull()
  })
})
