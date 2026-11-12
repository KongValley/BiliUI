<script setup lang="ts">
const boxes = ['1', '2', '3']
const tags = ['Vue', 'TypeScript', 'Vite', 'SCSS', 'Vitest', 'VitePress']
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliFlex gap="middle" justify="space-between" align="center" class="row">
      <div v-for="item in boxes" :key="item" class="box">项目 {{ item }}</div>
    </BiliFlex>

    <BiliFlex vertical gap="small" class="row">
      <div class="bar">纵向排列</div>
      <div class="bar bar--muted">gap="small"</div>
    </BiliFlex>

    <BiliFlex gap="small" wrap>
      <BiliTag v-for="tag in tags" :key="tag" type="primary">{{ tag }}</BiliTag>
    </BiliFlex>
  </BiliSpace>
</template>

<style scoped>
.row {
  padding: 12px;
  background: var(--bili-fill-color);
  border-radius: 8px;
}

.box {
  flex: 1;
  padding: 10px 12px;
  color: var(--bili-color-on-primary);
  text-align: center;
  background: var(--bili-color-primary);
  border-radius: 6px;
}

.bar {
  padding: 8px 12px;
  color: var(--bili-text-regular);
  background: var(--bili-bg-color);
  border-radius: 6px;
}

.bar--muted {
  color: var(--bili-text-secondary);
}
</style>
