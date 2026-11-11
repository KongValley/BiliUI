import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DatePicker from '../date-picker.vue'

const pad = (value: number) => String(value).padStart(2, '0')
const today = () => new Date()
const dayKey = (day: number) =>
  `${today().getFullYear()}-${pad(today().getMonth() + 1)}-${pad(day)}`

const mountPicker = (props: Record<string, unknown> = {}) =>
  mount(DatePicker, {
    attachTo: document.body,
    props: { modelValue: null, ...props }
  })

const openPanel = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.find('.bili-date-picker').trigger('click')
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliDatePicker extra types', () => {
  it('opens in month view and commits a YYYY-MM value', async () => {
    const wrapper = mountPicker({ type: 'month' })
    await openPanel(wrapper)

    const months = document.body.querySelectorAll<HTMLElement>('.bili-date-picker__month')
    expect(months).toHaveLength(12)

    months[2].click()
    await nextTick()

    const expected = `${today().getFullYear()}-${pad(3)}`
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([expected])
    expect(wrapper.emitted('change')?.[0]).toEqual([expected])
    expect(document.body.querySelector('.bili-date-picker__panel')).toBeNull()
  })

  it('opens in year view and commits a YYYY value', async () => {
    const wrapper = mountPicker({ type: 'year' })
    await openPanel(wrapper)

    const years = Array.from(
      document.body.querySelectorAll<HTMLElement>('.bili-date-picker__year')
    )
    expect(years).toHaveLength(12)

    const target = String(today().getFullYear())
    years.find(node => node.textContent?.trim() === target)!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([target])
    expect(document.body.querySelector('.bili-date-picker__panel')).toBeNull()
  })

  it('navigates between year and month views for the month type', async () => {
    const wrapper = mountPicker({ type: 'month' })
    await openPanel(wrapper)

    document.body.querySelector<HTMLElement>('.bili-date-picker__label')!.click()
    await nextTick()
    expect(document.body.querySelectorAll('.bili-date-picker__year')).toHaveLength(12)

    const target = String(today().getFullYear())
    Array.from(document.body.querySelectorAll<HTMLElement>('.bili-date-picker__year'))
      .find(node => node.textContent?.trim() === target)!
      .click()
    await nextTick()

    expect(document.body.querySelectorAll('.bili-date-picker__month')).toHaveLength(12)
  })

  it('renders and edits a datetime value', async () => {
    const selected = dayKey(15)
    const wrapper = mountPicker({ type: 'datetime', modelValue: `${selected} 09:30:45` })
    expect(wrapper.find('.bili-date-picker__value').text()).toBe(`${selected} 09:30:45`)

    await openPanel(wrapper)
    expect(document.body.querySelector('.bili-date-picker__time')).not.toBeNull()
    expect(document.body.querySelectorAll('.bili-date-picker__time select')).toHaveLength(3)

    const day = document.body.querySelector<HTMLElement>(
      `.bili-date-picker__day[aria-label="${dayKey(12)}"]`
    )!
    day.click()
    await nextTick()

    const selects = document.body.querySelectorAll<HTMLSelectElement>(
      '.bili-date-picker__time select'
    )
    selects[0].value = '14'
    selects[0].dispatchEvent(new Event('change'))
    selects[1].value = '5'
    selects[1].dispatchEvent(new Event('change'))
    selects[2].value = '9'
    selects[2].dispatchEvent(new Event('change'))
    await nextTick()

    document.body.querySelector<HTMLElement>('.bili-date-picker__confirm')!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      `${dayKey(12)} 14:05:09`
    ])
    expect(document.body.querySelector('.bili-date-picker__panel')).toBeNull()
  })

  it('keeps the panel open while picking a datetime', async () => {
    const wrapper = mountPicker({ type: 'datetime' })
    await openPanel(wrapper)

    document.body.querySelector<HTMLElement>(
      `.bili-date-picker__day[aria-label="${dayKey(10)}"]`
    )!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(document.body.querySelector('.bili-date-picker__panel')).not.toBeNull()
  })

  it('disables dates for month and year shortcuts', async () => {
    const wrapper = mountPicker({
      type: 'month',
      shortcuts: [{ text: 'Disabled', value: '2020-01' }],
      disabledDate: (date: Date) => date.getFullYear() === 2020
    })
    await openPanel(wrapper)

    document.body.querySelector<HTMLElement>('.bili-date-picker__shortcut')!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
