import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CardMeta from '../card-meta.vue'
import CardGrid from '../card-grid.vue'

describe('BiliCardMeta', () => {
  it('renders avatar, title and description', () => {
    const wrapper = mount(CardMeta, {
      props: { avatar: '/avatar.png', title: 'Bili', description: 'Creator' }
    })

    expect(wrapper.find('.bili-card-meta__avatar img').attributes('src')).toBe('/avatar.png')
    expect(wrapper.find('.bili-card-meta__title').text()).toBe('Bili')
    expect(wrapper.find('.bili-card-meta__description').text()).toBe('Creator')
  })

  it('supports slots for custom content', () => {
    const wrapper = mount(CardMeta, {
      slots: {
        avatar: '<span class="custom-avatar">A</span>',
        title: '<span class="custom-title">Title</span>'
      }
    })

    expect(wrapper.find('.custom-avatar').text()).toBe('A')
    expect(wrapper.find('.custom-title').text()).toBe('Title')
  })
})

describe('BiliCardGrid', () => {
  it('emits click when hoverable', async () => {
    const wrapper = mount(CardGrid, { slots: { default: 'Cell' } })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.classes()).toContain('is-hoverable')
  })

  it('can be rendered as a static cell', async () => {
    const wrapper = mount(CardGrid, { props: { hoverable: false } })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
  })
})
