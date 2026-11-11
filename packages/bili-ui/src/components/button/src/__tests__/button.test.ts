import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../button.vue'

describe('BiliButton', () => {
  it('renders slot content and base class', () => {
    const wrapper = mount(Button, { slots: { default: '提交' } })
    expect(wrapper.text()).toContain('提交')
    expect(wrapper.classes()).toContain('bili-button')
  })

  it('applies type and size modifiers', () => {
    const wrapper = mount(Button, { props: { type: 'primary', size: 'lg' } })
    expect(wrapper.classes()).toContain('bili-button--primary')
    expect(wrapper.classes()).toContain('bili-button--lg')
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled or loading', async () => {
    const disabled = mount(Button, { props: { disabled: true } })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()

    const loading = mount(Button, { props: { loading: true } })
    await loading.trigger('click')
    expect(loading.emitted('click')).toBeUndefined()
  })

  it('renders a spinner when loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.find('.bili-button__loading').exists()).toBe(true)
  })

  it('applies block, round and native type attributes', () => {
    const wrapper = mount(Button, {
      props: { block: true, round: true, nativeType: 'submit' }
    })
    expect(wrapper.classes()).toContain('is-block')
    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
