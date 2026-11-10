import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Statistic from '../statistic.vue'

describe('BiliStatistic', () => {
  it('renders a title and grouped integer value', () => {
    const wrapper = mount(Statistic, {
      props: { title: '总销售额', value: 1234567 }
    })

    expect(wrapper.find('.bili-statistic__title').text()).toBe('总销售额')
    expect(wrapper.find('.bili-statistic__value').text()).toBe('1,234,567')
  })

  it('keeps the requested precision', () => {
    const wrapper = mount(Statistic, {
      props: { value: 3.1, precision: 2 }
    })
    expect(wrapper.find('.bili-statistic__value').text()).toBe('3.10')
  })

  it('supports custom separators', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 1234567.89,
        precision: 2,
        groupSeparator: '.',
        decimalSeparator: ','
      }
    })
    expect(wrapper.find('.bili-statistic__value').text()).toBe('1.234.567,89')
  })

  it('formats negative values', () => {
    const wrapper = mount(Statistic, { props: { value: -1234.5 } })
    expect(wrapper.find('.bili-statistic__value').text()).toBe('-1,234.5')
  })

  it('renders prefix and suffix', () => {
    const wrapper = mount(Statistic, {
      props: { value: 99, prefix: '¥', suffix: '元' }
    })
    expect(wrapper.find('.bili-statistic__prefix').text()).toBe('¥')
    expect(wrapper.find('.bili-statistic__suffix').text()).toBe('元')
  })

  it('delegates to formatter', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 42,
        formatter: (value: number | string) => `${value}%`
      }
    })
    expect(wrapper.find('.bili-statistic__value').text()).toBe('42%')
  })

  it('leaves non-numeric strings untouched', () => {
    const wrapper = mount(Statistic, { props: { value: 'N/A' } })
    expect(wrapper.find('.bili-statistic__value').text()).toBe('N/A')
  })

  it('supports title, prefix and suffix slots', () => {
    const wrapper = mount(Statistic, {
      props: { value: 8 },
      slots: {
        title: () => h('strong', { class: 'custom-title' }, '在线人数'),
        prefix: () => h('span', { class: 'custom-prefix' }, '≈'),
        suffix: () => h('span', { class: 'custom-suffix' }, '人')
      }
    })

    expect(wrapper.find('.custom-title').text()).toBe('在线人数')
    expect(wrapper.find('.custom-prefix').text()).toBe('≈')
    expect(wrapper.find('.custom-suffix').text()).toBe('人')
  })
})
