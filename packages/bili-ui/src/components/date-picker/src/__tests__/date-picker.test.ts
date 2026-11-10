import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DatePicker from '../date-picker.vue'

const pad = (value: number) => String(value).padStart(2, '0')
const monthKey = (day: number) => {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(day)}`
}

const mountPicker = (props: Record<string, unknown> = {}) =>
  mount(DatePicker, {
    props: { modelValue: null, ...props },
    attachTo: document.body
  })

const openPanel = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.find('.bili-date-picker').trigger('click')
  await nextTick()
}

const dayButton = (key: string) =>
  document.body.querySelector<HTMLElement>(`.bili-date-picker__day[aria-label="${key}"]`)

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliDatePicker', () => {
  it('opens the panel and selects a single date', async () => {
    const wrapper = mountPicker()
    await openPanel(wrapper)

    const key = monthKey(15)
    const day = dayButton(key)
    expect(day).not.toBeNull()
    day!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([key])
    expect(wrapper.emitted('change')?.[0]).toEqual([key])
    expect(document.body.querySelector('.bili-date-picker__panel')).toBeNull()
  })

  it('renders the selected date and navigates months', async () => {
    const wrapper = mountPicker({ modelValue: monthKey(10) })
    await openPanel(wrapper)

    expect(dayButton(monthKey(10))?.classList.contains('is-selected')).toBe(true)
    const label = () =>
      document.body.querySelector<HTMLElement>('.bili-date-picker__label')?.textContent?.trim()
    const before = label()

    document.body.querySelector<HTMLElement>('[aria-label="下个月"]')!.click()
    await nextTick()

    expect(label()).not.toBe(before)
  })

  it('switches between day, month and year views', async () => {
    const wrapper = mountPicker()
    await openPanel(wrapper)

    document.body.querySelector<HTMLElement>('.bili-date-picker__label')!.click()
    await nextTick()
    expect(document.body.querySelectorAll('.bili-date-picker__month')).toHaveLength(12)

    document.body.querySelector<HTMLElement>('.bili-date-picker__label')!.click()
    await nextTick()
    expect(document.body.querySelectorAll('.bili-date-picker__year')).toHaveLength(12)

    document.body.querySelectorAll<HTMLElement>('.bili-date-picker__year')[0].click()
    await nextTick()
    expect(document.body.querySelectorAll('.bili-date-picker__month')).toHaveLength(12)

    document.body.querySelectorAll<HTMLElement>('.bili-date-picker__month')[2].click()
    await nextTick()
    expect(document.body.querySelectorAll('.bili-date-picker__day').length).toBe(42)
  })

  it('selects a date range in either direction', async () => {
    const wrapper = mountPicker({ type: 'daterange' })
    await openPanel(wrapper)

    dayButton(monthKey(20))!.click()
    await nextTick()
    dayButton(monthKey(12))!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[monthKey(12), monthKey(20)]])
  })

  it('disables dates through disabled-date', async () => {
    const wrapper = mountPicker({
      disabledDate: (date: Date) => date.getDate() === 12
    })
    await openPanel(wrapper)

    expect(dayButton(monthKey(12))?.hasAttribute('disabled')).toBe(true)
  })

  it('applies shortcut values', async () => {
    const start = monthKey(1)
    const end = monthKey(7)
    const wrapper = mountPicker({
      type: 'daterange',
      shortcuts: [{ text: '近 7 天', value: () => [start, end] as [string, string] }]
    })
    await openPanel(wrapper)

    document.body.querySelector<HTMLElement>('.bili-date-picker__shortcut')!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[start, end]])
  })

  it('clears the value and closes on Escape', async () => {
    const wrapper = mountPicker({ modelValue: monthKey(10) })
    await wrapper.find('.bili-date-picker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)

    await openPanel(wrapper)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(document.body.querySelector('.bili-date-picker__panel')).toBeNull()
  })

  it('applies popper-class and size classes', async () => {
    const wrapper = mountPicker({ popperClass: 'custom-date-panel', size: 'sm' })
    expect(wrapper.find('.bili-date-picker').classes()).toContain('bili-date-picker--sm')

    await openPanel(wrapper)
    expect(document.body.querySelector('.bili-date-picker__panel.custom-date-panel')).not.toBeNull()
  })
})
