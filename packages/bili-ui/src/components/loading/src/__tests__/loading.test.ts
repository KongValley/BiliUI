/* eslint-disable vue/one-component-per-file */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import Loading from '../loading.vue'
import { vLoading } from '../directive'

describe('BiliLoading', () => {
  it('renders a status region with the localized label', () => {
    const wrapper = mount(Loading)
    expect(wrapper.classes()).toContain('bili-loading')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('加载中…')
    expect(wrapper.find('.bili-loading__spinner').exists()).toBe(true)
  })

  it('renders optional text and the size modifier', () => {
    const wrapper = mount(Loading, { props: { text: '同步中', size: 'lg' } })
    expect(wrapper.classes()).toContain('bili-loading--lg')
    expect(wrapper.find('.bili-loading__text').text()).toBe('同步中')
    expect(wrapper.attributes('aria-label')).toBe('同步中')
  })

  it('teleports the fullscreen variant to body', () => {
    const wrapper = mount(Loading, {
      attachTo: document.body,
      props: { fullscreen: true, text: '全屏加载' }
    })
    expect(document.body.querySelector('.bili-loading.is-fullscreen')).not.toBeNull()
    expect(document.body.querySelector('.bili-loading__text')?.textContent).toBe('全屏加载')
    wrapper.unmount()
  })
})

describe('vLoading', () => {
  const mountHost = (value: unknown) =>
    mount(
      defineComponent({
        setup() {
          return () =>
            withDirectives(h('div', { class: 'loading-host' }, '内容'), [[vLoading, value]])
        }
      }),
      { attachTo: document.body }
    )

  it('mounts an overlay and makes a static host positioned', () => {
    const wrapper = mountHost({ text: '加载中' })
    const host = wrapper.find('.loading-host').element as HTMLElement
    expect(host.style.position).toBe('relative')
    expect(host.querySelector('.bili-loading-wrapper')).not.toBeNull()
    expect(host.querySelector('.bili-loading__text')?.textContent).toBe('加载中')
    wrapper.unmount()
  })

  it('accepts a boolean binding and renders the default spinner', () => {
    const wrapper = mountHost(true)
    const host = wrapper.find('.loading-host').element as HTMLElement
    expect(host.querySelector('.bili-loading')).not.toBeNull()
    expect(host.querySelector('.bili-loading__text')).toBeNull()
    wrapper.unmount()
  })

  it('renders nothing when the binding is false', () => {
    const wrapper = mountHost(false)
    expect(wrapper.find('.bili-loading-wrapper').exists()).toBe(false)
    wrapper.unmount()
  })

  it('updates the overlay text when options change', async () => {
    const text = ref('第一次')
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            withDirectives(h('div', { class: 'loading-host' }, '内容'), [
              [vLoading, { text: text.value }]
            ])
        }
      }),
      { attachTo: document.body }
    )

    text.value = '第二次'
    await nextTick()

    expect(wrapper.find('.loading-host').element.querySelector('.bili-loading__text')?.textContent).toBe(
      '第二次'
    )
    wrapper.unmount()
  })
})
