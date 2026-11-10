import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Tabs from '../tabs.vue'
import TabPane from '../tab-pane.vue'

const mountTabs = (props: Record<string, any> = {}, options: Record<string, any> = {}) =>
  mount(Tabs, {
    props: { modelValue: 'a', ...props },
    slots: {
      default: () => [
        h(TabPane, { name: 'a', label: '标签一' }, () => '内容一'),
        h(TabPane, { name: 'b', label: '标签二' }, () => '内容二'),
        h(TabPane, { name: 'c', label: '标签三', disabled: true }, () => '内容三')
      ]
    },
    ...options
  })

describe('BiliTabs', () => {
  it('renders one tab per pane and marks the active one', async () => {
    const wrapper = mountTabs()
    await nextTick()

    const tabs = wrapper.findAll('.bili-tabs__tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0].classes()).toContain('is-active')
    expect(tabs[2].classes()).toContain('is-disabled')
    expect(tabs[0].attributes('aria-selected')).toBe('true')
  })

  it('emits update:modelValue when another tab is clicked', async () => {
    const wrapper = mountTabs()
    await nextTick()

    await wrapper.findAll('.bili-tabs__tab')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
    expect(wrapper.emitted('tab-change')).toBeUndefined()
  })

  it('ignores clicks on disabled tabs', async () => {
    const wrapper = mountTabs()
    await nextTick()

    await wrapper.findAll('.bili-tabs__tab')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('switches the visible panel', async () => {
    const wrapper = mountTabs()
    await nextTick()

    const panels = wrapper.findAll('.bili-tab-pane')
    expect(panels[0].attributes('style') ?? '').not.toContain('display: none')
    expect(panels[1].attributes('style') ?? '').toContain('display: none')

    await wrapper.setProps({ modelValue: 'b' })
    await nextTick()

    const next = wrapper.findAll('.bili-tab-pane')
    expect(next[0].attributes('style') ?? '').toContain('display: none')
    expect(next[1].attributes('style') ?? '').not.toContain('display: none')
  })

  it('auto-selects the first enabled pane when unbound', async () => {
    const wrapper = mount(Tabs, {
      slots: {
        default: () => [
          h(TabPane, { name: 'x', label: '禁用', disabled: true }, () => 'x'),
          h(TabPane, { name: 'y', label: '可用' }, () => 'y')
        ]
      }
    })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['y'])
  })

  it('only mounts visited panes when lazy', async () => {
    const wrapper = mountTabs({ lazy: true })
    await nextTick()

    expect(wrapper.findAll('.bili-tab-pane')).toHaveLength(1)

    await wrapper.setProps({ modelValue: 'b' })
    expect(wrapper.findAll('.bili-tab-pane')).toHaveLength(2)
  })

  it('closes a closable tab and emits tab-remove', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'a', closable: true },
      slots: {
        default: () => [
          h(TabPane, { name: 'a', label: '标签一', closable: true }, () => '一'),
          h(TabPane, { name: 'b', label: '标签二' }, () => '二')
        ]
      }
    })
    await nextTick()

    const close = wrapper.findAll('.bili-tabs__close')
    expect(close).toHaveLength(1)
    await close[0].trigger('click')

    expect(wrapper.emitted('tab-remove')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports keyboard navigation', async () => {
    const wrapper = mountTabs()
    await nextTick()

    const first = wrapper.findAll('.bili-tabs__tab')[0]
    await first.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])

    await wrapper.setProps({ modelValue: 'b' })
    await wrapper.findAll('.bili-tabs__tab')[1].trigger('keydown', { key: 'End' })
    // `c` is disabled, so End lands on the last enabled tab.
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
  })

  it('applies the type and direction modifiers', async () => {
    const wrapper = mountTabs({ type: 'card', direction: 'vertical', stretch: true })
    await nextTick()

    expect(wrapper.classes()).toContain('bili-tabs--card')
    expect(wrapper.classes()).toContain('bili-tabs--vertical')
    expect(wrapper.classes()).toContain('is-stretch')
  })

  it('positions the underline indicator for the active tab', async () => {
    const wrapper = mountTabs()
    await nextTick()
    await nextTick()

    const indicator = wrapper.find('.bili-tabs__indicator')
    expect(indicator.exists()).toBe(true)
    expect(indicator.attributes('style')).toContain('transform')
  })

  it('hides the indicator for card and segment types', async () => {
    const card = mountTabs({ type: 'card' })
    await nextTick()
    await nextTick()
    expect(card.find('.bili-tabs__indicator').exists()).toBe(false)

    const segment = mountTabs({ type: 'segment' })
    await nextTick()
    await nextTick()
    expect(segment.find('.bili-tabs__indicator').exists()).toBe(false)
  })

  it('renders the extra slot', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [h(TabPane, { name: 'a', label: '标签' }, () => '内容')],
        extra: () => h('button', { class: 'extra-action' }, '更多')
      }
    })
    await nextTick()

    expect(wrapper.find('.bili-tabs__extra .extra-action').text()).toBe('更多')
  })
})
