import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Empty from '../empty.vue'

describe('BiliEmpty', () => {
  it('renders the default preset and description', () => {
    const wrapper = mount(Empty)

    expect(wrapper.classes()).toContain('bili-empty--default')
    expect(wrapper.find('.bili-empty__svg').exists()).toBe(true)
    expect(wrapper.find('.bili-empty__description').text()).toBe('暂无数据')
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('switches illustrations by preset', () => {
    const search = mount(Empty, { props: { preset: 'search' } })
    expect(search.classes()).toContain('bili-empty--search')
    expect(search.find('.bili-empty__svg').html()).toContain('circle')

    const simple = mount(Empty, { props: { preset: 'simple', description: '搜索为空' } })
    expect(simple.find('.bili-empty__description').text()).toBe('搜索为空')
  })

  it('supports a custom image slot', () => {
    const wrapper = mount(Empty, {
      slots: { image: '<img class="custom-image" src="/empty.png" alt="" />' }
    })
    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('.bili-empty__svg').exists()).toBe(false)
  })

  it('renders description and footer slots', () => {
    const wrapper = mount(Empty, {
      slots: {
        description: '<span class="desc">没有数据</span>',
        default: '<button class="action">新建</button>'
      }
    })

    expect(wrapper.find('.desc').text()).toBe('没有数据')
    expect(wrapper.find('.bili-empty__footer .action').text()).toBe('新建')
  })

  it('applies the small modifier', () => {
    expect(mount(Empty, { props: { small: true } }).classes()).toContain('is-small')
  })

  it('omits the footer when no action slot is provided', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find('.bili-empty__footer').exists()).toBe(false)
  })
})
