<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">标题层级</span>
      <BiliTitle :level="1">一级标题</BiliTitle>
      <BiliTitle :level="2">二级标题</BiliTitle>
      <BiliTitle :level="3">三级标题</BiliTitle>
      <BiliTitle :level="4">四级标题</BiliTitle>
      <BiliTitle :level="5">五级标题</BiliTitle>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">文本样式</span>
      <BiliParagraph>
        普通段落文本，支持
        <BiliText strong>加粗</BiliText>、
        <BiliText italic>斜体</BiliText>、
        <BiliText underline>下划线</BiliText>、
        <BiliText delete>删除线</BiliText>、
        <BiliText mark>高亮</BiliText> 与
        <BiliText code>inline-code</BiliText>。
      </BiliParagraph>
      <BiliParagraph type="secondary">次要说明文本，用于补充信息。</BiliParagraph>
      <BiliParagraph type="danger">危险提示文本。</BiliParagraph>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">链接与省略</span>
      <BiliSpace :size="16" align="center" wrap>
        <BiliLink href="https://example.com" target="_blank">外部链接</BiliLink>
        <BiliLink href="/guide/quickstart">内部链接</BiliLink>
        <BiliLink disabled>禁用链接</BiliLink>
      </BiliSpace>
      <BiliText ellipsis style="max-width: 280px">
        这是一段很长很长的文本，用于演示单行省略效果，超出宽度后会自动截断。
      </BiliText>
      <BiliText :ellipsis="2" style="max-width: 320px">
        这是一段两行省略的文本，内容足够长时会自动截断并显示省略号。Bili UI 的排版组件同时兼顾可读性与紧凑布局。
      </BiliText>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
