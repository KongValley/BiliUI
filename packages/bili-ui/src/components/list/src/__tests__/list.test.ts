import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import List from '../list.vue'

const data = [
  { id: 1, name: '第一项' },
  { id: 2, name: '第二项' }
]

describe('BiliList', () => {
  it('renders data through the scoped item slot', () => {
    const wrapper = mount(List, {
      props: { data, rowKey: 'id' },
      slots: {
        default: ({ item }: { item: (typeof data)[number] }) =>
          h('span', { class: 'row' }, item.name)
      }
    })

    expect(wrapper.findAll('.bili-list__item')).toHaveLength(2)
    expect(wrapper.findAll('.row').map(row => row.text())).toEqual(['第一项', '第二项'])
  })

  it('renders default item content and header/footer text', () => {
    const wrapper = mount(List, {
      props: { data: ['A', 'B'], header: '标题', footer: '共 2 条' }
    })
    expect(wrapper.find('.bili-list__header').text()).toBe('标题')
    expect(wrapper.find('.bili-list__footer').text()).toBe('共 2 条')
    expect(wrapper.text()).toContain('A')
  })

  it('renders header and footer slots', () => {
    const wrapper = mount(List, {
      props: { data: ['A'] },
      slots: {
        header: '<strong class="custom-header">自定义头部</strong>',
        footer: '<span class="custom-footer">自定义底部</span>'
      }
    })
    expect(wrapper.find('.custom-header').exists()).toBe(true)
    expect(wrapper.find('.custom-footer').exists()).toBe(true)
  })

  it('shows the localized empty state', () => {
    const wrapper = mount(List)
    expect(wrapper.find('.bili-list__empty').exists()).toBe(true)
    expect(wrapper.find('.bili-empty__description').text()).toBe('暂无数据')
  })

  it('supports a custom empty slot', () => {
    const wrapper = mount(List, {
      slots: { empty: '<span class="custom-empty">没有记录</span>' }
    })
    expect(wrapper.find('.custom-empty').text()).toBe('没有记录')
  })

  it('applies visual modifiers and size', () => {
    const wrapper = mount(List, {
      props: { data: ['A'], bordered: true, hoverable: true, split: false, size: 'lg' }
    })
    expect(wrapper.classes()).toContain('is-bordered')
    expect(wrapper.classes()).toContain('is-hoverable')
    expect(wrapper.classes()).not.toContain('is-split')
    expect(wrapper.classes()).toContain('bili-list--lg')
  })

  it('renders a loading overlay instead of the empty state', () => {
    const wrapper = mount(List, { props: { loading: true } })
    expect(wrapper.find('.bili-list__loading').exists()).toBe(true)
    expect(wrapper.find('.bili-list__empty').exists()).toBe(false)
    expect(wrapper.find('.bili-loading__spinner').exists()).toBe(true)
  })
})
