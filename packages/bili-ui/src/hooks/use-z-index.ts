import { ref, type Ref } from 'vue'

let globalZIndex = 2000

export function useZIndex(): {
  currentZIndex: Ref<number>
  nextZIndex: () => number
} {
  const currentZIndex = ref(globalZIndex)

  const nextZIndex = () => {
    globalZIndex += 1
    currentZIndex.value = globalZIndex
    return globalZIndex
  }

  return { currentZIndex, nextZIndex }
}
