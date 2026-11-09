import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Select from '../select.vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliSelect', () => {
  it('opens the panel and selects an option', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options, filterable: false },
      attachTo: document.body
    })

    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()

    const panel = document.body.querySelector('.bili-select__panel')
    expect(panel).not.toBeNull()

    const items = document.body.querySelectorAll<HTMLElement>('.bili-select__option')
    items[1].click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('banana')
  })

  it('filters options by keyword', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options, filterable: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()

    const filter = document.body.querySelector<HTMLInputElement>('.bili-select__filter')
    expect(filter).not.toBeNull()
    filter!.value = 'ban'
    filter!.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    const items = document.body.querySelectorAll('.bili-select__option')
    expect(items).toHaveLength(1)
    expect(items[0].textContent?.trim()).toBe('Banana')
  })

  it('clears the current value', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'apple', options, clearable: true },
      attachTo: document.body
    })

    const clear = wrapper.find('.bili-select__clear')
    expect(clear.exists()).toBe(true)
    await clear.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('shows placeholder without a value', () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options, placeholder: '请选择水果' }
    })
    expect(wrapper.find('.bili-select__value').text()).toBe('请选择水果')
    expect(wrapper.find('.bili-select__value').classes()).toContain('is-placeholder')
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options, disabled: true },
      attachTo: document.body
    })
    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()
    expect(document.body.querySelector('.bili-select__panel')).toBeNull()
  })
})
