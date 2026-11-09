<script setup lang="ts">
import { ref } from 'vue'

const enabled = ref(true)
const mode = ref('dark')
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliSpace wrap>
      <BiliSwitch v-model="enabled" active-text="开启" inactive-text="关闭" />
      <BiliSwitch v-model="enabled" disabled />
      <BiliSwitch :model-value="true" loading />
    </BiliSpace>

    <BiliSpace wrap>
      <BiliSwitch
        v-model="mode"
        active-value="dark"
        inactive-value="light"
        active-text="暗色"
        inactive-text="亮色"
      />
      <span class="value-text">主题：{{ mode }}</span>
    </BiliSpace>

    <BiliSpace wrap>
      <BiliSwitch :model-value="false" size="sm" />
      <BiliSwitch :model-value="true" />
      <BiliSwitch :model-value="true" size="lg" />
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.value-text {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
