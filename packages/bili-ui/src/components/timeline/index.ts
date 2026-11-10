import { withInstall } from '../../utils/install'
import Timeline from './src/timeline.vue'
import TimelineItem from './src/timeline-item.vue'

export const BiliTimeline = withInstall(Timeline)
export const BiliTimelineItem = withInstall(TimelineItem)

export default BiliTimeline

export * from './src/timeline'
