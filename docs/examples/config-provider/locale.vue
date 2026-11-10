<script setup lang="ts">
const locale = {
  confirm: 'OK',
  cancel: 'Back',
  prev: 'Previous',
  next: 'Next',
  finish: 'Done',
  total: 'Total {total}',
  pageSize: '{size} / page',
  pageSizeLabel: 'Page size',
  prevPage: 'Previous page',
  nextPage: 'Next page',
  jumpTo: 'Go to',
  jumpToPage: 'Jump to page',
  page: 'page'
}
</script>

<template>
  <BiliConfigProvider :locale="locale">
    <BiliSpace direction="vertical" :size="16">
      <BiliSpace align="center" wrap>
        <BiliPopconfirm content="确认删除这条记录？">
          <BiliButton type="danger" plain>删除</BiliButton>
        </BiliPopconfirm>
        <span class="hint">确认 / 取消按钮文案来自 ConfigProvider</span>
      </BiliSpace>

      <BiliPagination
        :total="120"
        :page-size="10"
        :current-page="2"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </BiliSpace>
  </BiliConfigProvider>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
