import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ArticlesList from './components/ArticlesList.vue'
import HomeLatestPosts from './components/HomeLatestPosts.vue'
import BgmPlayer from './components/BgmPlayer.vue'
import LegacyRedirect from './components/LegacyRedirect.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ArticlesList', ArticlesList)
    app.component('HomeLatestPosts', HomeLatestPosts)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 旧文章链接的 404 兜底跳转（仅在 404 页生效）
      'layout-top': () => h(LegacyRedirect),
      'layout-bottom': () => h(BgmPlayer)
    })
  }
}
