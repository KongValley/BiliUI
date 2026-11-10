import { afterEach, describe, expect, it, vi } from 'vitest'
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

  it('toggles multiple values and keeps the panel open', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: [], options, multiple: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()

    const items = document.body.querySelectorAll<HTMLElement>('.bili-select__option')
    items[0].click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['apple'])
    expect(document.body.querySelector('.bili-select__panel')).not.toBeNull()

    await wrapper.setProps({ modelValue: ['apple'] })
    document.body.querySelectorAll<HTMLElement>('.bili-select__option')[1].click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toEqual(['apple', 'banana'])
  })

  it('collapses tags beyond maxTagCount', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: ['apple', 'banana', 'cherry'],
        options,
        multiple: true,
        maxTagCount: 2
      }
    })

    const tags = wrapper.findAll('.bili-select__tag')
    expect(tags).toHaveLength(3)
    expect(tags[2].classes()).toContain('is-rest')
    expect(tags[2].text()).toBe('+1')
  })

  it('selects all enabled options from the panel header', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: [], options, multiple: true, selectAll: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()

    const checkbox = document.body.querySelector<HTMLInputElement>(
      '.bili-select__select-all input'
    )
    expect(checkbox).not.toBeNull()
    checkbox!.checked = true
    checkbox!.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['apple', 'banana'])
  })

  it('renders option groups', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: [
          {
            label: '水果',
            options: [
              { label: 'Apple', value: 'apple' },
              { label: 'Banana', value: 'banana' }
            ]
          },
          {
            label: '蔬菜',
            options: [{ label: 'Carrot', value: 'carrot' }]
          }
        ]
      },
      attachTo: document.body
    })

    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()

    const labels = Array.from(
      document.body.querySelectorAll('.bili-select__group-label')
    ).map(node => node.textContent?.trim())
    expect(labels).toEqual(['水果', '蔬菜'])
    expect(document.body.querySelectorAll('.bili-select__option')).toHaveLength(3)
  })

  it('delegates filtering to a remote method and shows loading', async () => {
    let resolveRequest: (() => void) | undefined
    const remoteMethod = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveRequest = resolve
        })
    )

    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: [],
        filterable: true,
        remote: true,
        remoteMethod
      },
      attachTo: document.body
    })

    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()

    const filter = document.body.querySelector<HTMLInputElement>('.bili-select__filter')
    filter!.value = 'ap'
    filter!.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    expect(remoteMethod).toHaveBeenCalledWith('ap')
    expect(document.body.querySelector('.bili-select__loading')).not.toBeNull()

    resolveRequest?.()
    await flushPromises()
    expect(document.body.querySelector('.bili-select__loading')).toBeNull()
  })

  it('virtualizes long option lists and windows them on scroll', async () => {
    const many = Array.from({ length: 250 }, (_, index) => ({
      label: `Option ${index}`,
      value: index
    }))

    const wrapper = mount(Select, {
      props: { modelValue: null, options: many },
      attachTo: document.body
    })

    await wrapper.find('.bili-select').trigger('click')
    await flushPromises()

    const list = document.body.querySelector<HTMLElement>('.bili-select__list')
    expect(list?.classList.contains('is-virtual')).toBe(true)

    const rendered = list!.querySelectorAll('.bili-select__option')
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(many.length)

    list!.scrollTop = 1000
    list!.dispatchEvent(new Event('scroll', { bubbles: true }))
    await nextTick()

    const first = list!.querySelector<HTMLElement>('.bili-select__option')
    expect(Number(first?.dataset.index)).toBeGreaterThan(0)
  })
})
