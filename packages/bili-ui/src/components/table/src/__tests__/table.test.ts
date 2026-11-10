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
  { name: 'Bob', age: 30 },
  { name: 'Alice', age: 20 }
]

interface SortPayload {
  prop: string
  order: 'asc' | 'desc' | null
  sorts: Array<{ prop: string; order: 'asc' | 'desc' }>
}

/** Typed accessor for the sort payload emitted at `index`. */
const sortPayload = (wrapper: ReturnType<typeof mount>, index: number) =>
  wrapper.emitted('sort-change')?.[index]?.[0] as SortPayload | undefined


describe('BiliTable', () => {
  it('renders columns and rows', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('sorts rows by a sortable column', async () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const ageHeader = wrapper.findAll('th')[1]

    await ageHeader.trigger('click')
    expect(sortPayload(wrapper, 0)).toMatchObject({ prop: 'age', order: 'asc' })
    expect(sortPayload(wrapper, 0)?.sorts).toEqual([{ prop: 'age', order: 'asc' }])
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Alice')

    await ageHeader.trigger('click')
    expect(sortPayload(wrapper, 1)).toMatchObject({ prop: 'age', order: 'desc' })
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Bob')

    // Third click clears the sort entirely.
    await ageHeader.trigger('click')
    expect(sortPayload(wrapper, 2)).toMatchObject({ prop: 'age', order: null })
    expect(sortPayload(wrapper, 2)?.sorts).toEqual([])
  })

  it('sorts multiple columns with shift-click when multiSort is on', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [
          { group: 'B', name: 'x', score: 2 },
          { group: 'A', name: 'y', score: 3 },
          { group: 'A', name: 'z', score: 1 }
        ],
        columns: [
          { prop: 'group', label: '组', sortable: true },
          { prop: 'score', label: '分数', sortable: true }
        ],
        multiSort: true
      }
    })

    const [groupHeader, scoreHeader] = wrapper.findAll('th')

    await scoreHeader.trigger('click')
    // Shift+click a second column instead of shiftKey on the event object.
    await groupHeader.trigger('click', { shiftKey: true })

    const payload = sortPayload(wrapper, 1)
    expect(payload?.sorts).toEqual([
      { prop: 'score', order: 'asc' },
      { prop: 'group', order: 'asc' }
    ])

    // Priority badges appear once more than one column is sorted.
    expect(wrapper.findAll('.bili-table__sort-index')).toHaveLength(2)

    const rows = wrapper.findAll('tbody tr').map(row => row.text())
    // Primary sort is score ascending: 1, 2, 3 → z, x, y.
    // Rendered cells are 组 + 分数, so the rows read A1, B2, A3.
    expect(rows[0]).toBe('A1')
    expect(rows[1]).toBe('B2')
    expect(rows[2]).toBe('A3')
  })

  it('replaces the sort on plain click even when multiSort is enabled', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '姓名', sortable: true },
          { prop: 'age', label: '年龄', sortable: true }
        ],
        multiSort: true
      }
    })
    const [nameHeader, ageHeader] = wrapper.findAll('th')

    await ageHeader.trigger('click')
    await nameHeader.trigger('click')

    const payload = wrapper.emitted('sort-change')?.[1]?.[0] as
      | { sorts: Array<{ prop: string; order: string }> }
      | undefined
    expect(payload?.sorts).toEqual([{ prop: 'name', order: 'asc' }])
  })

  it('supports a custom sortMethod', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ v: 'bbb' }, { v: 'a' }, { v: 'cc' }],
        columns: [
          {
            prop: 'v',
            label: 'V',
            sortable: true,
            // Sort by length instead of alphabetically.
            sortMethod: (a: string, b: string) => a.length - b.length
          }
        ]
      }
    })

    await wrapper.find('th').trigger('click')
    const order = wrapper.findAll('tbody tr').map(row => row.text())
    expect(order).toEqual(['a', 'cc', 'bbb'])
  })

  it('keeps empty values at the bottom in both directions', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ v: 2 }, { v: null }, { v: 1 }],
        columns: [{ prop: 'v', label: 'V', sortable: true }]
      }
    })
    const header = wrapper.find('th')

    await header.trigger('click')
    let order = wrapper.findAll('tbody tr').map(row => row.text())
    expect(order[order.length - 1]).toBe('')

    await header.trigger('click')
    order = wrapper.findAll('tbody tr').map(row => row.text())
    expect(order[order.length - 1]).toBe('')
  })

  it('renders a custom cell slot', () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        'cell-name': ({ row }: { row: any }) => h('strong', { class: 'name-cell' }, row.name)
      }
    })
    expect(wrapper.findAll('.name-cell')).toHaveLength(2)
  })

  it('shows formatted values', () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          {
            prop: 'age',
            label: '年龄',
            formatter: (_row: any, _column: TableColumn, value: any) => `${value} 岁`
          }
        ]
      }
    })
    expect(wrapper.text()).toContain('30 岁')
  })

  it('shows empty text', () => {
    const wrapper = mount(Table, { props: { columns, data: [] } })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('applies stripe and border classes', () => {
    const wrapper = mount(Table, { props: { columns, data, stripe: true, border: true } })
    expect(wrapper.classes()).toContain('is-stripe')
    expect(wrapper.classes()).toContain('is-border')
  })

  it('renders a resize handle by default and hides it when disabled', () => {
    const enabled = mount(Table, { props: { columns, data } })
    expect(enabled.findAll('.bili-table__resize-handle')).toHaveLength(columns.length)

    const disabled = mount(Table, {
      props: { columns, data, resizableColumns: false }
    })
    expect(disabled.find('.bili-table__resize-handle').exists()).toBe(false)

    const perColumn = mount(Table, {
      props: {
        data,
        columns: [{ prop: 'name', label: '姓名', resizable: false }, { prop: 'age', label: '年龄' }]
      }
    })
    expect(perColumn.findAll('.bili-table__resize-handle')).toHaveLength(1)
  })

  it('marks headers draggable only when draggableColumns is on', () => {
    const off = mount(Table, { props: { columns, data } })
    expect(off.find('th').attributes('draggable')).toBeUndefined()

    const on = mount(Table, { props: { columns, data, draggableColumns: true } })
    expect(on.find('th').attributes('draggable')).toBe('true')
    expect(on.classes()).toContain('is-draggable')
  })

  it('reorders columns by dragging one header onto another', async () => {
    const wrapper = mount(Table, { props: { columns, data, draggableColumns: true } })
    const headers = wrapper.findAll('th')

    const dataTransfer = {
      effectAllowed: '',
      setData: () => undefined
    }

    await headers[0].trigger('dragstart', { dataTransfer })
    await headers[1].trigger('dragover')
    await headers[1].trigger('drop')
    await headers[0].trigger('dragend')

    expect(wrapper.emitted('column-order-change')?.[0]?.[0]).toEqual(['age', 'name'])
    // Header cells now follow the new order.
    const labels = wrapper.findAll('th').map(th => th.text().trim())
    expect(labels[0]).toContain('年龄')
    expect(labels[1]).toContain('姓名')
  })

  it('does not sort while a drag is in progress', async () => {
    const wrapper = mount(Table, { props: { columns, data, draggableColumns: true } })
    const headers = wrapper.findAll('th')
    const dataTransfer = { effectAllowed: '', setData: () => undefined }

    await headers[1].trigger('dragstart', { dataTransfer })
    await headers[1].trigger('click')

    expect(wrapper.emitted('sort-change')).toBeUndefined()
  })

  it('does not reorder when dropping on the source column', async () => {
    const wrapper = mount(Table, { props: { columns, data, draggableColumns: true } })
    const headers = wrapper.findAll('th')
    const dataTransfer = { effectAllowed: '', setData: () => undefined }

    await headers[0].trigger('dragstart', { dataTransfer })
    await headers[0].trigger('drop')

    expect(wrapper.emitted('column-order-change')).toBeUndefined()
  })

  it('pins fixed columns and freezes the header with maxHeight', () => {
    const fixedColumns: TableColumn[] = [
      { prop: 'name', label: '姓名', fixed: 'left', width: 120 },
      { prop: 'age', label: '年龄', width: 100 },
      { prop: 'city', label: '城市', fixed: 'right', width: 110 }
    ]
    const wrapper = mount(Table, {
      props: { columns: fixedColumns, data, maxHeight: 220 }
    })

    const [nameHeader, , cityHeader] = wrapper.findAll('th')
    expect(nameHeader.classes()).toContain('is-fixed-left')
    expect(nameHeader.classes()).toContain('is-fixed-left-last')
    expect(nameHeader.attributes('style')).toContain('position: sticky')
    expect(nameHeader.attributes('style')).toContain('left: 0px')

    expect(cityHeader.classes()).toContain('is-fixed-right')
    expect(cityHeader.classes()).toContain('is-fixed-right-first')
    expect(cityHeader.attributes('style')).toContain('right: 0px')

    const wrapperStyle = wrapper.find('.bili-table__wrapper').attributes('style')
    expect(wrapperStyle).toContain('max-height: 220px')
    expect(wrapperStyle).toContain('overflow-y: auto')
  })

  it('expands rows through the expand column slot', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, rowKey: 'name', expandable: true },
      slots: {
        expand: ({ row }: { row: any }) => h('div', { class: 'detail' }, `${row.name} detail`)
      }
    })

    expect(wrapper.findAll('.bili-table__expand-toggle')).toHaveLength(2)
    await wrapper.findAll('.bili-table__expand-toggle')[0].trigger('click')

    expect(wrapper.findAll('.bili-table__expand-row')).toHaveLength(1)
    expect(wrapper.find('.detail').text()).toBe('Bob detail')
    expect(wrapper.emitted('update:expandedRowKeys')?.[0]?.[0]).toEqual(['Bob'])
    expect(wrapper.emitted('expand-row-change')?.[0]?.[1]).toBe(true)

    await wrapper.findAll('.bili-table__expand-toggle')[0].trigger('click')
    expect(wrapper.findAll('.bili-table__expand-row')).toHaveLength(0)
  })

  it('flattens tree data and expands child levels', async () => {
    const treeData = [
      {
        id: 1,
        name: 'A',
        children: [
          { id: 11, name: 'A-1' },
          { id: 12, name: 'A-2', children: [{ id: 121, name: 'A-2-1' }] }
        ]
      },
      { id: 2, name: 'B' }
    ]

    const wrapper = mount(Table, {
      props: {
        columns: [{ prop: 'name', label: '名称' }],
        data: treeData,
        rowKey: 'id'
      }
    })

    expect(wrapper.findAll('.bili-table__row')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('A-1')

    await wrapper.find('.bili-table__tree-toggle').trigger('click')
    expect(wrapper.findAll('.bili-table__row')).toHaveLength(4)
    expect(wrapper.text()).toContain('A-1')
    expect(wrapper.emitted('update:expandedKeys')?.[0]?.[0]).toEqual([1])

    // Expanding the nested node adds its only child.
    const nestedToggle = wrapper.findAll('.bili-table__tree-toggle')[1]
    await nestedToggle.trigger('click')
    expect(wrapper.findAll('.bili-table__row')).toHaveLength(5)
    expect(wrapper.text()).toContain('A-2-1')
  })

  it('expands every tree node with defaultExpandAll', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ prop: 'name', label: '名称' }],
        data: [{ id: 1, name: 'A', children: [{ id: 11, name: 'A-1' }] }],
        rowKey: 'id',
        defaultExpandAll: true
      }
    })

    await nextTick()
    expect(wrapper.findAll('.bili-table__row')).toHaveLength(2)
    expect(wrapper.text()).toContain('A-1')
  })

  it('renders summary rows from summaryMethod or automatically', () => {
    const custom = mount(Table, {
      props: {
        columns: [{ prop: 'name', label: '姓名' }, { prop: 'age', label: '年龄' }],
        data,
        showSummary: true,
        summaryMethod: ({ data: rows }) => [
          '合计',
          rows.reduce((total, row) => total + row.age, 0)
        ]
      }
    })
    expect(custom.find('tfoot').text()).toContain('合计')
    expect(custom.find('tfoot').text()).toContain('50')

    const automatic = mount(Table, {
      props: {
        columns,
        data,
        showSummary: true
      }
    })
    expect(automatic.find('tfoot').text()).toContain('合计')
    expect(automatic.find('tfoot').text()).toContain('50')
  })

  it('windows large datasets when virtual is enabled', () => {
    const rows = Array.from({ length: 100 }, (_, index) => ({
      name: `Row ${index}`,
      age: index
    }))
    const wrapper = mount(Table, {
      props: { columns, data: rows, virtual: true, maxHeight: 200 }
    })

    const rendered = wrapper.findAll('.bili-table__row')
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(rows.length)
    expect(wrapper.find('.bili-table__wrapper').attributes('style')).toContain('max-height: 200px')
    expect(wrapper.findAll('.bili-table__spacer-row').length).toBeGreaterThan(0)
  })
})
