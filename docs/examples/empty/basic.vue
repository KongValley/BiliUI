<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')

const presets = ['default', 'simple', 'search', 'data'] as const
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace :size="16" wrap align="stretch">
      <div v-for="preset in presets" :key="preset" class="cell">
        <BiliEmpty :preset="preset" :description="`${preset} 预设`" />
      </div>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">带操作区 / 小尺寸</span>
      <BiliSpace :size="24" align="center" wrap>
        <BiliEmpty description="还没有创建任何项目" style="width: 240px">
          <BiliButton type="primary" size="sm" icon="plus">新建项目</BiliButton>
        </BiliEmpty>
        <BiliEmpty small preset="search" description="没有找到匹配的结果">
          <BiliButton size="sm" plain>清空筛选</BiliButton>
        </BiliEmpty>
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">搜索场景</span>
      <BiliInput v-model="search" placeholder="输入关键字搜索" clearable />
      <div class="search-result">
        <BiliEmpty
          v-if="!search"
          preset="search"
          description="输入关键字开始搜索"
        />
        <p v-else class="result-text">搜索结果：{{ search }}</p>
      </div>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.cell {
  padding: 4px;
  background: var(--bili-bg-muted);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
}

.search-result {
  min-height: 120px;
}

.result-text {
  margin: 0;
  color: var(--bili-text-regular);
}
</style>
