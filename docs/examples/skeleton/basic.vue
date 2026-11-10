<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
const rows = ref(3)

const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1400)
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">基础骨架 / 头像组合</span>
      <BiliSpace :size="24" align="flex-start" wrap>
        <BiliSkeleton :rows="3" style="width: 260px" animated />
        <BiliSkeleton :rows="2" avatar style="width: 260px" animated />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">自定义组合</span>
      <div class="card-skeleton">
        <BiliSkeletonItem variant="image" />
        <BiliSkeletonItem variant="text" width="70%" height="18px" />
        <BiliSkeletonItem variant="text" />
        <BiliSkeletonItem variant="text" width="55%" />
        <BiliSkeletonItem variant="button" />
      </div>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">加载态切换</span>
      <BiliSkeleton :loading="loading" :rows="rows" avatar>
        <div class="loaded">
          <strong>Bili UI</strong>
          <p>内容加载完成后替换骨架屏，布局不会跳动。</p>
        </div>
      </BiliSkeleton>
      <BiliSpace :size="8">
        <BiliButton size="sm" @click="reload">重新加载</BiliButton>
        <BiliButton size="sm" plain @click="rows = rows === 3 ? 5 : 3">
          切换为 {{ rows === 3 ? 5 : 3 }} 行
        </BiliButton>
      </BiliSpace>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 240px;
}

.loaded {
  padding: 4px 0;
  color: var(--bili-text-regular);

  p {
    margin: 6px 0 0;
  }
}
</style>
