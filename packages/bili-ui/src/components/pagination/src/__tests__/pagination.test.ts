import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../pagination.vue'

describe('BiliPagination', () => {
  it('renders page buttons and total', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, layout: 'total, prev, pager, next' }
    })
    expect(wrapper.text()).toContain('共 100 条')
    expect(
      wrapper.findAll('.bili-pagination__pager button:not(.bili-pagination__more)')
    ).toHaveLength(7)
  })

  it('emits the next page', async () => {
    const wrapper = mount(Pagination, { props: { total: 100, currentPage: 1 } })
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([2])
    expect(wrapper.emitted('current-change')?.[0]).toEqual([2])
  })

  it('jumps to a clicked page', async () => {
    const wrapper = mount(Pagination, { props: { total: 100, currentPage: 1 } })
    const pageButtons = wrapper.findAll('.bili-pagination__pager button')
    await pageButtons[4].trigger('click')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([5])
  })

  it('disables prev on the first page', () => {
    const wrapper = mount(Pagination, { props: { total: 100, currentPage: 1 } })
    expect(wrapper.find('[aria-label="上一页"]').attributes('disabled')).toBeDefined()
  })

  it('emits page size changes and resets to page one', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, currentPage: 3, pageSize: 10, layout: 'sizes, pager' }
    })
    await wrapper.find('.bili-pagination__select').setValue('20')
    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([20])
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([1])
    expect(wrapper.emitted('size-change')?.[0]).toEqual([20])
  })

  it('hides itself on single page when requested', () => {
    const wrapper = mount(Pagination, {
      props: { total: 5, pageSize: 10, hideOnSinglePage: true }
    })
    expect(wrapper.find('.bili-pagination').exists()).toBe(false)
  })
})
