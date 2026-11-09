import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Checkbox from '../checkbox.vue'
import CheckboxGroup from '../checkbox-group.vue'

describe('BiliCheckbox', () => {
  it('toggles standalone value', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('reflects checked state', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true, label: '同意' }
    })
    expect(wrapper.classes()).toContain('is-checked')
    expect(wrapper.text()).toContain('同意')
  })

  it('supports grouping and emits the next array', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { modelValue: ['a'] },
      slots: {
        default: () => [
          h(Checkbox, { value: 'a' }, () => 'A'),
          h(Checkbox, { value: 'b' }, () => 'B')
        ]
      }
    })

    const inputs = wrapper.findAll('input')
    await inputs[1].setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
  })

  it('respects the max constraint', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { modelValue: ['a'], max: 1 },
      slots: {
        default: () => [
          h(Checkbox, { value: 'a' }, () => 'A'),
          h(Checkbox, { value: 'b' }, () => 'B')
        ]
      }
    })

    const inputs = wrapper.findAll('input')
    await inputs[1].setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
