/* eslint-disable vue/one-component-per-file */
import { afterEach, describe, expect, it } from 'vitest'
import { config, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import BiliApp from '../app.vue'
import { useApp, type AppContext } from '../use-app'
import BiliConfigProvider from '../../../config-provider/src/config-provider.vue'
import { __resetMessages } from '../../../message/src/method'
import { __resetNotifications } from '../../../notification/src/method'
import { __resetMessageBoxes } from '../../../message-box/src/method'
import {
  enUSLocale,
  setGlobalConfigNamespace,
  setGlobalLocale,
  zhCNLocale
} from '../../../../hooks/use-config'
import { setGlobalNamespace } from '../../../../hooks/use-namespace'

// The service components rely on real leave transitions in some hosts; jsdom
// reports no transition duration, so the stubbed transition is enough here.
config.global.stubs = { transition: false }

let captured: AppContext | null = null
const Consumer = defineComponent({
  setup() {
    captured = useApp()
    return () => h('span', { class: 'consumer' }, 'consumer')
  }
})

const resetGlobals = () => {
  setGlobalLocale(zhCNLocale)
  setGlobalNamespace('bili')
  setGlobalConfigNamespace('bili')
}

afterEach(async () => {
  __resetMessages()
  __resetNotifications()
  __resetMessageBoxes()
  await flushPromises()
  document.body.innerHTML = ''
  captured = null
  resetGlobals()
})

const findText = (selector: string, text: string) =>
  Array.from(document.body.querySelectorAll<HTMLElement>(selector)).find(node =>
    node.textContent?.includes(text)
  ) ?? null

describe('BiliApp', () => {
  it('renders a wrapper and its slot content', () => {
    const wrapper = mount(BiliApp, { slots: { default: '<span class="content">页面</span>' } })
    expect(wrapper.classes()).toContain('bili-app')
    expect(wrapper.find('.content').text()).toBe('页面')
  })

  it('supports a custom wrapper element', () => {
    const wrapper = mount(BiliApp, { props: { component: 'main' } })
    expect(wrapper.element.tagName).toBe('MAIN')
  })

  it('provides context-bound services through useApp', () => {
    mount(BiliApp, { slots: { default: () => h(Consumer) } })
    expect(captured).not.toBeNull()
    expect(typeof captured?.message).toBe('function')
    expect(typeof captured?.notification).toBe('function')
    expect(typeof captured?.messageBox.confirm).toBe('function')
  })

  it('merges message defaults configured on the App', () => {
    mount(BiliApp, {
      props: { message: { duration: 0, showClose: true } },
      slots: { default: () => h(Consumer) }
    })

    captured?.message.success('保存成功')
    const message = findText('.bili-message', '保存成功')
    expect(message).not.toBeNull()
    expect(message?.querySelector('.bili-message__close')).not.toBeNull()
  })

  it('uses the nearest ConfigProvider locale for message boxes', () => {
    mount(BiliConfigProvider, {
      props: { locale: enUSLocale },
      slots: {
        default: () => h(BiliApp, null, { default: () => h(Consumer) })
      }
    })

    const promise = captured?.messageBox.alert('Saved')
    promise?.catch(() => undefined)

    const confirm = findText('.bili-button', 'Confirm')
    expect(confirm).not.toBeNull()
  })

  it('scopes closeAll to the owning App', async () => {
    const apis: { first?: AppContext; second?: AppContext } = {}

    const First = defineComponent({
      setup() {
        apis.first = useApp()
        return () => h('i', { class: 'first' })
      }
    })
    const Second = defineComponent({
      setup() {
        apis.second = useApp()
        return () => h('i', { class: 'second' })
      }
    })

    mount({
      components: { BiliApp, First, Second },
      render: () =>
        h('div', [
          h(BiliApp, null, { default: () => h(First) }),
          h(BiliApp, null, { default: () => h(Second) })
        ])
    })

    apis.first?.message({ message: 'first', duration: 0 })
    apis.second?.message({ message: 'second', duration: 0 })
    apis.first?.message.closeAll()
    await nextTick()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 160))

    expect(findText('.bili-message', 'first')).toBeNull()
    expect(findText('.bili-message', 'second')).not.toBeNull()
  })

  it('closes its services when unmounted', async () => {
    const wrapper = mount(BiliApp, { slots: { default: () => h(Consumer) } })
    captured?.message({ message: 'lifecycle', duration: 0 })
    expect(findText('.bili-message', 'lifecycle')).not.toBeNull()

    wrapper.unmount()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 160))

    expect(findText('.bili-message', 'lifecycle')).toBeNull()
  })

  it('falls back to the global services outside an App', () => {
    const Standalone = defineComponent({
      setup() {
        captured = useApp()
        return () => h('span')
      }
    })
    mount(Standalone)
    captured?.message({ message: 'global', duration: 0 })
    expect(findText('.bili-message', 'global')).not.toBeNull()
  })
})
