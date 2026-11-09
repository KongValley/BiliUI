<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BiliMessage } from 'bili-ui'

const formRef = ref()
const model = reactive({ username: '' })

const rules = {
  username: [
    {
      trigger: 'blur',
      validator: async () => {
        await new Promise(resolve => setTimeout(resolve, 600))
        return model.username === 'admin' ? '该用户名已被占用' : true
      }
    }
  ]
}

const check = async () => {
  const valid = await formRef.value.validate()
  if (valid) BiliMessage.success('校验通过')
}
</script>

<template>
  <BiliForm
    ref="formRef"
    :model="model"
    :rules="rules"
    label-position="top"
    style="max-width: 360px"
  >
    <BiliFormItem label="用户名（试试输入 admin）" prop="username">
      <BiliInput v-model="model.username" placeholder="失焦后执行异步校验" />
    </BiliFormItem>
    <BiliButton type="primary" @click="check">立即校验</BiliButton>
  </BiliForm>
</template>
