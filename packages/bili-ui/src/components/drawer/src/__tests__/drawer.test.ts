import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Drawer from '../drawer.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliDrawer', () => {
  it('applies overlay-class and panel-class to the teleported layers', async () => {
    mount(Drawer, {
      props: {
        modelValue: true,
        title: '筛选',
        overlayClass: 'custom-drawer-overlay',
        panelClass: 'custom-drawer-panel'
      },
      attachTo: document.body
    })
    await nextTick()

    expect(document.body.querySelector('.bili-drawer.custom-drawer-panel')).not.toBeNull()
    expect(
      document.body.querySelector('.bili-drawer__overlay.custom-drawer-overlay')
    ).not.toBeNull()
  })

  it('renders into body when visible', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: false, title: '筛选' },
      slots: { default: '内容' },
      attachTo: document.body
    })

    expect(document.body.querySelector('.bili-drawer')).toBeNull()

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    expect(document.body.querySelector('.bili-drawer')).not.toBeNull()
    expect(document.body.textContent).toContain('筛选')
    expect(document.body.textContent).toContain('内容')
  })

  it('places the panel and uses width for side drawers', async () => {
    mount(Drawer, {
      props: { modelValue: true, placement: 'left', size: 320 },
      attachTo: document.body
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.bili-drawer')
    expect(panel?.classList.contains('bili-drawer--left')).toBe(true)
    expect(panel?.getAttribute('style')).toContain('width: 320px')
  })

  it('uses height for vertical drawers', async () => {
    mount(Drawer, {
      props: { modelValue: true, placement: 'bottom', size: 240 },
      attachTo: document.body
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.bili-drawer')
    expect(panel?.classList.contains('bili-drawer--bottom')).toBe(true)
    expect(panel?.getAttribute('style')).toContain('height: 240px')
  })

  it('requests close from the close button', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true, title: '提示' },
      attachTo: document.body
    })
    await nextTick()

    document.body.querySelector<HTMLElement>('.bili-drawer__close')?.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closes on escape', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true },
      attachTo: document.body
    })
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('does not close on escape when disabled', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true, closeOnEsc: false },
      attachTo: document.body
    })
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('closes on overlay click and honours closeOnClickModal', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true },
      attachTo: document.body
    })
    await nextTick()

    document.body.querySelector<HTMLElement>('.bili-drawer__overlay')?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    const guarded = mount(Drawer, {
      props: { modelValue: true, closeOnClickModal: false },
      attachTo: document.body
    })
    await nextTick()

    const overlays = document.body.querySelectorAll<HTMLElement>('.bili-drawer__overlay')
    overlays[overlays.length - 1].click()
    await nextTick()
    expect(guarded.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders header and footer slots', async () => {
    mount(Drawer, {
      props: { modelValue: true },
      slots: {
        header: '<strong class="custom-header">筛选</strong>',
        footer: '<button class="custom-footer">确定</button>'
      },
      attachTo: document.body
    })
    await nextTick()

    expect(document.body.querySelector('.bili-drawer__header .custom-header')).not.toBeNull()
    expect(document.body.querySelector('.bili-drawer__footer .custom-footer')).not.toBeNull()
  })
})
