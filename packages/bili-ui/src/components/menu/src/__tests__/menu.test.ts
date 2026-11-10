import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Menu from '../menu.vue'
import MenuItem from '../menu-item.vue'
import SubMenu from '../sub-menu.vue'

const items = [
  { key: 'home', label: '概览', icon: 'home' },
  {
    key: 'project',
    label: '项目',
    icon: 'grid',
    children: [
      { key: 'p1', label: '全部项目' },
      { key: 'p2', label: '我的项目' }
    ]
  },
  { key: 'settings', label: '设置', icon: 'settings' }
]

describe('BiliMenu', () => {
  it('renders items from the items prop', () => {
    const wrapper = mount(Menu, { props: { items } })
    const labels = wrapper.findAll('.bili-menu-item__label').map(n => n.text())
    expect(labels).toEqual(['概览', '设置'])
    expect(wrapper.find('.bili-sub-menu').exists()).toBe(true)
  })

  it('emits select and updates modelValue', async () => {
    const wrapper = mount(Menu, { props: { items, modelValue: '' } })
    const first = wrapper.find('.bili-menu-item__inner')
    await first.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['home'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('home')
  })

  it('marks the active item', async () => {
    const wrapper = mount(Menu, { props: { items, modelValue: 'home' } })
    expect(wrapper.find('.bili-menu-item__inner').classes()).toContain('is-active')
  })

  it('does not select a disabled item', async () => {
    const wrapper = mount(Menu, {
      props: { items: [{ key: 'a', label: 'A', disabled: true }] }
    })
    await wrapper.find('.bili-menu-item__inner').trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('supports the slot based API', () => {
    const wrapper = mount(Menu, {
      props: { mode: 'vertical' },
      slots: {
        default: () => [
          h(MenuItem, { itemKey: 'one', label: '一', icon: 'home' }),
          h(SubMenu, { subKey: 'sub', title: '子菜单' }, () =>
            h(MenuItem, { itemKey: 'two', label: '二' })
          )
        ]
      }
    })
    expect(wrapper.findAll('.bili-menu-item')).toHaveLength(2)
    expect(wrapper.text()).toContain('子菜单')
  })

  it('opens a vertical inline sub menu on click', async () => {
    const wrapper = mount(Menu, {
      props: { mode: 'vertical' },
      slots: {
        default: () =>
          h(SubMenu, { subKey: 'sub', title: '分组' }, () =>
            h(MenuItem, { itemKey: 'child', label: '子项' })
          )
      }
    })

    const inlineDisplay = () =>
      (wrapper.find('.bili-sub-menu__inline').element as HTMLElement).style.display
    // The inline list is mounted up-front and toggled with v-show.
    expect(inlineDisplay()).toBe('none')

    await wrapper.find('.bili-sub-menu__title').trigger('click')
    await nextTick()

    expect(inlineDisplay()).not.toBe('none')
    expect(wrapper.emitted('open-change')?.[0]).toEqual([['sub']])
  })

  it('opens default sub menus', () => {
    const wrapper = mount(Menu, {
      props: { mode: 'vertical', defaultOpenedKeys: ['sub'] },
      slots: {
        default: () =>
          h(SubMenu, { subKey: 'sub', title: '分组' }, () =>
            h(MenuItem, { itemKey: 'child', label: '子项' })
          )
      }
    })
    const element = wrapper.find('.bili-sub-menu__inline').element as HTMLElement
    expect(element.style.display).not.toBe('none')
  })

  it('hides labels in collapsed vertical mode', () => {
    const wrapper = mount(Menu, {
      props: { mode: 'vertical', collapsed: true, collapsedWidth: 64, items }
    })
    expect(wrapper.find('.bili-menu').classes()).toContain('is-collapsed')
    expect(wrapper.find('.bili-menu-item__label').exists()).toBe(false)
    const nav = wrapper.find('.bili-menu')
    expect(nav.attributes('style')).toContain('width: 64px')
  })

  it('does not collapse in horizontal mode', () => {
    const wrapper = mount(Menu, {
      props: { mode: 'horizontal', collapsed: true, items }
    })
    expect(wrapper.find('.bili-menu').classes()).not.toContain('is-collapsed')
  })

  it('floats sub menus instead of expanding inline when collapsed', async () => {
    const wrapper = mount(Menu, {
      props: { mode: 'vertical', collapsed: true, popperClass: 'custom-menu-popup' },
      slots: {
        default: () =>
          h(SubMenu, { subKey: 'sub', title: '分组' }, () =>
            h(MenuItem, { itemKey: 'child', label: '子项' })
          )
      },
      attachTo: document.body
    })

    // No inline list in collapsed mode.
    expect(wrapper.find('.bili-sub-menu__inline').exists()).toBe(false)

    await wrapper.find('.bili-sub-menu__title').trigger('mouseenter')
    await nextTick()

    const popup = document.body.querySelector('.bili-sub-menu__popup')
    expect(popup).not.toBeNull()
    expect(popup?.classList.contains('custom-menu-popup')).toBe(true)
    expect(popup?.textContent).toContain('子项')
    expect(wrapper.find('.bili-sub-menu').classes()).toContain('is-open')
  })

  it('does not overflow-collapse when overflow is enabled but everything fits', () => {
    const wrapper = mount(Menu, { props: { items, overflow: true } })
    // jsdom reports zero widths, so no item should be pushed into "more".
    expect(wrapper.find('.bili-menu__more').exists()).toBe(false)
  })

  it('keeps all items visible when overflow is disabled', () => {
    const wrapper = mount(Menu, {
      props: { items, overflow: false }
    })
    expect(wrapper.findAll('.bili-menu-item')).toHaveLength(2)
    expect(wrapper.find('.bili-menu__more').exists()).toBe(false)
  })
})
