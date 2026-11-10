import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Steps from '../steps.vue'
import Step from '../step.vue'
import { resolveStatus } from '../context'

const mountSteps = (props: Record<string, any> = {}, count = 3) =>
  mount(Steps, {
    props: { active: 1, ...props },
    slots: {
      default: () =>
        Array.from({ length: count }, (_, index) =>
          h(Step, { title: `步骤 ${index + 1}`, description: `描述 ${index + 1}` })
        )
    }
  })

describe('steps helpers', () => {
  it('derives status from the active index', () => {
    expect(resolveStatus(0, 1, 'process')).toBe('finish')
    expect(resolveStatus(1, 1, 'process')).toBe('process')
    expect(resolveStatus(2, 1, 'process')).toBe('wait')
    expect(resolveStatus(1, 1, 'error')).toBe('error')
  })
})

describe('BiliSteps', () => {
  it('renders one step per child with derived statuses', async () => {
    const wrapper = mountSteps()
    await nextTick()
    await nextTick()

    const steps = wrapper.findAll('.bili-step')
    expect(steps).toHaveLength(3)
    expect(steps[0].classes()).toContain('bili-step--finish')
    expect(steps[1].classes()).toContain('bili-step--process')
    expect(steps[2].classes()).toContain('bili-step--wait')
  })

  it('marks finished steps with a check icon and numbers the rest', async () => {
    const wrapper = mountSteps()
    await nextTick()
    await nextTick()

    const steps = wrapper.findAll('.bili-step')
    expect(steps[0].find('svg').exists()).toBe(true)
    expect(steps[1].find('.bili-step__number').text()).toBe('2')
    expect(steps[2].find('.bili-step__number').text()).toBe('3')
  })

  it('applies explicit step status over the derived one', async () => {
    const wrapper = mount(Steps, {
      props: { active: 0 },
      slots: {
        default: () => [
          h(Step, { title: 'A', status: 'error' }),
          h(Step, { title: 'B' })
        ]
      }
    })
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('.bili-step')[0].classes()).toContain('bili-step--error')
  })

  it('hides the connector on the last step', async () => {
    const wrapper = mountSteps()
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('.bili-step')[2].classes()).toContain('is-last')
  })

  it('applies direction and simple modifiers', async () => {
    const wrapper = mountSteps({ direction: 'vertical', simple: true })
    await nextTick()

    expect(wrapper.classes()).toContain('bili-steps--vertical')
    expect(wrapper.classes()).toContain('is-simple')
  })

  it('emits update:active when a reachable step is clicked', async () => {
    const wrapper = mountSteps({ clickable: true })
    await nextTick()
    await nextTick()

    await wrapper.findAll('.bili-step')[0].trigger('click')
    expect(wrapper.emitted('update:active')?.[0]).toEqual([0])
    expect(wrapper.emitted('change')?.[0]).toEqual([0])
  })

  it('ignores clicks on waiting steps and when not clickable', async () => {
    const clickable = mountSteps({ clickable: true })
    await nextTick()
    await nextTick()
    await clickable.findAll('.bili-step')[2].trigger('click')
    expect(clickable.emitted('update:active')).toBeUndefined()

    const plain = mountSteps()
    await nextTick()
    await nextTick()
    await plain.findAll('.bili-step')[0].trigger('click')
    expect(plain.emitted('update:active')).toBeUndefined()
  })

  it('renders title and description slots', async () => {
    const wrapper = mount(Steps, {
      props: { active: 0 },
      slots: {
        default: () =>
          h(Step, null, {
            title: () => h('strong', { class: 'custom-title' }, '自定义标题'),
            description: () => h('em', { class: 'custom-desc' }, '自定义描述')
          })
      }
    })
    await nextTick()

    expect(wrapper.find('.custom-title').text()).toBe('自定义标题')
    expect(wrapper.find('.custom-desc').text()).toBe('自定义描述')
  })
})
