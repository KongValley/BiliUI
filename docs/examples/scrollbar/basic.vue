<script setup lang="ts">
const rows = Array.from({ length: 20 }, (_, index) => index + 1)
</script>

<template>
  <BiliSpace :size="24" align="start" wrap>
    <div class="scroll-demo">
      <div class="scroll-demo__label">纵向滚动</div>
      <BiliScrollbar height="180px" always>
        <div v-for="row in rows" :key="row" class="scroll-demo__row">
          第 {{ row }} 行内容
        </div>
      </BiliScrollbar>
    </div>

    <div class="scroll-demo scroll-demo--wide">
      <div class="scroll-demo__label">横向滚动</div>
      <BiliScrollbar height="110px" always>
        <div class="scroll-demo__strip">
          <span v-for="index in 12" :key="index" class="scroll-demo__card">
            卡片 {{ index }}
          </span>
        </div>
      </BiliScrollbar>
    </div>
  </BiliSpace>
</template>

<style scoped>
.scroll-demo {
  width: 240px;
  padding: 8px;
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

.scroll-demo--wide {
  width: 320px;
}

.scroll-demo__label {
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.scroll-demo__row {
  padding: 6px 8px;
  font-size: 13px;
  color: var(--bili-text-regular);
  border-bottom: 1px solid var(--bili-border-color-lighter);
}

.scroll-demo__strip {
  display: flex;
  gap: 8px;
  width: max-content;
  padding: 4px;
}

.scroll-demo__card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 64px;
  font-size: 13px;
  background-color: var(--bili-fill-color-light);
  border-radius: var(--bili-radius-base);
}
</style>
