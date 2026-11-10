import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Popover from '../popover.vue'
import Popconfirm from '../popconfirm.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

const mountPopover = (props: Record<string, any> = {}) =>
  mount(Popover, {
    props: { trigger: 'click', title: '标题', content: '内容', ...props },
    slots: { default: () => '触发器' },
    attachTo: document.body
  })

describe('BiliPopover', () => {
  it('opens on click and renders title and content', async () => {
    const wrapper = mountPopover()
    await nextTick()
    expect(document.body.querySelector('.bili-popover__content')).toBeNull()

    await wrapper.trigger('click')
    await nextTick()

    const content = document.body.querySelector('.bili-popover__content')
    expect(content).not.toBeNull()
    expect(content?.querySelector('.bili-popover__title')?.textContent).toBe('标题')
    expect(content?.querySelector('.bili-popover__body')?.textContent).toBe('内容')
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])

    wrapper.unmount()
  })

  it('toggles closed on a second click', async () => {
    const wrapper = mountPopover()
    await wrapper.trigger('click')
    await nextTick()
    expect(document.body.querySelector('.bili-popover__content')).not.toBeNull()

    await wrapper.trigger('click')
    await nextTick()
    expect(document.body.querySelector('.bili-popover__content')).toBeNull()

    wrapper.unmount()
  })

  it('respects the controlled visible prop', async () => {
    const wrapper = mountPopover({ visible: true })
    await nextTick()
    await nextTick()

    expect(document.body.querySelector('.bili-popover__content')).not.toBeNull()
    expect(wrapper.emitted('visible-change')).toBeUndefined()

    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mountPopover({ disabled: true })
    await wrapper.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.bili-popover__content')).toBeNull()
    wrapper.unmount()
  })

  it('renders the arrow and footer slot', async () => {
    const wrapper = mount(Popover, {
      props: { visible: true },
      slots: {
        default: () => '触发器',
        footer: () => h('button', { class: 'footer-action' }, '操作')
      },
      attachTo: document.body
    })
    await nextTick()
    await nextTick()

    expect(document.body.querySelector('.bili-popover__arrow')).not.toBeNull()
    expect(document.body.querySelector('.bili-popover__footer .footer-action')).not.toBeNull()

    wrapper.unmount()
  })

  it('hides the arrow when disabled', async () => {
    const wrapper = mountPopover({ visible: true, showArrow: false })
    await nextTick()
    await nextTick()

    expect(document.body.querySelector('.bili-popover__arrow')).toBeNull()
    wrapper.unmount()
  })
})

describe('BiliPopconfirm', () => {
  const mountConfirm = (props: Record<string, any> = {}) =>
    mount(Popconfirm, {
      props: { content: '确认删除？', ...props },
      slots: { default: () => '删除' },
      attachTo: document.body
    })

  it('emits confirm and closes', async () => {
    const wrapper = mountConfirm()
    await wrapper.trigger('click')
    await nextTick()

    const buttons = document.body.querySelectorAll<HTMLButtonElement>('.bili-popconfirm__actions button')
    expect(buttons).toHaveLength(2)
    buttons[1].click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits cancel without confirming', async () => {
    const wrapper = mountConfirm()
    await wrapper.trigger('click')
    await nextTick()

    const buttons = document.body.querySelectorAll<HTMLButtonElement>('.bili-popconfirm__actions button')
    buttons[0].click()
    await nextTick()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
    wrapper.unmount()
  })

  it('waits for an async onConfirm before closing', async () => {
    let resolve: (() => void) | undefined
    const wrapper = mountConfirm({
      onConfirm: () => new Promise<void>(done => { resolve = done })
    })

    await wrapper.trigger('click')
    await nextTick()

    const buttons = document.body.querySelectorAll<HTMLButtonElement>('.bili-popconfirm__actions button')
    buttons[1].click()
    await nextTick()

    // Still open while the promise is pending.
    expect(document.body.querySelector('.bili-popover__content')).not.toBeNull()

    resolve?.()
    await new Promise(r => setTimeout(r, 0))
    await nextTick()

    expect(document.body.querySelector('.bili-popover__content')).toBeNull()
    wrapper.unmount()
  })

  it('renders custom button labels', async () => {
    const wrapper = mountConfirm({ confirmText: '删除', cancelText: '再想想' })
    await wrapper.trigger('click')
    await nextTick()

    const buttons = document.body.querySelectorAll<HTMLButtonElement>('.bili-popconfirm__actions button')
    expect(buttons[0].textContent?.trim()).toBe('再想想')
    expect(buttons[1].textContent?.trim()).toBe('删除')
    wrapper.unmount()
  })
})
