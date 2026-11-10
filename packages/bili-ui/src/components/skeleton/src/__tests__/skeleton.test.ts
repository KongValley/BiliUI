import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from '../skeleton.vue'
import SkeletonItem from '../skeleton-item.vue'

describe('BiliSkeleton', () => {
  it('renders the configured number of rows plus a title', () => {
    const wrapper = mount(Skeleton, { props: { rows: 4 } })

    expect(wrapper.findAll('.bili-skeleton-item--text')).toHaveLength(5)
    expect(wrapper.find('.bili-skeleton__title').exists()).toBe(true)
  })

  it('omits the title when disabled', () => {
    const wrapper = mount(Skeleton, { props: { rows: 2, title: false } })
    expect(wrapper.find('.bili-skeleton__title').exists()).toBe(false)
    expect(wrapper.findAll('.bili-skeleton-item--text')).toHaveLength(2)
  })

  it('renders the avatar header', () => {
    const wrapper = mount(Skeleton, { props: { avatar: true, rows: 2 } })
    expect(wrapper.find('.bili-skeleton__header').exists()).toBe(true)
    expect(wrapper.find('.bili-skeleton-item--circle').exists()).toBe(true)
  })

  it('applies the animated modifier', () => {
    const wrapper = mount(Skeleton, { props: { animated: true } })
    expect(wrapper.classes()).toContain('is-animated')
  })

  it('renders the slot instead of the placeholder when not loading', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: '<p class="real-content">真实内容</p>' }
    })

    expect(wrapper.find('.bili-skeleton').exists()).toBe(false)
    expect(wrapper.find('.real-content').text()).toBe('真实内容')
  })

  it('supports a custom template slot', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: true },
      slots: { template: '<div class="custom-skeleton" />' }
    })

    expect(wrapper.find('.custom-skeleton').exists()).toBe(true)
  })
})

describe('BiliSkeletonItem', () => {
  it('applies variant classes and dimensions', () => {
    const wrapper = mount(SkeletonItem, {
      props: { variant: 'image', width: 200, height: 90 }
    })

    expect(wrapper.classes()).toContain('bili-skeleton-item--image')
    expect(wrapper.attributes('style')).toContain('width: 200px')
    expect(wrapper.attributes('style')).toContain('height: 90px')
  })

  it('uses size for square shapes', () => {
    const wrapper = mount(SkeletonItem, { props: { variant: 'circle', size: 32 } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('width: 32px')
    expect(style).toContain('height: 32px')
  })

  it('is hidden from assistive technology', () => {
    expect(mount(SkeletonItem).attributes('aria-hidden')).toBe('true')
  })
})
