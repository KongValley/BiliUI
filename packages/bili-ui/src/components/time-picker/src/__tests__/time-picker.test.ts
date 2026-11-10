import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimePicker from '../time-picker.vue'

const mountPicker = (props: Record<string, unknown> = {}) =>
  mount(TimePicker, {
    props: { modelValue: '', ...props },
    attachTo: document.body
  })

const openPanel = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.find('.bili-time-picker').trigger('click')
  await nextTick()
}

const column = (index: number) =>
  document.body.querySelectorAll<HTMLElement>('.bili-time-picker__list')[index]

const items = (index: number) =>
  Array.from(column(index)?.querySelectorAll<HTMLElement>('.bili-time-picker__item') ?? [])

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliTimePicker', () => {
  it('selects hour and minute then confirms', async () => {
    const wrapper = mountPicker()
    await openPanel(wrapper)

    items(0)
      .find(item => item.textContent?.trim() === '10')!
      .click()
    items(1)
      .find(item => item.textContent?.trim() === '30')!
      .click()
    await nextTick()
    document.body.querySelector<HTMLElement>('.bili-time-picker__confirm')!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:30'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['10:30'])
    expect(document.body.querySelector('.bili-time-picker__panel')).toBeNull()
  })

  it('supports seconds and zero-pads the value', async () => {
    const wrapper = mountPicker({ showSeconds: true })
    await openPanel(wrapper)

    items(0)
      .find(item => item.textContent?.trim() === '09')!
      .click()
    items(1)
      .find(item => item.textContent?.trim() === '08')!
      .click()
    items(2)
      .find(item => item.textContent?.trim() === '07')!
      .click()
    await nextTick()
    document.body.querySelector<HTMLElement>('.bili-time-picker__confirm')!.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['09:08:07'])
  })

  it('applies minute and second steps', async () => {
    const wrapper = mountPicker({
      showSeconds: true,
      minuteStep: 15,
      secondStep: 10
    })
    await openPanel(wrapper)

    expect(items(1)).toHaveLength(4)
    expect(items(2)).toHaveLength(6)
  })

  it('hides disabled hours and minutes', async () => {
    const wrapper = mountPicker({
      disabledHours: () => [9],
      disabledMinutes: (hour: number) => (hour === 10 ? [30] : [])
    })
    await openPanel(wrapper)

    expect(items(0).some(item => item.textContent?.trim() === '09')).toBe(false)
    items(0)
      .find(item => item.textContent?.trim() === '10')!
      .click()
    await nextTick()
    expect(items(1).some(item => item.textContent?.trim() === '30')).toBe(false)
  })

  it('sets the current time with the now button', async () => {
    const wrapper = mountPicker()
    await openPanel(wrapper)

    document.body.querySelector<HTMLElement>('.bili-time-picker__now')!.click()
    await nextTick()
    document.body.querySelector<HTMLElement>('.bili-time-picker__confirm')!.click()
    await nextTick()

    const value = wrapper.emitted('update:modelValue')?.[0]?.[0] as string
    expect(value).toMatch(/^\d{2}:\d{2}$/)
  })

  it('clears the value', async () => {
    const wrapper = mountPicker({ modelValue: '10:30' })
    await wrapper.find('.bili-time-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('closes on Escape and applies popper-class', async () => {
    const wrapper = mountPicker({ popperClass: 'custom-time-panel' })
    await openPanel(wrapper)

    expect(document.body.querySelector('.bili-time-picker__panel.custom-time-panel')).not.toBeNull()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(document.body.querySelector('.bili-time-picker__panel')).toBeNull()
  })

  it('renders the formatted value in the trigger', () => {
    const wrapper = mountPicker({ modelValue: '09:05', showSeconds: true })
    expect(wrapper.find('.bili-time-picker__value').text()).toBe('09:05:00')
  })
})
