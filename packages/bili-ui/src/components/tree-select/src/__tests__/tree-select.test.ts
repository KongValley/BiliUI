import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TreeSelect from '../tree-select.vue'

const data = [
  {
    label: '研发',
    value: 'dev',
    children: [
      {
        label: '前端',
        value: 'fe',
        children: [
          { label: 'Vue', value: 'vue' },
          { label: 'React', value: 'react' }
        ]
      },
      { label: '后端', value: 'be' }
    ]
  },
  {
    label: '设计',
    value: 'design',
    children: [{ label: '视觉', value: 'visual' }]
  }
]

const nodeByLabel = (label: string): HTMLElement => {
  const node = Array.from(document.body.querySelectorAll<HTMLElement>('.bili-tree__node')).find(
    item => item.textContent?.trim() === label
  )
  if (!node) throw new Error(`node not found: ${label}`)
  return node
}

const setCheckbox = async (input: HTMLInputElement, checked: boolean) => {
  input.checked = checked
  input.dispatchEvent(new Event('change', { bubbles: true }))
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BiliTreeSelect', () => {
  it('applies popper-class to the teleported panel', async () => {
    const wrapper = mount(TreeSelect, {
      props: { modelValue: null, data, popperClass: 'custom-tree-select-panel' },
      attachTo: document.body
    })

    await wrapper.find('.bili-tree-select').trigger('click')
    await nextTick()

    expect(
      document.body.querySelector('.bili-tree-select__panel.custom-tree-select-panel')
    ).not.toBeNull()
  })

  it('selects a single node and closes the panel', async () => {
    const wrapper = mount(TreeSelect, {
      props: { modelValue: null, data, defaultExpandAll: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-tree-select').trigger('click')
    await nextTick()
    nodeByLabel('前端').click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['fe'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('fe')
    await flushPromises()
    expect(document.body.querySelector('.bili-tree-select__panel')).toBeNull()
  })

  it('shows the selected label in the trigger', () => {
    const wrapper = mount(TreeSelect, {
      props: { modelValue: 'visual', data }
    })
    expect(wrapper.find('.bili-tree-select__value').text()).toBe('视觉')
  })

  it('checks multiple nodes and renders tags', async () => {
    const wrapper = mount(TreeSelect, {
      props: { modelValue: [], data, multiple: true, defaultExpandAll: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-tree-select').trigger('click')
    await nextTick()

    const checkboxes = document.body.querySelectorAll<HTMLInputElement>(
      '.bili-tree input[type="checkbox"]'
    )
    await setCheckbox(checkboxes[1], true)

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['fe', 'vue', 'react'])
    expect(document.body.querySelector('.bili-tree-select__panel')).not.toBeNull()

    await wrapper.setProps({ modelValue: ['fe', 'vue', 'react'] })
    expect(wrapper.findAll('.bili-tree-select__tag')).toHaveLength(3)
  })

  it('collapses tags beyond maxTagCount', () => {
    const wrapper = mount(TreeSelect, {
      props: {
        modelValue: ['vue', 'react', 'be'],
        data,
        multiple: true,
        maxTagCount: 2
      }
    })

    const tags = wrapper.findAll('.bili-tree-select__tag')
    expect(tags).toHaveLength(3)
    expect(tags[2].text()).toBe('+1')
  })

  it('clears the current value', async () => {
    const wrapper = mount(TreeSelect, {
      props: { modelValue: 'fe', data, clearable: true }
    })

    await wrapper.find('.bili-tree-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('filters nodes inside the panel', async () => {
    const wrapper = mount(TreeSelect, {
      props: { modelValue: null, data },
      attachTo: document.body
    })

    await wrapper.find('.bili-tree-select').trigger('click')
    await nextTick()

    const filter = document.body.querySelector<HTMLInputElement>('.bili-tree__filter-input')
    filter!.value = 'vue'
    filter!.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    const labels = Array.from(document.body.querySelectorAll<HTMLElement>('.bili-tree__node')).map(
      node => node.textContent?.trim()
    )
    expect(labels).toEqual(['研发', '前端', 'Vue'])

    nodeByLabel('Vue').click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['vue'])
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(TreeSelect, {
      props: { modelValue: null, data, disabled: true },
      attachTo: document.body
    })

    await wrapper.find('.bili-tree-select').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.bili-tree-select__panel')).toBeNull()
  })
})
