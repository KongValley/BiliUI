<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BiliMessage } from 'bili-ui'

const formRef = ref()
const model = reactive({
  username: '',
  email: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '长度为 3-16 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ]
}

const submit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    BiliMessage.success('提交成功')
  }
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <BiliForm
    ref="formRef"
    :model="model"
    :rules="rules"
    label-width="80px"
    style="max-width: 460px"
  >
    <BiliFormItem label="用户名" prop="username">
      <BiliInput v-model="model.username" placeholder="3-16 个字符" />
    </BiliFormItem>
    <BiliFormItem label="邮箱" prop="email">
      <BiliInput v-model="model.email" placeholder="you@example.com" />
    </BiliFormItem>
    <BiliFormItem label="密码" prop="password">
      <BiliInput
        v-model="model.password"
        type="password"
        show-password
        placeholder="至少 6 位"
      />
    </BiliFormItem>
    <BiliFormItem>
      <BiliSpace>
        <BiliButton type="primary" @click="submit">提交</BiliButton>
        <BiliButton @click="reset">重置</BiliButton>
      </BiliSpace>
    </BiliFormItem>
  </BiliForm>
</template>
