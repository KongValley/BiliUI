import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Breadcrumb from '../breadcrumb.vue'
import BreadcrumbItem from '../breadcrumb-item.vue'

const mountCrumbs = (props: Record<string, any> = {}, count = 3) =>
  mount(Breadcrumb, {
    props,
    slots: {
      default: () =>
        Array.from({ length: count }, (_, index) =>
          h(
            BreadcrumbItem,
            { href: index < count - 1 ? `/page-${index}` : undefined },
            () => `页面 ${index + 1}`
          )
        )
    }
  })

describe('BiliBreadcrumb', () => {
  it('renders every item with separators', async () => {
    const wrapper = mountCrumbs()
    await nextTick()

    expect(wrapper.findAll('.bili-breadcrumb-item')).toHaveLength(3)
    expect(wrapper.findAll('.bili-breadcrumb-item__separator')).toHaveLength(2)
    expect(wrapper.find('nav').attributes('aria-label')).toBe('面包屑')
  })

  it('marks the last item as current and not a link', async () => {
    const wrapper = mountCrumbs()
    await nextTick()

    const items = wrapper.findAll('.bili-breadcrumb-item')
    expect(items[2].classes()).toContain('is-last')
    expect(items[2].find('.is-current').attributes('aria-current')).toBe('page')
    expect(items[2].find('a').exists()).toBe(false)
    expect(items[0].find('a').attributes('href')).toBe('/page-0')
  })

  it('supports a custom separator', async () => {
    const wrapper = mountCrumbs({ separator: '>' })
    await nextTick()

    expect(wrapper.find('.bili-breadcrumb-item__separator').text()).toBe('>')
  })

  it('supports a separator slot on items', async () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: () => [
          h(BreadcrumbItem, null, {
            default: () => '首页',
            separator: () => h('span', { class: 'custom-sep' }, '→')
          }),
          h(BreadcrumbItem, null, () => '详情')
        ]
      }
    })
    await nextTick()

    expect(wrapper.find('.custom-sep').text()).toBe('→')
  })

  it('collapses middle items when maxItems is exceeded', async () => {
    const wrapper = mountCrumbs({ maxItems: 2 }, 5)
    // Items register in `onMounted`, so the collapse state needs one more tick.
    await nextTick()
    await nextTick()

    const items = wrapper.findAll('.bili-breadcrumb-item')
    const hidden = (index: number) =>
      (items[index].attributes('style') ?? '').includes('display: none')

    expect(hidden(0)).toBe(false)
    expect(hidden(2)).toBe(true)
    expect(hidden(4)).toBe(false)
    expect(wrapper.find('.bili-breadcrumb-item__ellipsis').text()).toBe('…')
  })

  it('keeps all items when maxItems is not set', async () => {
    const wrapper = mountCrumbs({}, 5)
    await nextTick()

    expect(wrapper.findAll('.bili-breadcrumb-item')).toHaveLength(5)
    expect(wrapper.find('.bili-breadcrumb-item__ellipsis').exists()).toBe(false)
  })

  it('emits click for link items only', async () => {
    const wrapper = mountCrumbs()
    await nextTick()

    const links = wrapper.findAll('a')
    await links[0].trigger('click')

    expect(wrapper.findAllComponents(BreadcrumbItem)[0].emitted('click')).toHaveLength(1)
  })
})
