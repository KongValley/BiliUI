import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from '../switch.vue'

describe('BiliSwitch', () => {
  it('toggles between active and inactive values', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: 'off', activeValue: 'on', inactiveValue: 'off' }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['on'])

    await wrapper.setProps({ modelValue: 'on' })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['off'])
  })

  it('exposes switch semantics', () => {
    const wrapper = mount(Switch, { props: { modelValue: true } })
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('true')
    expect(wrapper.classes()).toContain('is-checked')
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, disabled: true }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders active text when checked', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true, activeText: '开', inactiveText: '关' }
    })
    expect(wrapper.text()).toContain('开')
  })
})
