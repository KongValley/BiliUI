import { withInstall } from '../../utils/install'
import Carousel from './src/carousel.vue'
import CarouselItem from './src/carousel-item.vue'

export const BiliCarousel = withInstall(Carousel)
export const BiliCarouselItem = withInstall(CarouselItem)

export default BiliCarousel

export * from './src/carousel'
