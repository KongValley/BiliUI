import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Dropdown from '../dropdown.vue'
import DropdownItem from '../dropdown-item.vue'

// Popups teleport into `body`, so clear it between tests to avoid duplicates.
afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
})

const items = [
  { key: 'edit', label: '编辑', icon: 'edit' },
  { key: 'copy', label: '复制', shortcut: '⌘C' },
  { key: 'delete', label: '删除', divided: true },
  { key: 'frozen', label: '已冻结', disabled: true }
]

const mountDropdown = (props: Record<string, any> = {}) =>
  mount(Dropdown, {
    props: { trigger: 'click', items, ...props },
    slots: { default: () => '更多操作' },
    attachTo: document.body
  })

describe('BiliDropdown', () => {
  it('applies popper-class to the teleported popup', async () => {
    const wrapper = mountDropdown({ popperClass: 'custom-dropdown-popup' })
    await wrapper.trigger('click')
    await nextTick()

    expect(
      document.body.querySelector('.bili-dropdown__popup.custom-dropdown-popup')
    ).not.toBeNull()

    wrapper.unmount()
  })

  it('opens on click when trigger is click', async () => {
    const wrapper = mountDropdown()
    await nextTick()

    expect(document.body.querySelector('.bili-dropdown__popup')).toBeNull()

    await wrapper.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.bili-dropdown__popup')).not.toBeNull()
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])
  })

  it('renders items, icon, shortcut, divider and disabled state', async () => {
    const wrapper = mountDropdown()
    await wrapper.trigger('click')
    await nextTick()

    const buttons = document.body.querySelectorAll<HTMLButtonElement>('.bili-dropdown__item')
    expect(buttons).toHaveLength(4)
    expect(buttons[0].querySelector('.bili-dropdown__item-icon')).not.toBeNull()
    expect(buttons[1].textContent).toContain('⌘C')
    expect(buttons[2].classList.contains('is-divided')).toBe(true)
    expect(buttons[3].disabled).toBe(true)

    wrapper.unmount()
  })

  it('emits command and closes on item click', async () => {
    const wrapper = mountDropdown()
    await wrapper.trigger('click')
    await nextTick()

    const button = document.body.querySelectorAll<HTMLButtonElement>('.bili-dropdown__item')[1]
    button.click()
    await nextTick()

    expect(wrapper.emitted('command')?.[0]).toEqual([
      'copy',
      expect.objectContaining({ key: 'copy' })
    ])
    expect(wrapper.emitted('visible-change')?.at(-1)).toEqual([false])

    wrapper.unmount()
  })

  it('ignores disabled items', async () => {
    const wrapper = mountDropdown()
    await wrapper.trigger('click')
    await nextTick()

    const disabled = document.body.querySelectorAll<HTMLButtonElement>('.bili-dropdown__item')[3]
    disabled.click()
    await nextTick()

    expect(wrapper.emitted('command')).toBeUndefined()

    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mountDropdown({ disabled: true })
    await wrapper.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.bili-dropdown__popup')).toBeNull()
    wrapper.unmount()
  })

  it('toggles on repeat clicks', async () => {
    const wrapper = mountDropdown()
    await wrapper.trigger('click')
    await nextTick()
    expect(document.body.querySelector('.bili-dropdown__popup')).not.toBeNull()

    await wrapper.trigger('click')
    await nextTick()
    expect(document.body.querySelector('.bili-dropdown__popup')).toBeNull()

    wrapper.unmount()
  })

  it('opens on hover after the configured delay', async () => {
    vi.useFakeTimers()
    const wrapper = mountDropdown({ trigger: 'hover', showTimeout: 50 })
    await nextTick()

    await wrapper.trigger('mouseenter')
    expect(document.body.querySelector('.bili-dropdown__popup')).toBeNull()

    vi.advanceTimersByTime(60)
    await nextTick()
    expect(document.body.querySelector('.bili-dropdown__popup')).not.toBeNull()

    vi.useRealTimers()
    wrapper.unmount()
  })

  it('supports the slot-based item component', async () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'click' },
      slots: {
        default: () => '操作',
        dropdown: () => [
          h(DropdownItem, { itemKey: 'a' }, () => '选项 A'),
          h(DropdownItem, { itemKey: 'b', divided: true }, () => '选项 B')
        ]
      },
      attachTo: document.body
    })

    await wrapper.trigger('click')
    await nextTick()

    const rendered = document.body.querySelectorAll('.bili-dropdown-item')
    expect(rendered).toHaveLength(2)
    expect(rendered[1].classList.contains('is-divided')).toBe(true)

    wrapper.unmount()
  })
})
