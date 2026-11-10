import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Collapse from '../collapse.vue'
import CollapseItem from '../collapse-item.vue'

const mountCollapse = (props: Record<string, any> = {}) =>
  mount(Collapse, {
    props,
    slots: {
      default: () => [
        h(CollapseItem, { name: 'a', title: '面板 A' }, () => h('p', { class: 'body-a' }, '内容 A')),
        h(CollapseItem, { name: 'b', title: '面板 B' }, () => h('p', { class: 'body-b' }, '内容 B')),
        h(CollapseItem, { name: 'c', title: '面板 C', disabled: true }, () => '内容 C')
      ]
    }
  })

describe('BiliCollapse', () => {
  it('renders items and opens the one bound by modelValue', async () => {
    const wrapper = mountCollapse({ modelValue: ['a'] })
    await nextTick()
    await nextTick()

    const items = wrapper.findAll('.bili-collapse-item')
    expect(items).toHaveLength(3)
    expect(items[0].classes()).toContain('is-open')
    expect(items[1].classes()).not.toContain('is-open')
  })

  it('opens on header click and emits the new value', async () => {
    const wrapper = mountCollapse({ modelValue: [] })
    await nextTick()
    await nextTick()

    await wrapper.findAll('.bili-collapse-item__header')[0].trigger('click')

    expect(wrapper.findAll('.bili-collapse-item')[0].classes()).toContain('is-open')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['a'])
  })

  it('closes an open panel', async () => {
    const wrapper = mountCollapse({ modelValue: ['a', 'b'] })
    await nextTick()
    await nextTick()

    await wrapper.findAll('.bili-collapse-item__header')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('keeps only one panel open in accordion mode', async () => {
    const wrapper = mountCollapse({ modelValue: ['a'], accordion: true })
    await nextTick()
    await nextTick()

    await wrapper.findAll('.bili-collapse-item__header')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    const items = wrapper.findAll('.bili-collapse-item')
    expect(items[0].classes()).not.toContain('is-open')
    expect(items[1].classes()).toContain('is-open')
  })

  it('ignores clicks on disabled items', async () => {
    const wrapper = mountCollapse({ modelValue: [] })
    await nextTick()
    await nextTick()

    await wrapper.findAll('.bili-collapse-item__header')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('toggles with the keyboard', async () => {
    const wrapper = mountCollapse({ modelValue: [] })
    await nextTick()
    await nextTick()

    await wrapper.findAll('.bili-collapse-item__header')[0].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('applies the bordered modifier', async () => {
    const bordered = mountCollapse({ bordered: true })
    await nextTick()
    expect(bordered.classes()).toContain('is-bordered')

    const plain = mountCollapse({ bordered: false })
    await nextTick()
    expect(plain.classes()).not.toContain('is-bordered')
  })

  it('renders the title slot', async () => {
    const wrapper = mount(Collapse, {
      props: { modelValue: [] },
      slots: {
        default: () =>
          h(CollapseItem, { name: 'a' }, {
            title: () => h('span', { class: 'custom-title' }, '标题'),
            default: () => '内容'
          })
      }
    })
    await nextTick()

    expect(wrapper.find('.custom-title').text()).toBe('标题')
  })
})
