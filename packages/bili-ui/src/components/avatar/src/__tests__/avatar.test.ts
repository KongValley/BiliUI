import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from '../avatar.vue'

describe('BiliAvatar', () => {
  it('renders the image when src is provided', () => {
    const wrapper = mount(Avatar, { props: { src: '/avatar.svg', alt: '用户头像' } })

    expect(wrapper.find('img').attributes('src')).toBe('/avatar.svg')
    expect(wrapper.find('img').attributes('alt')).toBe('用户头像')
    expect(wrapper.attributes('aria-label')).toBe('用户头像')
  })

  it('falls back to initials when the image fails to load', async () => {
    const wrapper = mount(Avatar, {
      props: { src: '/missing.png', name: 'John Doe' }
    })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('JD')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('derives initials for latin and CJK names', () => {
    expect(mount(Avatar, { props: { name: 'Ada Lovelace' } }).text()).toBe('AL')
    expect(mount(Avatar, { props: { name: '张三' } }).text()).toBe('张三')
    expect(mount(Avatar, { props: { name: '王小明' } }).text()).toBe('小明')
  })

  it('renders the icon fallback', () => {
    const wrapper = mount(Avatar, { props: { icon: 'user' } })

    expect(wrapper.find('.bili-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.bili-avatar__text').exists()).toBe(false)
  })

  it('supports the default slot fallback', () => {
    const wrapper = mount(Avatar, {
      props: { name: '忽略' },
      slots: { default: '<em class="custom">CEO</em>' }
    })

    expect(wrapper.find('.custom').text()).toBe('CEO')
    expect(wrapper.find('.bili-avatar__text').exists()).toBe(false)
  })

  it('applies numeric size, shape and subtitle hue', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Bili', size: 48, shape: 'square' }
    })

    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('width: 48px')
    expect(style).toContain('height: 48px')
    expect(style).toContain('--bili-avatar-hue')
    expect(wrapper.classes()).toContain('bili-avatar--square')
    expect(wrapper.classes()).toContain('is-text')
  })

  it('maps sm / md / lg sizes', () => {
    expect(mount(Avatar, { props: { name: 'A', size: 'sm' } }).attributes('style')).toContain(
      'width: 24px'
    )
    expect(mount(Avatar, { props: { name: 'A', size: 'lg' } }).attributes('style')).toContain(
      'width: 40px'
    )
  })

  it('resets the failed state when src changes', async () => {
    const wrapper = mount(Avatar, { props: { src: '/a.png', name: 'A' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)

    await wrapper.setProps({ src: '/b.png' })
    expect(wrapper.find('img').attributes('src')).toBe('/b.png')
  })
})
