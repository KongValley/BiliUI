import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Tag from '../tag.vue'

describe('BiliTag', () => {
  it('renders slot content and the base class', () => {
    const wrapper = mount(Tag, { slots: { default: '标签' } })
    expect(wrapper.classes()).toContain('bili-tag')
    expect(wrapper.find('.bili-tag__content').text()).toBe('标签')
  })

  it('applies type, size and effect modifiers', () => {
    const wrapper = mount(Tag, {
      props: { type: 'success', size: 'sm', effect: 'dark' }
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'bili-tag--success',
        'bili-tag--sm',
        'bili-tag--dark'
      ])
    )
  })

  it('applies the round state', () => {
    const wrapper = mount(Tag, { props: { round: true } })
    expect(wrapper.classes()).toContain('is-round')
  })

  it('renders a close button only when closable', () => {
    const plain = mount(Tag)
    expect(plain.find('.bili-tag__close').exists()).toBe(false)

    const closable = mount(Tag, { props: { closable: true } })
    expect(closable.find('.bili-tag__close').exists()).toBe(true)
    expect(closable.find('.bili-tag__close').attributes('aria-label')).toBe('关闭')
  })

  it('emits close with the click event', async () => {
    const wrapper = mount(Tag, { props: { closable: true }, slots: { default: '移除' } })
    await wrapper.find('.bili-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('close')?.[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('keeps the close button from triggering a parent click', async () => {
    let parentClicks = 0
    const wrapper = mount({
      components: { Tag },
      setup: () => ({ onClick: () => (parentClicks += 1) }),
      template: '<div @click="onClick"><Tag closable>标签</Tag></div>'
    })
    await wrapper.find('.bili-tag__close').trigger('click')
    expect(parentClicks).toBe(0)
  })
})
