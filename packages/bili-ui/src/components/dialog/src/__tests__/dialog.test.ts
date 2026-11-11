import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Dialog from '../dialog.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliDialog', () => {
  it('applies overlay-class and panel-class to the teleported layers', async () => {
    mount(Dialog, {
      props: {
        modelValue: true,
        title: '提示',
        overlayClass: 'custom-dialog-overlay',
        panelClass: 'custom-dialog-panel'
      },
      attachTo: document.body
    })
    await nextTick()

    expect(document.body.querySelector('.bili-dialog.custom-dialog-panel')).not.toBeNull()
    expect(
      document.body.querySelector('.bili-dialog__overlay.custom-dialog-overlay')
    ).not.toBeNull()
  })

  it('renders into body when visible', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: false, title: '提示' },
      slots: { default: '内容' },
      attachTo: document.body
    })

    expect(document.body.querySelector('.bili-dialog')).toBeNull()

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    expect(document.body.querySelector('.bili-dialog')).not.toBeNull()
    expect(document.body.textContent).toContain('提示')
    expect(document.body.textContent).toContain('内容')
  })

  it('requests close from the close button', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, title: '提示' },
      attachTo: document.body
    })
    await nextTick()

    const closeButton = document.body.querySelector<HTMLElement>('.bili-dialog__close')
    closeButton?.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closes on escape', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, title: '提示' },
      attachTo: document.body
    })
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('does not close on escape when disabled', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, closeOnEsc: false },
      attachTo: document.body
    })
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('closes when the mask is clicked and respects closeOnClickModal', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, title: '提示' },
      attachTo: document.body
    })
    await nextTick()

    document.body
      .querySelector<HTMLElement>('.bili-dialog__overlay')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    const locked = mount(Dialog, {
      props: { modelValue: true, title: '提示', closeOnClickModal: false },
      attachTo: document.body
    })
    await nextTick()
    document.body
      .querySelector<HTMLElement>('.bili-dialog__overlay')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(locked.emitted('update:modelValue')).toBeUndefined()
  })
})
