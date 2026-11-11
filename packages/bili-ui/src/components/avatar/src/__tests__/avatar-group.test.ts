import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Avatar from '../avatar.vue'
import AvatarGroup from '../avatar-group.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliAvatarGroup', () => {
  it('inherits size and shape for child avatars', async () => {
    const wrapper = mount(AvatarGroup, {
      attachTo: document.body,
      props: { size: 'lg', shape: 'square' },
      slots: {
        default: () => [h(Avatar, { name: 'A' }), h(Avatar, { name: 'B' })]
      }
    })
    await nextTick()

    const avatars = wrapper.findAll('.bili-avatar')
    expect(avatars).toHaveLength(2)
    expect(avatars[0].attributes('style')).toContain('width: 40px')
    expect(avatars[0].classes()).toContain('bili-avatar--square')
  })

  it('collapses extra avatars into +N', async () => {
    const wrapper = mount(AvatarGroup, {
      attachTo: document.body,
      props: { max: 2 },
      slots: {
        default: () => [
          h(Avatar, { name: 'A' }),
          h(Avatar, { name: 'B' }),
          h(Avatar, { name: 'C' })
        ]
      }
    })
    await nextTick()

    const avatars = wrapper.findAll('.bili-avatar')
    expect(avatars[2].attributes('style')).toContain('display: none')
    expect(wrapper.find('.bili-avatar-group__rest').text()).toBe('+1')
  })

  it('exposes the overlap as a CSS variable', () => {
    const wrapper = mount(AvatarGroup, {
      props: { spacing: -12 },
      slots: { default: () => [h(Avatar, { name: 'A' })] }
    })

    expect(wrapper.attributes('style')).toContain('--bili-avatar-group-spacing: -12px')
  })
})
