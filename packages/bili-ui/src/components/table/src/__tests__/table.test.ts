import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
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
    expect(wrapper.emitted('sort-change')?.[0]?.[0]).toEqual({ prop: 'age', order: 'asc' })
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Alice')

    await ageHeader.trigger('click')
    expect(wrapper.emitted('sort-change')?.[1]?.[0]).toEqual({ prop: 'age', order: 'desc' })
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Bob')
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
})
