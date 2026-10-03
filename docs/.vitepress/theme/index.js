import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ArticleCard from './components/ArticleCard.vue'
import ArticleList from './components/ArticleList.vue'
import ArticleListSummary from './components/ArticleListSummary.vue'
import ProfileCard from './components/ProfileCard.vue'
import DocNav from './components/DocNav.vue'
import BgmPlayer from './components/BgmPlayer.vue'
import HomePage from './components/HomePage.vue'
import HomeLayout from './layouts/home.vue'
import ArticlesList from './components/ArticlesList.vue'
import LegacyRedirect from './components/LegacyRedirect.vue'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('ArticleCard', ArticleCard)
    app.component('ArticleList', ArticleList)
    app.component('ArticleListSummary', ArticleListSummary)
    app.component('ProfileCard', ProfileCard)
    app.component('DocNav', DocNav)
    app.component('BgmPlayer', BgmPlayer)
    app.component('HomePage', HomePage)
    app.component('ArticlesList', ArticlesList)
  },
  layouts: {
    home: HomeLayout
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 旧文章链接的 404 兜底跳转（仅在 404 页生效）
      'layout-top': () => h(LegacyRedirect),
      'layout-bottom': () => h(BgmPlayer)
    })
  }
}

