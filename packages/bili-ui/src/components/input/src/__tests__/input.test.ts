import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '../input.vue'

describe('BiliInput', () => {
  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['hello'])
  })

  it('clears the value', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello', clearable: true } })
    await wrapper.find('button[aria-label="清空"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('toggles password visibility', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'secret', type: 'password', showPassword: true }
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
    await wrapper.find('button[aria-label="显示密码"]').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('renders character count', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'abc', showCount: true, maxlength: 10 }
    })
    expect(wrapper.find('.bili-input__count').text()).toBe('3/10')
  })

  it('renders a textarea when type is textarea', () => {
    const wrapper = mount(Input, { props: { type: 'textarea', rows: 4 } })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('textarea').attributes('rows')).toBe('4')
  })

  it('does not show clear button when disabled', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'hello', clearable: true, disabled: true }
    })
    expect(wrapper.find('button[aria-label="清空"]').exists()).toBe(false)
  })
})
