<script setup lang="ts">
import { ref } from 'vue'

const shadow = ref<'always' | 'hover' | 'never'>('hover')
const loading = ref(false)

const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace wrap>
      <BiliButton size="sm" :type="shadow === 'always' ? 'primary' : 'default'" @click="shadow = 'always'">
        常显阴影
      </BiliButton>
      <BiliButton size="sm" :type="shadow === 'hover' ? 'primary' : 'default'" @click="shadow = 'hover'">
        悬停阴影
      </BiliButton>
      <BiliButton size="sm" :type="shadow === 'never' ? 'primary' : 'default'" @click="shadow = 'never'">
        无阴影
      </BiliButton>
      <BiliButton size="sm" @click="reload">模拟加载</BiliButton>
    </BiliSpace>

    <div class="card-grid">
      <BiliCard :shadow="shadow" hoverable title="可悬停卡片" extra="点击查看">
        <p>开启 hoverable 后卡片会上浮 2px 并加深阴影。</p>
      </BiliCard>

      <BiliCard :shadow="shadow" :loading="loading" title="加载状态">
        <p>loading 会在内容上方覆盖一层遮罩，并阻止内部指针事件。</p>
      </BiliCard>

      <BiliCard :shadow="shadow" :bordered="false" size="lg" title="无边框大号">
        <p>bordered=false 去掉描边，size="lg" 加大内边距与标题字号。</p>
      </BiliCard>
    </div>

    <BiliCard :shadow="shadow" body-flush title="无内边距（适合表格）">
      <BiliTable
        :data="[
          { name: '林青', role: '前端工程师' },
          { name: '陈默', role: '产品经理' }
        ]"
        :columns="[
          { prop: 'name', label: '姓名' },
          { prop: 'role', label: '角色' }
        ]"
        border
      />
    </BiliCard>
  </BiliSpace>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  width: 100%;
}

.card-grid p {
  margin: 0;
}
</style>
