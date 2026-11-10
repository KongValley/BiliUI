<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  password: '',
  confirm: ''
})

const confirmRules = [
  {
    trigger: 'change' as const,
    dependencies: ['password'],
    validator: (value: string, _rule: any, formModel: Record<string, any>) =>
      value === formModel.password || '两次输入的密码不一致'
  }
]
</script>

<template>
  <BiliForm :model="model" label-position="top" style="max-width: 360px">
    <BiliFormItem label="密码" prop="password">
      <BiliInput v-model="model.password" type="password" show-password />
    </BiliFormItem>
    <BiliFormItem
      label="确认密码"
      prop="confirm"
      :rules="confirmRules"
    >
      <BiliInput v-model="model.confirm" type="password" show-password />
    </BiliFormItem>
  </BiliForm>
</template>
