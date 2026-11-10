<script setup lang="ts">
import { computed, ref } from 'vue'
import apiData from '../../data/api.json'

interface ApiEntry {
  name: string
  dir: string
  description: string
  props: Array<{
    name: string
    type: string
    default: string
    required: boolean
    description: string
  }>
  events: Array<{ name: string; type: string; description: string }>
  slots: Array<{ name: string; type: string; description: string }>
  exposes: Array<{ name: string; type: string; description: string }>
}

const props = withDefaults(
  defineProps<{
    /** Render one component instead of the full reference. */
    name?: string
  }>(),
  { name: undefined }
)

const api = apiData as ApiEntry[]
const query = ref('')

const entries = computed(() => {
  const source = props.name ? api.filter(entry => entry.name === props.name) : api
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return source
  return source.filter(
    entry =>
      entry.name.toLowerCase().includes(keyword) ||
      entry.dir.toLowerCase().includes(keyword) ||
      entry.description.toLowerCase().includes(keyword)
  )
})

const showDefault = (value: string) => (!value || value === 'undefined' ? '—' : value)
</script>

<template>
  <div class="api-reference">
    <div v-if="!name" class="api-reference__toolbar">
      <input
        v-model="query"
        class="api-reference__search"
        type="search"
        placeholder="搜索组件名或目录，例如 select / date"
        aria-label="搜索组件 API"
      />
      <span class="api-reference__count">{{ entries.length }} 个组件</span>
    </div>

    <details v-for="entry in entries" :key="entry.name" class="api-entry" :open="!!name">
      <summary class="api-entry__summary">
        <span class="api-entry__name">{{ entry.name }}</span>
        <code class="api-entry__dir">{{ entry.dir }}</code>
      </summary>

      <p v-if="entry.description" class="api-entry__description">{{ entry.description }}</p>

      <template v-if="entry.props.length">
        <h4>Props</h4>
        <table class="api-table">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in entry.props" :key="prop.name">
              <td>
                <code>{{ prop.name }}</code>
                <span v-if="prop.required" class="api-required">*</span>
              </td>
              <td>
                <code>{{ prop.type }}</code>
              </td>
              <td>
                <code>{{ showDefault(prop.default) }}</code>
              </td>
              <td>{{ prop.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="entry.events.length">
        <h4>Events</h4>
        <table class="api-table">
          <thead>
            <tr>
              <th>事件名</th>
              <th>回调参数</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in entry.events" :key="event.name">
              <td>
                <code>{{ event.name }}</code>
              </td>
              <td>
                <code>{{ event.type }}</code>
              </td>
              <td>{{ event.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="entry.slots.length">
        <h4>Slots</h4>
        <table class="api-table">
          <thead>
            <tr>
              <th>插槽名</th>
              <th>参数</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in entry.slots" :key="slot.name">
              <td>
                <code>{{ slot.name }}</code>
              </td>
              <td>
                <code>{{ slot.type }}</code>
              </td>
              <td>{{ slot.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="entry.exposes.length">
        <h4>Exposes</h4>
        <table class="api-table">
          <thead>
            <tr>
              <th>方法 / 属性</th>
              <th>类型</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expose in entry.exposes" :key="expose.name">
              <td>
                <code>{{ expose.name }}</code>
              </td>
              <td>
                <code>{{ expose.type }}</code>
              </td>
              <td>{{ expose.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </details>

    <p v-if="entries.length === 0" class="api-reference__empty">没有匹配的组件。</p>
  </div>
</template>

<style scoped>
.api-reference {
  margin-top: 16px;
}

.api-reference__toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.api-reference__search {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  font: inherit;
  font-size: 13px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  outline: none;
}

.api-reference__search:focus {
  border-color: var(--vp-c-brand-1);
}

.api-reference__count {
  flex: none;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.api-entry {
  margin: 10px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.api-entry__summary {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
}

.api-entry__name {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.api-entry__dir {
  padding: 2px 6px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.api-entry__description {
  padding: 0 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.api-entry h4 {
  padding: 0 16px;
  margin: 14px 0 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.api-entry :deep(.api-table) {
  display: table;
  width: calc(100% - 32px);
  margin: 0 16px 14px;
  font-size: 12.5px;
}

.api-entry :deep(.api-table th),
.api-entry :deep(.api-table td) {
  padding: 7px 10px;
  text-align: left;
  vertical-align: top;
  border: 1px solid var(--vp-c-divider);
}

.api-entry :deep(.api-table code) {
  white-space: nowrap;
}

.api-required {
  margin-left: 2px;
  color: var(--vp-c-danger-1);
}

.api-reference__empty {
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
