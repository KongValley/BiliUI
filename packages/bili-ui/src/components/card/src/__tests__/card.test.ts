import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Card from '../card.vue'

describe('BiliCard', () => {
  it('renders the default slot in the body', () => {
    const wrapper = mount(Card, { slots: { default: '卡片内容' } })
    expect(wrapper.find('.bili-card__body').text()).toBe('卡片内容')
  })

  it('renders a header from the title prop', () => {
    const wrapper = mount(Card, { props: { title: '标题' } })
    expect(wrapper.find('.bili-card__header').exists()).toBe(true)
    expect(wrapper.find('.bili-card__title').text()).toBe('标题')
  })

  it('renders the extra slot next to the title', () => {
    const wrapper = mount(Card, {
      props: { title: '标题' },
      slots: { extra: () => h('a', { class: 'more' }, '更多') }
    })
    expect(wrapper.find('.bili-card__extra .more').text()).toBe('更多')
  })

  it('omits the header when no title or header slot is given', () => {
    const wrapper = mount(Card, { slots: { default: '内容' } })
    expect(wrapper.find('.bili-card__header').exists()).toBe(false)
  })

  it('renders cover and footer slots', () => {
    const wrapper = mount(Card, {
      slots: {
        cover: () => h('img', { src: '/a.png', alt: 'cover' }),
        default: '内容',
        footer: '底部'
      }
    })
    expect(wrapper.find('.bili-card__cover img').attributes('src')).toBe('/a.png')
    expect(wrapper.find('.bili-card__footer').text()).toBe('底部')
  })

  it('applies size, shadow and border modifiers', () => {
    const wrapper = mount(Card, {
      props: { size: 'lg', shadow: 'never', bordered: false }
    })
    const classes = wrapper.classes()
    expect(classes).toContain('bili-card--lg')
    expect(classes).toContain('bili-card--shadow-never')
    expect(classes).not.toContain('is-bordered')
  })

  it('adds the hoverable and flush classes', () => {
    const wrapper = mount(Card, { props: { hoverable: true, bodyFlush: true } })
    expect(wrapper.classes()).toContain('is-hoverable')
    expect(wrapper.find('.bili-card__body').classes()).toContain('is-flush')
  })

  it('shows a loading mask with default text', () => {
    const wrapper = mount(Card, { props: { loading: true } })
    const loading = wrapper.find('.bili-card__loading')
    expect(loading.exists()).toBe(true)
    expect(loading.text()).toContain('加载中')
    expect(wrapper.find('.bili-card__spinner').exists()).toBe(true)
    expect(wrapper.classes()).toContain('is-loading')
  })

  it('supports a custom loading slot', () => {
    const wrapper = mount(Card, {
      props: { loading: true },
      slots: { loading: '同步中' }
    })
    expect(wrapper.find('.bili-card__loading').text()).toContain('同步中')
  })

  it('emits click events', async () => {
    const wrapper = mount(Card)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
