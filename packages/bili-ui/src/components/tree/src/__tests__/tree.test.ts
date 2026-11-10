import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Tree from '../tree.vue'

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

const nodeByLabel = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper.findAll('.bili-tree__node').find(node => node.text().trim() === label)

/** VTU's `setChecked` is private in this version; drive the native checkbox. */
const setCheckbox = async (
  input: ReturnType<ReturnType<typeof mount>['find']>,
  checked: boolean
) => {
  ;(input.element as HTMLInputElement).checked = checked
  await input.trigger('change')
}

describe('BiliTree', () => {
  it('renders root nodes and expands children on demand', async () => {
    const wrapper = mount(Tree, { props: { data } })
    expect(wrapper.findAll('.bili-tree__node')).toHaveLength(2)

    await wrapper.find('.bili-tree__toggle').trigger('click')
    expect(wrapper.findAll('.bili-tree__node')).toHaveLength(4)
    expect(wrapper.text()).toContain('前端')
    expect(wrapper.text()).not.toContain('Vue')
    expect(wrapper.emitted('update:expandedKeys')?.[0]?.[0]).toEqual(['dev'])
    expect(wrapper.emitted('expand-change')?.[0]?.[1]).toBe(true)
  })

  it('expands every branch with defaultExpandAll', async () => {
    const wrapper = mount(Tree, { props: { data, defaultExpandAll: true } })
    await nextTick()
    expect(wrapper.findAll('.bili-tree__node')).toHaveLength(7)
  })

  it('selects a node and highlights it', async () => {
    const wrapper = mount(Tree, { props: { data, defaultExpandAll: true } })
    await nextTick()

    await nodeByLabel(wrapper, '前端')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['fe'])
    expect(wrapper.emitted('node-click')?.[0]?.[1]).toBe('fe')

    await wrapper.setProps({ modelValue: 'fe' })
    const selected = nodeByLabel(wrapper, '前端')!
    expect(selected.classes()).toContain('is-selected')
  })

  it('cascades checks from parents to children and recomputes ancestors', async () => {
    const wrapper = mount(Tree, {
      props: { data, checkable: true, defaultExpandAll: true }
    })
    await nextTick()

    const inputs = wrapper.findAll('input[type="checkbox"]')
    await setCheckbox(inputs[0], true)
    await nextTick()

    expect(wrapper.emitted('update:checkedKeys')?.[0]?.[0]).toEqual([
      'dev',
      'fe',
      'vue',
      'react',
      'be'
    ])

    // Unchecking one leaf clears both its parent and grandparent.
    await setCheckbox(wrapper.findAll('input[type="checkbox"]')[2], false)
    await nextTick()
    expect(wrapper.emitted('update:checkedKeys')?.[1]?.[0]).toEqual(['react', 'be'])
  })

  it('marks a parent indeterminate when only some children are checked', async () => {
    const wrapper = mount(Tree, {
      props: { data, checkable: true, defaultExpandAll: true }
    })
    await nextTick()

    // Check only React.
    await setCheckbox(wrapper.findAll('input[type="checkbox"]')[3], true)
    await nextTick()

    const labels = wrapper.findAll('.bili-tree__checkbox')
    expect(labels[0].classes()).toContain('is-indeterminate')
    expect(labels[0].classes()).not.toContain('is-checked')
  })

  it('keeps parent and child independent with checkStrictly', async () => {
    const wrapper = mount(Tree, {
      props: { data, checkable: true, checkStrictly: true, defaultExpandAll: true }
    })
    await nextTick()

    await setCheckbox(wrapper.findAll('input[type="checkbox"]')[0], true)
    await nextTick()

    expect(wrapper.emitted('update:checkedKeys')?.[0]?.[0]).toEqual(['dev'])
  })

  it('ignores disabled nodes', async () => {
    const wrapper = mount(Tree, {
      props: {
        data: [{ label: '禁用', value: 'disabled', disabled: true }],
        checkable: true
      }
    })

    await wrapper.find('.bili-tree__node').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('input[type="checkbox"]').attributes('disabled')).toBeDefined()
  })

  it('filters nodes while keeping their ancestors visible', async () => {
    const wrapper = mount(Tree, { props: { data, filterable: true } })

    await wrapper.find('.bili-tree__filter-input').setValue('vue')
    await nextTick()

    const labels = wrapper.findAll('.bili-tree__node').map(node => node.text().trim())
    expect(labels).toEqual(['研发', '前端', 'Vue'])
    expect(nodeByLabel(wrapper, 'Vue')!.classes()).toContain('is-matched')

    await wrapper.find('.bili-tree__filter-input').setValue('')
    await nextTick()
    expect(wrapper.findAll('.bili-tree__node')).toHaveLength(2)
  })
})
