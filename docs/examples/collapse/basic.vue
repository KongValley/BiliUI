<script setup lang="ts">
import { ref } from 'vue'

const open = ref(['basic'])
const accordion = ref('a')
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">基础用法 / 多面板展开</span>
      <BiliCollapse v-model="open">
        <BiliCollapseItem name="basic" title="什么是 Bili UI？">
          Bili UI 是一套基于 Vue 3 与 TypeScript 的 PC 端组件库，内置亮暗双主题与三层设计令牌。
        </BiliCollapseItem>
        <BiliCollapseItem name="install" title="如何安装？">
          <code>pnpm add bili-ui</code>，然后在入口中 <code>app.use(BiliUI)</code>。
        </BiliCollapseItem>
        <BiliCollapseItem name="theme" title="自定义主题" icon="settings">
          覆盖 <code>--bili-color-primary</code> 等语义变量即可完成换肤。
        </BiliCollapseItem>
        <BiliCollapseItem name="disabled" title="禁用示例" disabled>
          这个面板无法展开。
        </BiliCollapseItem>
      </BiliCollapse>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">手风琴模式</span>
      <BiliCollapse v-model="accordion" accordion>
        <BiliCollapseItem name="a" title="第一节">
          手风琴模式下同一时间只会展开一个面板。
        </BiliCollapseItem>
        <BiliCollapseItem name="b" title="第二节">
          展开这一节时，上一节会自动收起。
        </BiliCollapseItem>
        <BiliCollapseItem name="c" title="第三节">
          再次点击已展开的面板可以收起。
        </BiliCollapseItem>
      </BiliCollapse>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

code {
  padding: 1px 6px;
  font-family: var(--bili-font-family-mono);
  font-size: 12px;
  background: var(--bili-fill-color-light);
  border-radius: 4px;
}
</style>
