import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Form from '../form.vue'
import FormItem from '../form-item.vue'
import FormList from '../form-list.vue'
import Input from '../../../input/src/input.vue'
import InputNumber from '../../../input-number/src/input-number.vue'
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

  it('validates only the requested fields with validateFields', async () => {
    const wrapper = createForm(
      {
        name: [{ required: true, message: '请输入名称' }],
        email: [{ required: true, message: '请输入邮箱' }]
      },
      { name: '', email: '' }
    )
    const form = (wrapper.vm.$refs as any).formRef
    const callback = vi.fn()

    const valid = await form.validateFields('name', callback)
    await nextTick()

    expect(valid).toBe(false)
    expect(callback).toHaveBeenCalledWith(false, { name: '请输入名称' })
    expect(wrapper.text()).toContain('请输入名称')
    expect(wrapper.text()).not.toContain('请输入邮箱')

    await wrapper.findAll('input')[0].setValue('Alice')
    const callback2 = vi.fn()
    expect(await form.validateFields('name', callback2)).toBe(true)
    expect(callback2).toHaveBeenCalledWith(true, undefined)
  })

  it('re-validates fields listed in rule dependencies', async () => {
    const wrapper = mount({
      components: { Form, FormItem, Input },
      template: `
        <Form ref="formRef" :model="model">
          <FormItem prop="password" label="密码">
            <Input v-model="model.password" />
          </FormItem>
          <FormItem prop="confirm" label="确认密码" :rules="confirmRules">
            <Input v-model="model.confirm" />
          </FormItem>
        </Form>
      `,
      data: () => ({
        model: { password: '', confirm: '' },
        confirmRules: [
          {
            trigger: 'change' as const,
            dependencies: ['password'],
            validator: (value: any, _rule: any, model: Record<string, any>) =>
              value === model.password || '两次密码不一致'
          }
        ]
      })
    })

    const inputs = wrapper.findAll('input')
    await inputs[1].setValue('one')
    await flushPromises()
    expect(wrapper.text()).toContain('两次密码不一致')

    // Changing the dependency should clear the confirm error.
    await inputs[0].setValue('one')
    await flushPromises()
    expect(wrapper.text()).not.toContain('两次密码不一致')
  })

  it('prefixes nested FormList fields and supports add/remove', async () => {
    const wrapper = mount({
      components: { Form, FormItem, FormList, Input },
      template: `
        <Form ref="formRef" :model="model">
          <FormItem label="成员" prop="users">
            <FormList v-model="model.users">
              <template #default="{ index, remove }">
                <div class="member">
                  <FormItem prop="name" :rules="nameRules">
                    <Input v-model="model.users[index].name" />
                  </FormItem>
                  <button class="remove-member" type="button" @click="remove(index)">删除</button>
                </div>
              </template>
              <template #footer="{ add }">
                <button class="add-member" type="button" @click="add()">添加</button>
              </template>
            </FormList>
          </FormItem>
        </Form>
      `,
      data: () => ({
        model: { users: [{ name: '' }] },
        nameRules: { required: true, message: '请输入姓名' }
      })
    })

    const form = (wrapper.vm.$refs as any).formRef
    const callback = vi.fn()

    expect(wrapper.findAll('input')).toHaveLength(1)
    expect(await form.validateFields(undefined, callback)).toBe(false)
    await nextTick()
    expect(callback.mock.calls[0][1]).toEqual({ 'users.0.name': '请输入姓名' })

    await wrapper.find('.add-member').trigger('click')
    await nextTick()
    expect(wrapper.findAll('input')).toHaveLength(2)
    expect((wrapper.vm as any).model.users).toHaveLength(2)

    await wrapper.findAll('input')[0].setValue('Alice')
    await wrapper.findAll('input')[1].setValue('Bob')
    await flushPromises()
    expect(await form.validate()).toBe(true)

    await wrapper.findAll('.remove-member')[0].trigger('click')
    await nextTick()
    expect(wrapper.findAll('input')).toHaveLength(1)
  })

  it('validates InputNumber as a form control', async () => {
    const rules: FormRules = {
      count: [{ type: 'number', min: 10, message: '不能小于 10' }]
    }
    const wrapper = mount({
      components: { Form, FormItem, InputNumber },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem prop="count" label="数量">
            <InputNumber v-model="model.count" />
          </FormItem>
        </Form>
      `,
      data: () => ({ model: { count: 5 }, rules })
    })

    const input = wrapper.find('.bili-input-number__input')
    await input.trigger('focus')
    await input.setValue('3')
    await input.trigger('blur')
    await flushPromises()

    expect(wrapper.text()).toContain('不能小于 10')
    expect(await (wrapper.vm.$refs as any).formRef.validate()).toBe(false)
  })

  it('scrolls the first invalid field when scrollToError is on', async () => {
    const scrollSpy = vi.fn()
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = scrollSpy

    try {
      const wrapper = mount({
        components: { Form, FormItem, Input },
        template: `
          <Form
            ref="formRef"
            :model="model"
            :rules="rules"
            scroll-to-error
          >
            <FormItem prop="name" label="名称">
              <Input v-model="model.name" />
            </FormItem>
          </Form>
        `,
        data: () => ({
          model: { name: '' },
          rules: { name: [{ required: true, message: '请输入名称' }] }
        })
      })

      const form = (wrapper.vm.$refs as any).formRef
      await form.validate()
      await nextTick()
      await nextTick()

      expect(scrollSpy).toHaveBeenCalled()
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })
})
