import { defineConfig } from 'vitepress'

// 🔴 关键配置：把下面的 /my-tech-blogs/ 换成你的仓库名！
// 格式必须是 /仓库名/，比如你的仓库叫 my-tech-blogs，就填 /my-tech-blogs/
const repoName = '/my-tech-blogs/'

// 本地开发使用根路径，生产环境使用仓库名路径
const base = process.env.NODE_ENV === 'production' ? repoName : '/'

export default defineConfig({
  // 网站基础路径（GitHub Pages 必须配置，否则样式会错乱）
  base: base,
  // 网站标题
  title: "我的技术博客",
  // 网站描述
  description: "后端开发、架构、AI 编程与技术教程",
  // 显示最后更新时间
  lastUpdated: true,

  themeConfig: {
    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '技术指南', link: '/guide/intro' },
      { text: '博客文章', link: '/articles/' },
      { text: '关于我', link: '/about' }
    ],

    // 侧边栏配置（按目录分组）
    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '介绍', link: '/guide/intro' },
            { text: '环境搭建', link: '/guide/env' },
          ]
        },
        {
          text: '开发技巧',
          items: [
            { text: 'VS Code 配置', link: '/guide/vscode' },
            { text: 'Git 常用命令', link: '/guide/git' },
          ]
        }
      ],
      '/articles/': [
        {
          text: '技术博客',
          collapsible: true,
          collapsed: false,
          items: [
            { text: 'Docker 容器部署个人服务最佳实践', link: '/articles/docker-deploy/' },
            { text: '轻量级代码仓库 Gitea 本地搭建教程', link: '/articles/gitea/' },
            { text: 'Linux 常用高效运维命令合集', link: '/articles/linux-commands/' }
          ]
        }
      ]
    },

    // 社交链接（GitHub 图标）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hf-zhangyang/my-tech-blog.git' }
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
    appearance: true, // 开启明暗模式切换
    lastUpdatedText: '更新于',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  }
})