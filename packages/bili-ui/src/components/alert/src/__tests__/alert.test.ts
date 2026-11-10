import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from '../alert.vue'

// `Transition` renders a fragment root, so `wrapper.classes()` is empty;
// query the alert element directly instead.
const alertEl = (wrapper: ReturnType<typeof mount>) => wrapper.find('.bili-alert')

describe('BiliAlert', () => {
  it('renders the title, description and icon', () => {
    const wrapper = mount(Alert, {
      props: { type: 'success', title: '保存成功', description: '数据已同步', showIcon: true }
    })

    expect(alertEl(wrapper).classes()).toContain('bili-alert--success')
    expect(wrapper.find('.bili-alert__title').text()).toBe('保存成功')
    expect(wrapper.find('.bili-alert__description').text()).toBe('数据已同步')
    expect(wrapper.find('.bili-alert__icon').exists()).toBe(true)
    expect(alertEl(wrapper).attributes('role')).toBe('alert')
  })

  it('omits the icon by default', () => {
    expect(mount(Alert, { props: { title: '标题' } }).find('.bili-alert__icon').exists()).toBe(
      false
    )
  })

  it('renders slot content', () => {
    const wrapper = mount(Alert, {
      props: { title: '标题' },
      slots: { default: '<strong class="slot-desc">自定义描述</strong>' }
    })
    expect(wrapper.find('.slot-desc').text()).toBe('自定义描述')
  })

  it('closes itself and emits events', async () => {
    const wrapper = mount(Alert, { props: { title: '可关闭', closable: true } })

    await wrapper.find('.bili-alert__close').trigger('click')

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.bili-alert').exists()).toBe(false)  })

  it('respects controlled visibility', async () => {
    const wrapper = mount(Alert, {
      props: { title: '受控', closable: true, visible: true }
    })

    await wrapper.find('.bili-alert__close').trigger('click')
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    // Still visible because the parent owns the state.
    expect(wrapper.find('.bili-alert').exists()).toBe(true)

    await wrapper.setProps({ visible: false })
    expect(wrapper.find('.bili-alert').exists()).toBe(false)
  })

  it('applies the bordered modifier and action slot', () => {
    const wrapper = mount(Alert, {
      props: { title: '带边框', bordered: true },
      slots: { action: '<button class="action">查看</button>' }
    })

    expect(alertEl(wrapper).classes()).toContain('is-bordered')
    expect(wrapper.find('.action').text()).toBe('查看')
  })
})
