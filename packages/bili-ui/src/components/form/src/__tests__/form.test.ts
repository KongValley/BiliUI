import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Form from '../form.vue'
import FormItem from '../form-item.vue'
import Input from '../../../input/src/input.vue'
import type { FormRules } from '../types'

const createForm = (rules: FormRules, model: Record<string, any>) =>
  mount({
    components: { Form, FormItem, Input },
    template: `
      <Form ref="formRef" :model="model" :rules="rules">
        <FormItem prop="name" label="名称">
          <Input v-model="model.name" />
        </FormItem>
        <FormItem prop="email" label="邮箱">
          <Input v-model="model.email" />
        </FormItem>
      </Form>
    `,
    data: () => ({ model, rules })
  })

describe('BiliForm', () => {
  it('validates required fields', async () => {
    const wrapper = createForm(
      {
        name: [{ required: true, message: '请输入名称' }]
      },
      { name: '', email: '' }
    )

    const form = (wrapper.vm.$refs as any).formRef
    const valid = await form.validate()
    await nextTick()

    expect(valid).toBe(false)
    expect(wrapper.text()).toContain('请输入名称')
  })

  it('passes after filling valid values', async () => {
    const wrapper = createForm(
      {
        name: [{ required: true, message: '请输入名称' }],
        email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'change' }]
      },
      { name: '', email: '' }
    )

    const form = (wrapper.vm.$refs as any).formRef
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Alice')
    await inputs[1].setValue('alice@example.com')

    const valid = await form.validate()
    await nextTick()
    expect(valid).toBe(true)
    expect(wrapper.text()).not.toContain('邮箱格式不正确')
  })

  it('reports invalid email on change', async () => {
    const wrapper = createForm(
      {
        email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'change' }]
      },
      { name: '', email: '' }
    )

    const inputs = wrapper.findAll('input')
    await inputs[1].setValue('not-an-email')
    await nextTick()

    expect(wrapper.text()).toContain('邮箱格式不正确')
  })

  it('supports asynchronous custom validators', async () => {
    const wrapper = createForm(
      {
        name: [
          {
            validator: async (value: any) => {
              await new Promise(resolve => setTimeout(resolve, 10))
              return value === 'taken' ? '名称已被占用' : true
            }
          }
        ]
      },
      { name: 'taken', email: '' }
    )

    const form = (wrapper.vm.$refs as any).formRef
    const valid = await form.validate()
    await nextTick()

    expect(valid).toBe(false)
    expect(wrapper.text()).toContain('名称已被占用')
  })

  it('resets fields to their initial values', async () => {
    const wrapper = createForm({}, { name: 'Alice', email: '' })
    const form = (wrapper.vm.$refs as any).formRef
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Bob')
    expect((inputs[0].element as HTMLInputElement).value).toBe('Bob')

    form.resetFields()
    await nextTick()
    expect((wrapper.findAll('input')[0].element as HTMLInputElement).value).toBe('Alice')
  })
})
