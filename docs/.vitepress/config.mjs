import { defineConfig } from 'vitepress'
import { articleList, generateSidebar } from '../articles/articles.js'

// 🔴 关键配置：GitHub Pages 路径必须是 /仓库名/
const repoName = '/JackBlogs/' // 对应仓库 https://github.com/hf-zhangyang/JackBlogs

// 根据环境变量判断是否为生产环境
const isProduction = process.env.NODE_ENV === 'production' || process.env.CI === 'true'

// 本地开发使用根路径，生产环境使用仓库名路径
const base = isProduction ? repoName : '/'

export default defineConfig({
  // 网站基础路径（GitHub Pages 必须配置，否则样式会错乱）
  base: base,
  // 网站标题
  title: "我的技术博客",
  // 网站描述
  description: "后端开发、架构、AI 编程与技术教程",
  // 显示最后更新时间
  lastUpdated: true,

  // 公共资源目录
  publicDir: 'public',

  themeConfig: {
    // 文章列表配置（供首页内容导航使用）
    articleList: articleList,

    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/articles/' },
      { text: '关于我', link: '/about' }
    ],

    // 侧边栏配置（自动从文章列表生成）
    sidebar: generateSidebar(),

    // 社交链接（GitHub 图标）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hf-zhangyang/JackBlogs' }
    ],

    // 页脚信息
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 我的技术博客'
    },

    // 本地搜索配置（自带全文搜索）
    search: {
      provider: 'local'
    },

    // 主题配置
    appearance: false, // 关闭明暗模式切换
    lastUpdatedText: '更新于',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    // 页面右侧目录配置
    outline: {
      label: '目录',
      level: [2, 3]
    }
  }
})