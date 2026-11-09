<script setup lang="ts">
import { iconGroups, iconNames } from 'bili-ui'

// `iconGroups` is the curated category list; anything registered elsewhere but
// missing from a group still shows up under "其他".
const grouped = Object.entries(iconGroups).map(([group, names]) => ({ group, names }))
const ungrouped = iconNames.filter(name => !Object.values(iconGroups).flat().includes(name))

if (ungrouped.length) {
  grouped.push({ group: '其他', names: ungrouped })
}
</script>

<template>
  <div class="icon-gallery">
    <section v-for="section in grouped" :key="section.group" class="icon-section">
      <h4 class="icon-section__title">
        {{ section.group }}
        <span class="icon-section__count">{{ section.names.length }}</span>
      </h4>
      <div class="icon-grid">
        <div
          v-for="name in section.names"
          :key="name"
          class="icon-item"
          :title="`<BiliIcon name=&quot;${name}&quot; />`"
        >
          <BiliIcon :name="name" :size="20" />
          <span>{{ name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.icon-gallery {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.icon-section__title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--bili-text-regular);
}

.icon-section__count {
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--bili-text-secondary);
  background: var(--bili-fill-color);
  border-radius: var(--bili-radius-round);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 14px 6px;
  overflow: hidden;
  font-size: 11px;
  color: var(--bili-text-secondary);
  border: 1px solid var(--bili-border-color-lighter);
  border-radius: 8px;
  transition:
    color var(--bili-transition-duration) var(--bili-transition-function),
    border-color var(--bili-transition-duration) var(--bili-transition-function),
    background-color var(--bili-transition-duration) var(--bili-transition-function);
}

.icon-item:hover {
  color: var(--bili-color-primary);
  background: var(--bili-color-primary-light);
  border-color: var(--bili-color-primary-hover);
}

.icon-item span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
