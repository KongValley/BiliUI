<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { paginationProps } from './pagination'

defineOptions({ name: 'BiliPagination' })

const props = defineProps(paginationProps)

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  'current-change': [value: number]
  'size-change': [value: number]
  change: [currentPage: number, pageSize: number]
}>()

const ns = useNamespace('pagination')
const jumpValue = ref('')

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, props.pageSize))))

const currentPageValue = computed(() =>
  Math.min(Math.max(1, props.currentPage), pageCount.value)
)

const layoutItems = computed(() =>
  (Array.isArray(props.layout) ? props.layout : props.layout.split(','))
    .map(item => item.trim())
    .filter(Boolean)
)

const normalizedPagerCount = computed(() => {
  const count = Math.max(5, props.pagerCount)
  return count % 2 === 0 ? count + 1 : count
})

type PagerItem = number | 'prev-more' | 'next-more'

const pagerItems = computed<PagerItem[]>(() => {
  const count = pageCount.value
  const pagerCount = normalizedPagerCount.value
  const current = currentPageValue.value

  if (count <= pagerCount) {
    return Array.from({ length: count }, (_, index) => index + 1)
  }

  const middle = pagerCount - 2
  let start = current - Math.floor(middle / 2)
  let end = start + middle - 1

  if (start < 2) {
    start = 2
    end = start + middle - 1
  }

  if (end > count - 1) {
    end = count - 1
    start = end - middle + 1
  }

  const items: PagerItem[] = [1]
  if (start > 2) items.push('prev-more')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < count - 1) items.push('next-more')
  items.push(count)
  return items
})

const goTo = (page: number) => {
  if (props.disabled) return
  const target = Math.min(Math.max(1, page), pageCount.value)
  if (target === currentPageValue.value) return
  emit('update:currentPage', target)
  emit('current-change', target)
  emit('change', target, props.pageSize)
}

const handlePageSizeChange = (event: Event) => {
  if (props.disabled) return
  const size = Number((event.target as HTMLSelectElement).value)
  if (!Number.isFinite(size) || size <= 0) return

  emit('update:pageSize', size)
  emit('size-change', size)

  if (currentPageValue.value !== 1) {
    emit('update:currentPage', 1)
    emit('current-change', 1)
  }
  emit('change', 1, size)
}

const handleJump = () => {
  const page = Number.parseInt(jumpValue.value, 10)
  if (!Number.isNaN(page)) goTo(page)
  jumpValue.value = ''
}
</script>

<template>
  <div
    v-if="!(hideOnSinglePage && pageCount <= 1)"
    :class="[
      ns.b(),
      ns.is('background', background),
      ns.is('small', small),
      ns.is('disabled', disabled)
    ]"
  >
    <template v-for="item in layoutItems" :key="item">
      <span v-if="item === 'total'" :class="ns.e('total')">共 {{ total }} 条</span>

      <span v-else-if="item === 'sizes'" :class="ns.e('sizes')">
        <select
          :class="ns.e('select')"
          :value="pageSize"
          :disabled="disabled"
          aria-label="每页条数"
          @change="handlePageSizeChange"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }} 条/页
          </option>
        </select>
      </span>

      <button
        v-else-if="item === 'prev'"
        :class="[ns.e('button'), ns.e('prev')]"
        type="button"
        :disabled="disabled || currentPageValue <= 1"
        aria-label="上一页"
        @click="goTo(currentPageValue - 1)"
      >
        <BiliIcon name="arrow-left" />
      </button>

      <ul v-else-if="item === 'pager'" :class="ns.e('pager')">
        <li v-for="(page, index) in pagerItems" :key="`${page}-${index}`">
          <button
            v-if="page === 'prev-more' || page === 'next-more'"
            :class="[ns.e('button'), ns.e('more')]"
            type="button"
            :disabled="disabled"
            @click="goTo(currentPageValue + (page === 'prev-more' ? -5 : 5))"
          >
            <BiliIcon name="more" />
          </button>
          <button
            v-else
            :class="[ns.e('button'), ns.is('active', page === currentPageValue)]"
            type="button"
            :disabled="disabled"
            @click="goTo(Number(page))"
          >
            {{ page }}
          </button>
        </li>
      </ul>

      <button
        v-else-if="item === 'next'"
        :class="[ns.e('button'), ns.e('next')]"
        type="button"
        :disabled="disabled || currentPageValue >= pageCount"
        aria-label="下一页"
        @click="goTo(currentPageValue + 1)"
      >
        <BiliIcon name="arrow-right" />
      </button>

      <span v-else-if="item === 'jumper'" :class="ns.e('jumper')">
        前往
        <input
          v-model="jumpValue"
          :class="ns.e('jump-input')"
          type="number"
          min="1"
          :max="pageCount"
          :disabled="disabled"
          aria-label="跳转到页码"
          @keydown.enter="handleJump"
          @blur="handleJump"
        />
        页
      </span>
    </template>
  </div>
</template>
