import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Radio from '../radio.vue'
import RadioGroup from '../radio-group.vue'

const check = async (input: ReturnType<ReturnType<typeof mount>['find']>) => {
  ;(input.element as HTMLInputElement).checked = true
  await input.trigger('change')
}

describe('BiliRadio', () => {
  it('renders its label and unchecked state', () => {
    const wrapper = mount(Radio, { props: { value: 'a', label: '选项 A' } })
    expect(wrapper.classes()).not.toContain('is-checked')
    expect(wrapper.find('.bili-radio__label').text()).toBe('选项 A')
  })

  it('reflects the checked value', () => {
    const wrapper = mount(Radio, { props: { value: 'a', modelValue: 'a' } })
    expect(wrapper.classes()).toContain('is-checked')
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update and change when selected', async () => {
    const wrapper = mount(Radio, { props: { value: 'a' } })
    await check(wrapper.find('input'))
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['a'])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(Radio, { props: { value: 'a', disabled: true } })
    await check(wrapper.find('input'))
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports label as the value fallback and a custom name', () => {
    const wrapper = mount(Radio, { props: { label: 'fallback', name: 'group-name' } })
    expect(wrapper.find('input').attributes('name')).toBe('group-name')
    expect(wrapper.find('.bili-radio__label').text()).toBe('fallback')
  })
})

describe('BiliRadioGroup', () => {
  const mountGroup = (props: Record<string, unknown> = {}) =>
    mount(RadioGroup, {
      props: { modelValue: 'a', ...props },
      slots: {
        default: () => [
          h(Radio, { value: 'a' }, () => 'A'),
          h(Radio, { value: 'b' }, () => 'B')
        ]
      }
    })

  it('selects a child and emits the group value', async () => {
    const wrapper = mountGroup()
    await check(wrapper.findAll('input')[1])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
  })

  it('propagates the disabled state to every child', async () => {
    const wrapper = mountGroup({ disabled: true })
    expect(wrapper.findAll('.bili-radio').every(node => node.classes().includes('is-disabled'))).toBe(
      true
    )
    await check(wrapper.findAll('input')[1])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shares its name with all radios', () => {
    const wrapper = mountGroup({ name: 'plan' })
    const names = wrapper.findAll('input').map(input => input.attributes('name'))
    expect(names).toEqual(['plan', 'plan'])
  })
})
