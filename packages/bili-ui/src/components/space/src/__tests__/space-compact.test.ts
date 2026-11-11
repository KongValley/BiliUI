import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SpaceCompact from '../space-compact.vue'

describe('BiliSpaceCompact', () => {
  it('renders a horizontal compact group by default', () => {
    const wrapper = mount(SpaceCompact, {
      slots: { default: '<button>One</button><button>Two</button>' }
    })

    expect(wrapper.classes()).toContain('bili-space-compact')
    expect(wrapper.classes()).toContain('bili-space-compact--horizontal')
    expect(wrapper.findAll('button')).toHaveLength(2)
  })

  it('supports vertical and block layouts', () => {
    const wrapper = mount(SpaceCompact, {
      props: { direction: 'vertical', block: true },
      slots: { default: '<button>One</button>' }
    })

    expect(wrapper.classes()).toContain('bili-space-compact--vertical')
    expect(wrapper.classes()).toContain('is-block')
  })
})
