import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Cascader from '../cascader.vue'

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖', value: 'xihu' },
          { label: '上城', value: 'shangcheng' }
        ]
      },
      { label: '宁波', value: 'ningbo' }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [{ label: '南京', value: 'nanjing' }]
  }
]

const findOption = (text: string): HTMLElement => {
  const items = Array.from(
    document.body.querySelectorAll<HTMLElement>('.bili-cascader__option')
  )
  const item = items.find(node => node.textContent?.trim() === text)
  if (!item) throw new Error(`option not found: ${text}`)
  return item
}

const openPanel = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.find('.bili-cascader').trigger('click')
  await flushPromises()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliCascader', () => {
  it('cascades through columns and selects a leaf', async () => {
    const wrapper = mount(Cascader, {
      props: { modelValue: null, options },
      attachTo: document.body
    })

    await openPanel(wrapper)
    findOption('浙江').click()
    await nextTick()
    expect(document.body.querySelectorAll('.bili-cascader__column')).toHaveLength(2)

    findOption('杭州').click()
    await nextTick()
    expect(document.body.querySelectorAll('.bili-cascader__column')).toHaveLength(3)

    findOption('西湖').click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['xihu'])
    const change = wrapper.emitted('change')?.[0] as [string, any[]] | undefined
    expect(change?.[1].map(node => node.label)).toEqual(['浙江', '杭州', '西湖'])
    expect(document.body.querySelector('.bili-cascader__panel')).toBeNull()
  })

  it('renders the selected path joined by the separator', () => {
    const wrapper = mount(Cascader, {
      props: { modelValue: 'xihu', options, separator: ' / ' }
    })
    expect(wrapper.find('.bili-cascader__value').text()).toBe('浙江 / 杭州 / 西湖')
  })

  it('commits parent nodes with changeOnSelect and keeps the panel open', async () => {
    const wrapper = mount(Cascader, {
      props: { modelValue: null, options, changeOnSelect: true },
      attachTo: document.body
    })

    await openPanel(wrapper)
    findOption('浙江').click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['zhejiang'])
    expect(document.body.querySelector('.bili-cascader__panel')).not.toBeNull()
  })

  it('clears the current value', async () => {
    const wrapper = mount(Cascader, {
      props: { modelValue: 'ningbo', options, clearable: true }
    })

    await wrapper.find('.bili-cascader__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('ignores disabled options', async () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: null,
        options: [{ label: '禁用', value: 'disabled', disabled: true }]
      },
      attachTo: document.body
    })

    await openPanel(wrapper)
    findOption('禁用').click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(Cascader, {
      props: { modelValue: null, options, disabled: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-cascader').trigger('click')
    await flushPromises()
    expect(document.body.querySelector('.bili-cascader__panel')).toBeNull()
  })
})
