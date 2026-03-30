import DefaultTheme from 'vitepress/theme'
import ArticleCard from './components/ArticleCard.vue'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ArticleCard', ArticleCard)
  }
}