import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Tabs from '../tabs.vue'
import TabPane from '../tab-pane.vue'

const mountTabs = (props: Record<string, unknown> = {}) =>
  mount(Tabs, {
    props: { modelValue: 'a', ...props },
    slots: {
      default: () => [h(TabPane, { name: 'a', label: 'A' }, () => 'A content')]
    }
  })

describe('BiliTabs addable', () => {
  it('renders the add button only when addable', () => {
    expect(mountTabs().find('.bili-tabs__add').exists()).toBe(false)
    expect(mountTabs({ addable: true }).find('.bili-tabs__add').exists()).toBe(true)
  })

  it('emits add when clicked', async () => {
    const wrapper = mountTabs({ addable: true })
    await wrapper.find('.bili-tabs__add').trigger('click')

    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.find('.bili-tabs__add').attributes('aria-label')).toBe('新建标签')
  })
})
