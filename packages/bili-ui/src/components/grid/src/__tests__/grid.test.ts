import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Row from '../row.vue'
import Col from '../col.vue'

const mountGrid = (rowProps = {}, colProps = {}) =>
  mount(Row, {
    props: rowProps,
    slots: {
      default: () => [
        h(Col, { span: 8, ...colProps }, () => 'A'),
        h(Col, { span: 8 }, () => 'B'),
        h(Col, { span: 8 }, () => 'C')
      ]
    }
  })

describe('BiliRow / BiliCol', () => {
  it('renders three columns with span classes', () => {
    const wrapper = mountGrid()
    const cols = wrapper.findAll('.bili-col')
    expect(cols).toHaveLength(3)
    cols.forEach(col => expect(col.classes()).toContain('bili-col--8'))
  })

  it('maps justify and align keywords to flex values', () => {
    const wrapper = mountGrid({ justify: 'space-between', align: 'middle' })
    const style = wrapper.find('.bili-row').attributes('style') ?? ''
    expect(style).toContain('justify-content: space-between')
    expect(style).toContain('align-items: center')
  })

  it('applies horizontal gutter through row offsets and column padding', () => {
    const wrapper = mountGrid({ gutter: 20 })
    const rowStyle = wrapper.find('.bili-row').attributes('style') ?? ''
    expect(rowStyle).toContain('margin-left: -10px')
    expect(rowStyle).toContain('margin-right: -10px')

    const colStyle = wrapper.find('.bili-col').attributes('style') ?? ''
    expect(colStyle).toContain('padding-left: 10px')
    expect(colStyle).toContain('padding-right: 10px')
  })

  it('supports a vertical gutter as an array', () => {
    const wrapper = mountGrid({ gutter: [16, 24] })
    const rowStyle = wrapper.find('.bili-row').attributes('style') ?? ''
    expect(rowStyle).toContain('margin-left: -8px')
    expect(rowStyle).toContain('row-gap: 24px')
  })

  it('computes offset as a percentage of 24 columns', () => {
    const wrapper = mountGrid({}, { offset: 6 })
    const style = wrapper.find('.bili-col').attributes('style') ?? ''
    expect(style).toContain('margin-left: 25%')
  })

  it('supports push and pull', () => {
    const wrapper = mountCol({ span: 12, push: 6, pull: 3 })
    const style = wrapper.find('.bili-col').attributes('style') ?? ''
    expect(style).toContain('left: 25%')
    expect(style).toContain('right: 12.5%')
  })

  it('adds responsive span and offset classes', () => {
    const wrapper = mountCol({ span: 24, md: 12, lg: { span: 8, offset: 4 } })
    const classes = wrapper.find('.bili-col').classes()
    expect(classes).toContain('bili-col--md-12')
    expect(classes).toContain('bili-col--lg-8')
    expect(classes).toContain('bili-col--lg-offset-4')
  })

  it('accepts a numeric responsive value', () => {
    const wrapper = mountCol({ xs: 24, sm: 12 })
    const classes = wrapper.find('.bili-col').classes()
    expect(classes).toContain('bili-col--xs-24')
    expect(classes).toContain('bili-col--sm-12')
  })

  it('toggles the nowrap class', () => {
    const wrapped = mountGrid({ wrap: true })
    expect(wrapped.find('.bili-row').classes()).toContain('is-wrap')
    const nowrap = mountGrid({ wrap: false })
    expect(nowrap.find('.bili-row').classes()).toContain('is-nowrap')
  })
})

function mountCol(props: Record<string, unknown>) {
  return mount(Row, {
    slots: { default: () => h(Col, props, () => 'content') }
  })
}
