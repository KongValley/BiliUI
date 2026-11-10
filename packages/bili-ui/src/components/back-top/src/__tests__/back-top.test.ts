import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BackTop from '../back-top.vue'

const createTarget = () => {
  const target = document.createElement('div')
  Object.defineProperty(target, 'scrollHeight', { configurable: true, value: 1000 })
  Object.defineProperty(target, 'clientHeight', { configurable: true, value: 300 })
  document.body.appendChild(target)
  return target
}

const mountBackTop = (props: Record<string, unknown> = {}) => {
  const target = createTarget()
  const wrapper = mount(BackTop, {
    attachTo: document.body,
    props: { target, duration: 0, ...props }
  })
  return { target, wrapper }
}

const scrollTo = async (target: HTMLElement, top: number) => {
  target.scrollTop = top
  target.dispatchEvent(new Event('scroll'))
  await new Promise(resolve => setTimeout(resolve, 30))
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliBackTop', () => {
  it('appears after the visibility threshold', async () => {
    const { target, wrapper } = mountBackTop()
    await nextTick()
    expect(wrapper.find('.bili-back-top').exists()).toBe(false)

    await scrollTo(target, 300)
    expect(wrapper.find('.bili-back-top').exists()).toBe(true)
  })

  it('respects visibility-height', async () => {
    const { target, wrapper } = mountBackTop({ visibilityHeight: 100 })
    await nextTick()

    await scrollTo(target, 80)
    expect(wrapper.find('.bili-back-top').exists()).toBe(false)

    await scrollTo(target, 150)
    expect(wrapper.find('.bili-back-top').exists()).toBe(true)
  })

  it('scrolls the target to the top and emits click', async () => {
    const { target, wrapper } = mountBackTop()
    await nextTick()
    await scrollTo(target, 250)

    await wrapper.find('.bili-back-top').trigger('click')
    await nextTick()

    expect(target.scrollTop).toBe(0)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies position styles and a custom slot', async () => {
    const { target, wrapper } = mountBackTop({ right: 24, bottom: '32px', zIndex: 50 })
    await nextTick()
    await scrollTo(target, 300)

    const button = wrapper.find('.bili-back-top')
    expect(button.attributes('style')).toContain('--bili-back-top-right: 24px')
    expect(button.attributes('style')).toContain('--bili-back-top-bottom: 32px')
    expect(button.attributes('style')).toContain('--bili-back-top-z-index: 50')
    expect(button.find('.bili-icon').exists()).toBe(true)
  })

  it('supports a selector target and updates when the target changes', async () => {
    const first = createTarget()
    first.id = 'back-top-target'
    const second = createTarget()
    const wrapper = mount(BackTop, {
      attachTo: document.body,
      props: { target: '#back-top-target', duration: 0 }
    })
    await nextTick()

    await scrollTo(first, 300)
    expect(wrapper.find('.bili-back-top').exists()).toBe(true)

    await wrapper.setProps({ target: second })
    await nextTick()
    expect(wrapper.find('.bili-back-top').exists()).toBe(false)
  })

  it('renders custom slot content', async () => {
    const { target, wrapper } = mountBackTop()
    await wrapper.setProps({ duration: 0 })
    await nextTick()
    await scrollTo(target, 300)
    expect(wrapper.find('.bili-back-top svg').exists()).toBe(true)
  })
})
