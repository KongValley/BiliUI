import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AutoComplete from '../auto-complete.vue'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

const mountComplete = (props: Record<string, unknown> = {}) =>
  mount(AutoComplete, {
    props: { options: ['Apple', 'Banana', 'Cherry'], debounce: 0, ...props },
    attachTo: document.body
  })

const panelOptions = () =>
  [...document.querySelectorAll<HTMLElement>('.bili-auto-complete__option')]

describe('BiliAutoComplete', () => {
  it('opens on focus and shows all options', async () => {
    const wrapper = mountComplete()
    await wrapper.find('input').trigger('focus')
    await nextTick()

    expect(document.querySelector('.bili-auto-complete__panel')).not.toBeNull()
    expect(panelOptions().map(option => option.textContent?.trim())).toEqual([
      'Apple',
      'Banana',
      'Cherry'
    ])
  })

  it('filters local options while typing', async () => {
    const wrapper = mountComplete()
    await wrapper.find('input').setValue('ban')
    await sleep()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ban'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['ban'])
    expect(panelOptions().map(option => option.textContent?.trim())).toEqual(['Banana'])
  })

  it('selects an option with the mouse', async () => {
    const wrapper = mountComplete()
    await wrapper.find('input').setValue('ban')
    await sleep()

    panelOptions()[0].click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Banana'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Banana'])
    expect(wrapper.emitted('select')?.[0]).toEqual([
      { label: 'Banana', value: 'Banana', disabled: false }
    ])
  })

  it('moves the active option with the keyboard and selects on enter', async () => {
    const wrapper = mountComplete()
    const input = wrapper.find('input')
    await input.trigger('focus')
    await nextTick()

    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const active = document.querySelector('.bili-auto-complete__option.is-active')
    expect(active?.textContent?.trim()).toBe('Banana')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Banana'])
  })

  it('shows the empty state when nothing matches', async () => {
    const wrapper = mountComplete()
    await wrapper.find('input').setValue('zzz')
    await sleep()

    expect(panelOptions()).toHaveLength(0)
    expect(document.querySelector('.bili-auto-complete__empty')?.textContent).toContain('暂无数据')
  })

  it('loads async suggestions and reports the loading state', async () => {
    let resolveFetch: (value: string[]) => void = () => undefined
    const fetchSuggestions = vi.fn(
      () =>
        new Promise<string[]>(resolve => {
          resolveFetch = resolve
        })
    )
    const wrapper = mountComplete({ options: [], fetchSuggestions, debounce: 0 })
    await wrapper.find('input').trigger('focus')
    await nextTick()

    expect(document.querySelector('.bili-auto-complete__loading')).not.toBeNull()

    resolveFetch(['Remote result'])
    await flushPromises()
    await sleep()

    expect(fetchSuggestions).toHaveBeenCalledWith('')
    expect(panelOptions().map(option => option.textContent?.trim())).toEqual(['Remote result'])
  })

  it('does not open when disabled', async () => {
    const wrapper = mountComplete({ disabled: true })
    await wrapper.find('input').trigger('focus')
    await nextTick()
    expect(document.querySelector('.bili-auto-complete__panel')).toBeNull()
  })
})
