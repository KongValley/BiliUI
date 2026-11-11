import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Segmented from '../segmented.vue'

const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
]

describe('BiliSegmented', () => {
  it('renders every option and marks the selected one', () => {
    const wrapper = mount(Segmented, { props: { modelValue: 'week', options } })
    const items = wrapper.findAll('.bili-segmented__item')

    expect(items).toHaveLength(3)
    expect(items[1].classes()).toContain('is-selected')
    expect(items[1].attributes('aria-checked')).toBe('true')
    expect(items[1].attributes('tabindex')).toBe('0')
    expect(items[0].attributes('tabindex')).toBe('-1')
  })

  it('emits update and change when another option is clicked', async () => {
    const wrapper = mount(Segmented, { props: { modelValue: 'day', options } })
    await wrapper.findAll('.bili-segmented__item')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['month'])
  })

  it('does not emit for the active or a disabled option', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'day',
        options: [...options, { label: '年', value: 'year', disabled: true }]
      }
    })

    await wrapper.findAll('.bili-segmented__item')[0].trigger('click')
    await wrapper.findAll('.bili-segmented__item')[3].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('disables every item when the root is disabled', () => {
    const wrapper = mount(Segmented, {
      props: { modelValue: 'day', options, disabled: true }
    })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(
      wrapper.findAll('.bili-segmented__item').every(item => item.attributes('disabled') !== undefined)
    ).toBe(true)
  })

  it('moves selection with arrow keys and skips disabled options', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'day',
        options: [
          { label: '日', value: 'day' },
          { label: '周', value: 'week', disabled: true },
          { label: '月', value: 'month' }
        ]
      }
    })

    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])

    await wrapper.setProps({ modelValue: 'month' })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['day'])
  })

  it('supports block, size and icon options', () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'list',
        block: true,
        size: 'lg',
        options: [{ label: '列表', value: 'list', icon: 'list' }]
      }
    })

    expect(wrapper.classes()).toContain('is-block')
    expect(wrapper.classes()).toContain('bili-segmented--lg')
    expect(wrapper.find('.bili-segmented__icon').exists()).toBe(true)
  })

  it('renders an animated thumb layer', () => {
    const wrapper = mount(Segmented, { props: { modelValue: 'day', options } })
    expect(wrapper.find('.bili-segmented__thumb').exists()).toBe(true)
  })
})
