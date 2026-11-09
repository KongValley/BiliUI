import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Table from '../table.vue'
import type { TableColumn } from '../table'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true }
]

const data = [
  { id: 'a', name: 'Alice', age: 20 },
  { id: 'b', name: 'Bob', age: 30 },
  { id: 'c', name: 'Cara', age: 25 }
]

const selectionCells = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('tbody .bili-table__selection-cell')

describe('BiliTable selection', () => {
  it('renders a checkbox column when selection is enabled', () => {
    const wrapper = mount(Table, { props: { columns, data, selection: true, rowKey: 'id' } })
    expect(wrapper.find('thead .bili-table__selection-cell').exists()).toBe(true)
    expect(selectionCells(wrapper)).toHaveLength(3)
    expect(wrapper.findAll('th')).toHaveLength(columns.length + 1)
  })

  it('omits the checkbox column by default', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    expect(wrapper.find('.bili-table__selection-cell').exists()).toBe(false)
  })

  it('selects a row and emits the new keys', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selection: true, rowKey: 'id' }
    })

    await selectionCells(wrapper)[1].find('input').setValue(true)

    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['b']])
    const payload = wrapper.emitted('select')?.[0]?.[0] as { keys: string[]; row: any }
    expect(payload.keys).toEqual(['b'])
    expect(payload.row.name).toBe('Bob')
    expect(wrapper.findAll('tbody tr')[1].classes()).toContain('is-selected')
  })

  it('keeps selection in sync through the controlled prop', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selection: true, rowKey: 'id', selectedKeys: ['c'] }
    })

    expect(wrapper.findAll('tbody tr')[2].classes()).toContain('is-selected')
    expect(wrapper.findAll('tbody tr')[0].classes()).not.toContain('is-selected')

    await wrapper.setProps({ selectedKeys: ['a', 'c'] })
    expect(wrapper.findAll('tbody tr')[0].classes()).toContain('is-selected')
  })

  it('selects and clears everything from the header checkbox', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selection: true, rowKey: 'id' }
    })
    const headerCheckbox = wrapper.find('thead .bili-table__selection-cell input')

    await headerCheckbox.setValue(true)
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['a', 'b', 'c']])
    expect(wrapper.emitted('select-all')).toHaveLength(1)

    await headerCheckbox.setValue(false)
    expect(wrapper.emitted('update:selectedKeys')?.[1]).toEqual([[]])
  })

  it('shows partial selection on the header checkbox', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selection: true, rowKey: 'id' }
    })
    await selectionCells(wrapper)[0].find('input').setValue(true)

    const headerInput = wrapper.find(
      'thead .bili-table__selection-cell input'
    ).element as HTMLInputElement
    expect(headerInput.indeterminate).toBe(true)
    expect(headerInput.checked).toBe(false)
  })

  it('skips rows excluded by the selectable predicate', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selection: true,
        rowKey: 'id',
        selectable: (row: any) => row.id !== 'b'
      }
    })

    const inputs = wrapper.findAll('tbody .bili-table__selection-cell input')
    expect((inputs[1].element as HTMLInputElement).disabled).toBe(true)
    expect(inputs[1].classes()).not.toContain('is-checked')

    const headerCheckbox = wrapper.find('thead .bili-table__selection-cell input')
    await headerCheckbox.setValue(true)
    // "b" is excluded from select-all.
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['a', 'c']])
  })

  it('emits select in controlled mode without waiting for the prop update', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selection: true, rowKey: 'id', selectedKeys: [] }
    })

    await selectionCells(wrapper)[2].find('input').setValue(true)

    // The payload must already contain the new key even though `selectedKeys`
    // is still the old prop value at this point in the tick.
    const payload = wrapper.emitted('select')?.[0]?.[0] as {
      keys: string[]
      rows: any[]
      row: any
    }
    expect(payload.keys).toEqual(['c'])
    expect(payload.rows.map(row => row.id)).toEqual(['c'])
    expect(payload.row.id).toBe('c')
  })

  it('toggles a row when clicking the row and selectOnClickRow is on', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selection: true,
        rowKey: 'id',
        selectOnClickRow: true
      }
    })

    await wrapper.findAll('tbody tr')[0].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['a']])

    await wrapper.findAll('tbody tr')[0].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[1]).toEqual([[]])
  })

  it('ignores clicks on interactive elements inside a row', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selection: true, rowKey: 'id', selectOnClickRow: true },
      slots: {
        'cell-name': () => h('button', { class: 'inner-btn' }, '操作')
      }
    })

    await wrapper.find('.inner-btn').trigger('click')
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('keeps selection stable when sorting reorders rows', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selection: true,
        rowKey: 'id',
        selectOnClickRow: true
      }
    })

    // Select Alice (age 20), then sort by age ascending: Alice stays first.
    await wrapper.findAll('tbody tr')[0].trigger('click')
    const ageHeader = wrapper.findAll('th')[2]
    await ageHeader.trigger('click')
    await nextTick()

    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Alice')
    expect(rows[0].classes()).toContain('is-selected')

    // Sort descending: Alice moves to the bottom but stays selected.
    await ageHeader.trigger('click')
    await nextTick()
    const sorted = wrapper.findAll('tbody tr')
    expect(sorted[sorted.length - 1].text()).toContain('Alice')
    expect(sorted[sorted.length - 1].classes()).toContain('is-selected')
  })

  it('exposes clearSelection and reports selected rows', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selection: true, rowKey: 'id', selectedKeys: ['a', 'b'] }
    })

    const instance = wrapper.vm as unknown as {
      clearSelection: () => void
      selectedRows: any[]
    }
    expect(instance.selectedRows.map(row => row.id)).toEqual(['a', 'b'])

    instance.clearSelection()
    await nextTick()
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([[]])
  })

  it('adds the selection column to the empty-state colspan', () => {
    const wrapper = mount(Table, {
      props: { columns, data: [], selection: true, rowKey: 'id' }
    })
    expect(wrapper.find('.bili-table__empty').attributes('colspan')).toBe('3')
  })
})
