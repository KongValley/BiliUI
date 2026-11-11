import { withInstall } from '../../utils/install'
import Text from './src/text.vue'
import Title from './src/title.vue'
import Paragraph from './src/paragraph.vue'
import Link from './src/link.vue'

export const BiliText = withInstall(Text)
export const BiliTitle = withInstall(Title)
export const BiliParagraph = withInstall(Paragraph)
export const BiliLink = withInstall(Link)

export * from './src/typography'
