import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Transfer from '../transfer.vue'

const data = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
  { key: 'c', label: 'Gamma', disabled: true },
  { key: 'd', label: 'Delta' }
]

const setCheckbox = async (input: ReturnType<ReturnType<typeof mount>['find']>, checked: boolean) => {
  ;(input.element as HTMLInputElement).checked = checked
  await input.trigger('change')
}

describe('BiliTransfer', () => {
  it('splits items by the target keys', () => {
    const wrapper = mount(Transfer, { props: { data, modelValue: ['d'] } })

    expect(wrapper.findAll('.bili-transfer__panel-left .bili-transfer__item')).toHaveLength(3)
    expect(wrapper.findAll('.bili-transfer__panel-right .bili-transfer__item')).toHaveLength(1)
    expect(wrapper.find('.bili-transfer__panel-right').text()).toContain('Delta')
  })

  it('moves checked items to the right and clears their selection', async () => {
    const wrapper = mount(Transfer, { props: { data, modelValue: [] } })

    await wrapper.findAll('.bili-transfer__panel-left .bili-transfer__item')[0].trigger('click')
    const action = wrapper.findAll('.bili-transfer__action')[0]
    expect(action.attributes('disabled')).toBeUndefined()

    await action.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['a'])
    expect(wrapper.emitted('change')?.[0]?.[1]).toBe('right')
    expect(wrapper.emitted('change')?.[0]?.[2]).toEqual(['a'])
  })

  it('moves checked items back to the left', async () => {
    const wrapper = mount(Transfer, { props: { data, modelValue: ['a', 'b'] } })

    await wrapper.findAll('.bili-transfer__panel-right .bili-transfer__item')[0].trigger('click')
    await wrapper.findAll('.bili-transfer__action')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['b'])
    expect(wrapper.emitted('change')?.[0]?.[1]).toBe('left')
  })

  it('selects all enabled items from the header', async () => {
    const wrapper = mount(Transfer, { props: { data, modelValue: [] } })

    const headerCheckbox = wrapper.find('.bili-transfer__panel-left input[type="checkbox"]')
    await setCheckbox(headerCheckbox, true)
    await nextTick()

    await wrapper.findAll('.bili-transfer__action')[0].trigger('click')

    // `c` is disabled and must stay on the left.
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['a', 'b', 'd'])
  })

  it('filters items independently on each side', async () => {
    const wrapper = mount(Transfer, {
      props: { data, modelValue: [], filterable: true }
    })

    await wrapper.find('.bili-transfer__filter-input').setValue('am')
    expect(wrapper.findAll('.bili-transfer__panel-left .bili-transfer__item')).toHaveLength(1)
    expect(wrapper.find('.bili-transfer__panel-left').text()).toContain('Gamma')
  })

  it('ignores disabled items and marks the header indeterminate', async () => {
    const wrapper = mount(Transfer, { props: { data, modelValue: [] } })

    const disabledItem = wrapper.findAll('.bili-transfer__panel-left .bili-transfer__item')[2]
    await disabledItem.trigger('click')
    expect(wrapper.find('.bili-transfer__panel-left .bili-transfer__item.is-checked').exists()).toBe(
      false
    )

    await wrapper.findAll('.bili-transfer__panel-left .bili-transfer__item')[0].trigger('click')
    await nextTick()
    const header = wrapper.find('.bili-transfer__panel-left .bili-checkbox')
    expect(header.classes()).toContain('is-indeterminate')
  })

  it('disables every control when the whole transfer is disabled', () => {
    const wrapper = mount(Transfer, {
      props: { data, modelValue: [], disabled: true }
    })

    const actions = wrapper.findAll<HTMLElement>('.bili-transfer__action')
    expect(actions[0].attributes('disabled')).toBeDefined()
    expect(actions[1].attributes('disabled')).toBeDefined()
    expect(
      wrapper.find('.bili-transfer__panel-left input[type="checkbox"]').attributes('disabled')
    ).toBeDefined()
  })
})
