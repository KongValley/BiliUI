import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Calendar from '../calendar.vue'

const dayByText = (wrapper: ReturnType<typeof mount>, text: string) =>
  wrapper.findAll('.bili-calendar__day').find(node => node.text() === text)

describe('BiliCalendar', () => {
  it('renders a fixed 6x7 grid for the selected month', () => {
    const wrapper = mount(Calendar, { props: { modelValue: '2026-11-10' } })

    expect(wrapper.find('.bili-calendar__label').text()).toBe('2026 年 11 月')
    expect(wrapper.findAll('.bili-calendar__day')).toHaveLength(42)
    expect(dayByText(wrapper, '10')!.classes()).toContain('is-selected')
  })

  it('selects a day and emits the ISO value', async () => {
    const wrapper = mount(Calendar, { props: { modelValue: '2026-11-10' } })

    await dayByText(wrapper, '15')!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-15'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-11-15'])
  })

  it('moves between months and emits month-change', async () => {
    const wrapper = mount(Calendar, { props: { modelValue: '2026-11-10' } })

    await wrapper.find('button[aria-label="下个月"]').trigger('click')
    expect(wrapper.find('.bili-calendar__label').text()).toBe('2026 年 12 月')
    expect(wrapper.emitted('month-change')?.[0]).toEqual([2026, 12])

    await wrapper.find('button[aria-label="上个月"]').trigger('click')
    expect(wrapper.find('.bili-calendar__label').text()).toBe('2026 年 11 月')
  })

  it('switches to the adjacent month when an outside day is clicked', async () => {
    const wrapper = mount(Calendar, { props: { modelValue: '2026-11-10' } })
    const outside = wrapper.find('.bili-calendar__day.is-outside')

    await outside.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-10-26'])
    expect(wrapper.find('.bili-calendar__label').text()).toBe('2026 年 10 月')
  })

  it('disables dates returned by disabledDate', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-11-10',
        disabledDate: (date: Date) => date.getDate() === 15
      }
    })

    const day = dayByText(wrapper, '15')!
    expect(day.attributes('disabled')).toBeDefined()
    expect(day.classes()).toContain('is-disabled')

    await day.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('selects today from the header button', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 10))
    try {
      const wrapper = mount(Calendar, { props: { modelValue: '' } })
      expect(wrapper.find('.bili-calendar__label').text()).toBe('2026 年 11 月')

      await wrapper.find('.bili-calendar__today').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-10'])
    } finally {
      vi.useRealTimers()
    }
  })

  it('honours firstDayOfWeek', () => {
    const monday = mount(Calendar, { props: { modelValue: '2026-11-10' } })
    expect(monday.findAll('.bili-calendar__weekday')[0].text()).toBe('一')

    const sunday = mount(Calendar, {
      props: { modelValue: '2026-11-10', firstDayOfWeek: 0 }
    })
    expect(sunday.findAll('.bili-calendar__weekday')[0].text()).toBe('日')
  })
})
