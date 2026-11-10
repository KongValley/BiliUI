import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Timeline from '../timeline.vue'
import TimelineItem from '../timeline-item.vue'

const mountTimeline = (props: Record<string, unknown> = {}) =>
  mount(Timeline, {
    props,
    slots: {
      default: () => [
        h(TimelineItem, { timestamp: '2026-11-01 09:00' }, () => '创建项目'),
        h(TimelineItem, { timestamp: '2026-11-05 14:30' }, () => '完成设计')
      ]
    }
  })

describe('BiliTimeline', () => {
  it('renders items with timestamps and content', () => {
    const wrapper = mountTimeline()
    const items = wrapper.findAll('.bili-timeline-item')

    expect(items).toHaveLength(2)
    expect(items[0].find('.bili-timeline-item__timestamp').text()).toBe('2026-11-01 09:00')
    expect(items[0].find('.bili-timeline-item__body').text()).toBe('创建项目')
  })

  it('applies semantic type, hollow and icon classes', () => {
    const wrapper = mountTimeline()
    const success = mount(Timeline, {
      slots: {
        default: () =>
          h(TimelineItem, { type: 'success', hollow: true, icon: 'check' }, () => '完成')
      }
    })

    const item = success.find('.bili-timeline-item')
    expect(item.classes()).toContain('is-type-success')
    expect(item.classes()).toContain('is-hollow')
    expect(item.classes()).toContain('is-icon')
    expect(item.find('.bili-icon').exists()).toBe(true)
    expect(wrapper.findAll('.bili-timeline-item__line')).toHaveLength(2)
  })

  it('applies a custom dot colour through a CSS variable', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: () => h(TimelineItem, { color: '#00ff00' }, () => '自定义颜色')
      }
    })

    expect(wrapper.find('.bili-timeline-item__dot').attributes('style')).toContain(
      '--bili-timeline-dot-color: #00ff00'
    )
  })

  it('supports a custom dot slot', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: () =>
          h(TimelineItem, null, {
            default: () => '内容',
            dot: () => h('span', { class: 'custom-dot' }, '◆')
          })
      }
    })

    expect(wrapper.find('.custom-dot').exists()).toBe(true)
  })

  it('adds the reverse class', () => {
    const wrapper = mountTimeline({ reverse: true })
    expect(wrapper.find('.bili-timeline').classes()).toContain('is-reverse')
  })

  it('renders a timestamp slot', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: () =>
          h(TimelineItem, null, {
            default: () => '内容',
            timestamp: () => '刚刚'
          })
      }
    })

    expect(wrapper.find('.bili-timeline-item__timestamp').text()).toBe('刚刚')
  })
})
