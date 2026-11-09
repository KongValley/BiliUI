import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Tooltip from '../tooltip.vue'
import Loading from '../../../loading/src/loading.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliTooltip', () => {
  it('shows content on hover', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示内容', delay: 0 },
      slots: { default: '<button>hover</button>' },
      attachTo: document.body
    })

    await wrapper.find('.bili-tooltip__trigger').trigger('mouseenter')
    await nextTick()
    await flushPromises()

    const content = document.body.querySelector('.bili-tooltip__content')
    expect(content).not.toBeNull()
    expect(content?.textContent).toContain('提示内容')
  })

  it('does not render content when disabled', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示内容', delay: 0, disabled: true },
      slots: { default: '<button>hover</button>' },
      attachTo: document.body
    })

    await wrapper.find('.bili-tooltip__trigger').trigger('mouseenter')
    await flushPromises()

    expect(document.body.querySelector('.bili-tooltip__content')).toBeNull()
  })
})

describe('BiliLoading', () => {
  it('renders a spinner and text', () => {
    const wrapper = mount(Loading, { props: { text: '加载中' } })
    expect(wrapper.find('.bili-loading__spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('加载中')
  })

  it('teleports to body in fullscreen mode', async () => {
    mount(Loading, { props: { fullscreen: true, text: '全屏加载' }, attachTo: document.body })
    await nextTick()
    expect(document.body.querySelector('.bili-loading.is-fullscreen')).not.toBeNull()
  })
})
