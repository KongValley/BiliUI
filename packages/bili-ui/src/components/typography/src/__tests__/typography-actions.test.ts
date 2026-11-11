import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Text from '../text.vue'
import Title from '../title.vue'
import Paragraph from '../paragraph.vue'
import Link from '../link.vue'

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('typography copyable', () => {
  it('copies the rendered text and emits copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })

    const wrapper = mount(Text, {
      props: { copyable: true },
      slots: { default: 'Bili UI' }
    })

    await wrapper.find('.bili-typography__action').trigger('click')
    expect(writeText).toHaveBeenCalledWith('Bili UI')
    expect(wrapper.emitted('copy')?.[0]).toEqual(['Bili UI'])
  })

  it('uses an explicit copy text', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })

    const wrapper = mount(Text, {
      props: { copyable: { text: 'npm install bili-ui' } },
      slots: { default: 'Install' }
    })

    await wrapper.find('.bili-typography__action').trigger('click')
    expect(writeText).toHaveBeenCalledWith('npm install bili-ui')
  })

  it('works on titles, paragraphs and links', () => {
    for (const Component of [Title, Paragraph, Link]) {
      const wrapper = mount(Component, {
        props: { copyable: true },
        slots: { default: 'Copy me' }
      })
      expect(wrapper.find('.bili-typography__action').exists()).toBe(true)
      expect(wrapper.find('.bili-typography__content').text()).toBe('Copy me')
    }
  })
})

describe('typography editable', () => {
  it('switches to an input and emits the new value on Enter', async () => {
    const wrapper = mount(Text, {
      props: { editable: true },
      slots: { default: 'Old' }
    })

    await wrapper.find('.bili-typography__action').trigger('click')
    const input = wrapper.find('.bili-typography__edit')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('Old')

    await input.setValue('New')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('change')?.[0]).toEqual(['New'])
    expect(wrapper.find('.bili-typography__edit').exists()).toBe(false)
    expect(wrapper.emitted('edit-start')).toHaveLength(1)
  })

  it('cancels editing with Escape', async () => {
    const wrapper = mount(Paragraph, {
      props: { editable: true },
      slots: { default: 'Text' }
    })

    await wrapper.find('.bili-typography__action').trigger('click')
    await wrapper.find('.bili-typography__edit').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('edit-cancel')).toHaveLength(1)
  })

  it('shows confirm and cancel actions while editing', async () => {
    const wrapper = mount(Title, {
      props: { editable: true },
      slots: { default: 'Heading' }
    })

    await wrapper.find('.bili-typography__action').trigger('click')
    await nextTick()

    expect(wrapper.findAll('.bili-typography__action')).toHaveLength(2)
  })
})
