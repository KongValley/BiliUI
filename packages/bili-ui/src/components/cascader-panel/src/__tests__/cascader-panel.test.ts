import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CascaderPanel from '../cascader-panel.vue'

const options = [
  {
    value: 'zj',
    label: 'Zhejiang',
    children: [
      { value: 'hz', label: 'Hangzhou' },
      { value: 'nb', label: 'Ningbo' }
    ]
  },
  { value: 'js', label: 'Jiangsu' },
  { value: 'off', label: 'Disabled', disabled: true }
]

const mountPanel = (props: Record<string, unknown> = {}) =>
  mount(CascaderPanel, {
    attachTo: document.body,
    props: { options, ...props }
  })

const option = (label: string) =>
  Array.from(document.body.querySelectorAll<HTMLElement>('.bili-cascader-panel__option')).find(
    node => node.textContent?.trim().startsWith(label)
  )

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliCascaderPanel', () => {
  it('renders the first column and expands children on click', async () => {
    const wrapper = mountPanel()
    expect(wrapper.findAll('.bili-cascader-panel__column')).toHaveLength(1)

    option('Zhejiang')!.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.bili-cascader-panel__column')).toHaveLength(2)
    expect(option('Hangzhou')).not.toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('commits a leaf value with its full path', async () => {
    const wrapper = mountPanel()
    option('Zhejiang')!.click()
    await wrapper.vm.$nextTick()
    option('Hangzhou')!.click()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hz'])
    const payload = wrapper.emitted('change')?.[0] as [string, Array<{ value: string }>]
    expect(payload[0]).toBe('hz')
    expect(payload[1].map(node => node.value)).toEqual(['zj', 'hz'])
  })

  it('commits parent values when change-on-select is enabled', async () => {
    const wrapper = mountPanel({ changeOnSelect: true })
    option('Zhejiang')!.click()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['zj'])
  })

  it('restores the active path from the model value', async () => {
    const wrapper = mountPanel({ modelValue: 'nb' })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.bili-cascader-panel__column')).toHaveLength(2)
    expect(option('Ningbo')?.classList.contains('is-selected')).toBe(true)
    expect(option('Zhejiang')?.classList.contains('is-active')).toBe(true)
  })

  it('ignores disabled nodes', async () => {
    const wrapper = mountPanel()
    option('Disabled')!.click()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows the empty state and custom text', () => {
    const wrapper = mountPanel({ options: [], emptyText: 'Nothing here' })
    expect(wrapper.find('.bili-cascader-panel__empty').text()).toBe('Nothing here')
  })
})
