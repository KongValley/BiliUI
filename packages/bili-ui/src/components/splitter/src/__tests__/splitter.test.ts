import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Splitter from '../splitter.vue'

const mountSplitter = (props: Record<string, unknown> = {}) =>
  mount(Splitter, {
    props: { modelValue: 40, ...props },
    slots: {
      start: '<div class="start-content">左侧</div>',
      end: '<div class="end-content">右侧</div>'
    }
  })

describe('BiliSplitter', () => {
  it('renders both panes and a percentage grid', () => {
    const wrapper = mountSplitter()
    expect(wrapper.find('.start-content').text()).toBe('左侧')
    expect(wrapper.find('.end-content').text()).toBe('右侧')
    expect(wrapper.attributes('style')).toContain('grid-template-columns: 40% 6px 1fr')
  })

  it('exposes separator ARIA values', () => {
    const divider = mountSplitter().find('.bili-splitter__divider')
    expect(divider.attributes('role')).toBe('separator')
    expect(divider.attributes('aria-orientation')).toBe('horizontal')
    expect(divider.attributes('aria-valuenow')).toBe('40')
    expect(divider.attributes('aria-valuemin')).toBe('10')
    expect(divider.attributes('aria-valuemax')).toBe('90')
  })

  it('resizes with arrow keys and clamps to bounds', async () => {
    const wrapper = mountSplitter()
    const divider = wrapper.find('.bili-splitter__divider')

    await divider.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([45])
    expect(wrapper.emitted('resize')?.[0]).toEqual([45])

    await divider.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([90])

    await divider.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([10])
  })

  it('resizes horizontally while dragging', async () => {
    const wrapper = mountSplitter()
    const root = wrapper.element as HTMLElement
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 })
    })

    const divider = wrapper.find('.bili-splitter__divider').element
    divider.dispatchEvent(new MouseEvent('pointerdown', { clientX: 80, bubbles: true }))
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 150 }))
    await nextTick()

    expect(wrapper.emitted('resize-start')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([75])
    expect(wrapper.classes()).toContain('is-dragging')

    document.dispatchEvent(new MouseEvent('pointerup'))
    await nextTick()
    expect(wrapper.emitted('resize-end')).toHaveLength(1)
    expect(wrapper.classes()).not.toContain('is-dragging')
  })

  it('ignores keyboard and pointer input when disabled', async () => {
    const wrapper = mountSplitter({ disabled: true })
    await wrapper.find('.bili-splitter__divider').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.bili-splitter__divider').attributes('tabindex')).toBe('-1')
  })

  it('supports vertical orientation', () => {
    const wrapper = mountSplitter({ direction: 'vertical' })
    expect(wrapper.classes()).toContain('bili-splitter--vertical')
    expect(wrapper.attributes('style')).toContain('grid-template-rows: 40% 6px 1fr')
    expect(wrapper.find('.bili-splitter__divider').attributes('aria-orientation')).toBe('vertical')
  })

  it('resets to the middle on double click', async () => {
    const wrapper = mountSplitter()
    await wrapper.find('.bili-splitter__divider').trigger('dblclick')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([50])
  })
})
