import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Descriptions from '../descriptions.vue'
import DescriptionsItem from '../descriptions-item.vue'

const mountDesc = (props: Record<string, any> = {}) =>
  mount(Descriptions, {
    props,
    slots: {
      default: () => [
        h(DescriptionsItem, { label: '姓名' }, () => '张三'),
        h(DescriptionsItem, { label: '年龄' }, () => '28'),
        h(DescriptionsItem, { label: '地址', span: 2 }, () => '上海市'),
        h(DescriptionsItem, { label: '备注' }, () => '无')
      ]
    }
  })

describe('BiliDescriptions', () => {
  it('renders items with labels and values', async () => {
    const wrapper = mountDesc()
    await nextTick()

    const items = wrapper.findAll('.bili-descriptions-item')
    expect(items).toHaveLength(4)
    expect(items[0].find('.bili-descriptions-item__label').text()).toBe('姓名')
    expect(items[0].find('.bili-descriptions-item__content').text()).toBe('张三')
  })

  it('applies column count as a CSS variable', async () => {
    const wrapper = mountDesc({ column: 4 })
    await nextTick()

    expect(wrapper.attributes('style')).toContain('--bili-descriptions-columns: 4')
  })

  it('resolves auto columns from the item count', async () => {
    const wrapper = mountDesc({ column: 'auto' })
    await nextTick()
    await nextTick()

    expect(wrapper.attributes('style')).toContain('--bili-descriptions-columns: 4')
  })

  it('clamps the span to the column count', async () => {
    const wrapper = mountDesc({ column: 2 })
    await nextTick()

    const spanned = wrapper.findAll('.bili-descriptions-item')[2]
    expect(spanned.attributes('style')).toContain('grid-column: span 2')
  })

  it('applies bordered and vertical modifiers', async () => {
    const wrapper = mountDesc({ bordered: true, direction: 'vertical' })
    await nextTick()

    expect(wrapper.classes()).toContain('is-bordered')
    expect(wrapper.classes()).toContain('bili-descriptions--vertical')
    expect(wrapper.findAll('.bili-descriptions-item')[0].classes()).toContain('is-bordered')
  })

  it('renders the title, extra and label slots', async () => {
    const wrapper = mount(Descriptions, {
      props: { title: '用户信息' },
      slots: {
        extra: () => h('button', { class: 'extra-btn' }, '编辑'),
        default: () =>
          h(DescriptionsItem, null, {
            label: () => h('span', { class: 'custom-label' }, '自定义标签'),
            default: () => '值'
          })
      }
    })
    await nextTick()

    expect(wrapper.find('.bili-descriptions__title').text()).toBe('用户信息')
    expect(wrapper.find('.extra-btn').text()).toBe('编辑')
    expect(wrapper.find('.custom-label').text()).toBe('自定义标签')
  })

  it('supports a custom label width', async () => {
    const wrapper = mountDesc({ labelWidth: 120 })
    await nextTick()

    expect(
      wrapper.findAll('.bili-descriptions-item__label')[0].attributes('style')
    ).toContain('width: 120px')
  })
})
