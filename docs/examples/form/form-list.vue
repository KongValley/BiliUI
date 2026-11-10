<script setup lang="ts">
import { reactive } from 'vue'

const roles = [
  { label: '开发', value: 'dev' },
  { label: '设计', value: 'design' },
  { label: '产品', value: 'product' }
]

const model = reactive({
  members: [{ name: '', role: 'dev' }]
})
</script>

<template>
  <BiliForm :model="model" label-width="64px" style="max-width: 640px">
    <BiliFormItem label="成员" prop="members">
      <BiliFormList v-model="model.members">
        <template #default="{ index, remove }">
          <div class="member-row">
            <BiliFormItem
              prop="name"
              :rules="{ required: true, message: '请输入姓名' }"
              class="member-name"
            >
              <BiliInput v-model="model.members[index].name" placeholder="姓名" />
            </BiliFormItem>
            <BiliFormItem prop="role" class="member-role">
              <BiliSelect v-model="model.members[index].role" :options="roles" />
            </BiliFormItem>
            <BiliButton size="sm" @click="remove(index)">删除</BiliButton>
          </div>
        </template>

        <template #footer="{ add }">
          <BiliButton size="sm" type="primary" plain @click="add()">添加成员</BiliButton>
        </template>
      </BiliFormList>
    </BiliFormItem>

    <BiliFormItem>
      <BiliButton type="primary">提交</BiliButton>
    </BiliFormItem>
  </BiliForm>
</template>

<style scoped>
.member-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
}

.member-name {
  flex: 1;
}

.member-role {
  width: 150px;
}
</style>
