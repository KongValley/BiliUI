import type { InjectionKey, PropType, Ref } from 'vue'

export type CarouselTrigger = 'click' | 'hover'
export type CarouselIndicatorPosition = 'inside' | 'outside' | 'none'
export type CarouselArrow = 'always' | 'hover' | 'never'
export type CarouselDirection = 'horizontal' | 'vertical'

export interface CarouselContext {
  /** Mounted item ids, kept in DOM order. */
  items: number[]
  activeIndex: Ref<number>
  direction: Ref<CarouselDirection>
  addItem: (uid: number) => void
  removeItem: (uid: number) => void
}

export const carouselContextKey: InjectionKey<CarouselContext> = Symbol('bili-carousel')

let itemSeed = 0

export const nextCarouselItemId = (): number => {
  itemSeed += 1
  return itemSeed
}

export const carouselProps = {
  /** Fixed slide height, e.g. `320px`; omit to follow the active slide. */
  height: {
    type: String,
    default: ''
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  /** How indicators activate a slide. */
  trigger: {
    type: String as PropType<CarouselTrigger>,
    default: 'click'
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  /** Autoplay interval in milliseconds. */
  interval: {
    type: Number,
    default: 3000
  },
  indicatorPosition: {
    type: String as PropType<CarouselIndicatorPosition>,
    default: 'inside'
  },
  /** When the prev/next arrows are visible. */
  arrow: {
    type: String as PropType<CarouselArrow>,
    default: 'hover'
  },
  loop: {
    type: Boolean,
    default: true
  },
  direction: {
    type: String as PropType<CarouselDirection>,
    default: 'horizontal'
  },
  /** Pause autoplay while the pointer is over the carousel. */
  pauseOnHover: {
    type: Boolean,
    default: true
  }
} as const
