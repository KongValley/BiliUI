<script setup lang="ts">
const crumbs = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/components/button' },
  { label: '导航', href: '/components/menu' },
  { label: '面包屑' }
]

const longCrumbs = [
  { label: '工作台', href: '/' },
  { label: '项目管理', href: '/projects' },
  { label: 'Bili UI', href: '/projects/bili' },
  { label: '迭代计划', href: '/projects/bili/sprints' },
  { label: 'Sprint 24' }
]
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">基础用法</span>
      <BiliBreadcrumb>
        <BiliBreadcrumbItem v-for="crumb in crumbs" :key="crumb.label" :href="crumb.href">
          {{ crumb.label }}
        </BiliBreadcrumbItem>
      </BiliBreadcrumb>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">自定义分隔符</span>
      <BiliBreadcrumb separator="›">
        <BiliBreadcrumbItem v-for="crumb in crumbs" :key="crumb.label" :href="crumb.href">
          {{ crumb.label }}
        </BiliBreadcrumbItem>
      </BiliBreadcrumb>
      <BiliBreadcrumb>
        <BiliBreadcrumbItem v-for="crumb in crumbs" :key="crumb.label" :href="crumb.href">
          {{ crumb.label }}
          <template #separator>
            <span class="dot-sep">·</span>
          </template>
        </BiliBreadcrumbItem>
      </BiliBreadcrumb>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">超长折叠（max-items=3）</span>
      <BiliBreadcrumb :max-items="3">
        <BiliBreadcrumbItem v-for="crumb in longCrumbs" :key="crumb.label" :href="crumb.href">
          {{ crumb.label }}
        </BiliBreadcrumbItem>
      </BiliBreadcrumb>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.dot-sep {
  padding: 0 6px;
  color: var(--bili-text-placeholder);
}
</style>
