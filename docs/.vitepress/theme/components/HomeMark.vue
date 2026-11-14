<script setup lang="ts">
defineProps<{ compact?: boolean }>()
</script>

<template>
  <div class="home-mark" :class="{ 'is-compact': compact }" aria-hidden="true">
    <span class="home-mark__petal" /><span class="home-mark__petal" />
    <span class="home-mark__petal" /><span class="home-mark__petal" />
    <span class="home-mark__petal" /><span class="home-mark__petal" />
    <span class="home-mark__center" />
  </div>
</template>

<style scoped>
.home-mark {
  position: relative;
  flex: none;
  width: 92px;
  height: 92px;
  margin: 0 16px 0 8px;
  transform: scale(0.84) rotate(-14deg);
}

.home-mark__petal {
  position: absolute;
  top: 4px;
  left: 43px;
  width: 26px;
  height: 49px;
  background: var(--bili-color-primary);
  border-radius: 65% 65% 50% 50%;
  transform-origin: 13px 51px;
}

.home-mark__petal:nth-child(2) { transform: rotate(60deg); }
.home-mark__petal:nth-child(3) { transform: rotate(120deg); }
.home-mark__petal:nth-child(4) { transform: rotate(180deg); }
.home-mark__petal:nth-child(5) { transform: rotate(240deg); }
.home-mark__petal:nth-child(6) { transform: rotate(300deg); }

.home-mark__center {
  position: absolute;
  top: 42px;
  left: 42px;
  width: 28px;
  height: 28px;
  background: var(--bili-color-primary-light);
  border: 2px solid var(--bili-bg-container);
  border-radius: 50%;
}

.home-mark.is-compact {
  width: 56px;
  height: 64px;
  margin: 0;
  transform: scale(0.54) rotate(-14deg);
}
</style>
