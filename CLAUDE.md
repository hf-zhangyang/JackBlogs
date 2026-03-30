# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 **VitePress 1.0** 的技术博客网站，专注后端开发、容器化、Linux 运维和微服务架构。内容部署在 GitHub Pages。

## 开发命令

```bash
# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本（输出到 docs/.vitepress/dist/）
npm run build

# 预览构建结果
npm run preview
```

## 核心架构

### 技术栈
- **VitePress 1.0** - 基于 Vue 3 的静态网站生成器
- **Vue 3 Composition API** - 自定义组件使用 `<script setup>` 语法
- **GitHub Pages** - 生产环境部署

### 项目结构
```
docs/
├── .vitepress/
│   ├── config.mjs          # 站点配置（导航、侧边栏、base 路径）
│   └── theme/              # 自定义主题扩展
│       ├── index.js        # 主题入口，注册全局组件
│       ├── style.css       # 全局样式
│       └── components/
│           └── ArticleCard.vue  # 首页文章卡片组件
└── index.md                # 首页（frontmatter + Vue 组件）
```

### VitePress 主题扩展机制

本项目使用 VitePress 默认主题（DefaultTheme），通过 `docs/.vitepress/theme/index.js` 扩展：

```javascript
import DefaultTheme from 'vitepress/theme'
import ArticleCard from './components/ArticleCard.vue'

export default {
  ...DefaultTheme,  // 继承默认主题
  enhanceApp({ app }) {
    app.component('ArticleCard', ArticleCard)  // 注册全局组件
  }
}
```

**关键点**：
- 必须展开 `...DefaultTheme` 以保留默认功能
- 使用 `enhanceApp` 钩子注册自定义 Vue 组件
- 组件可在任何 Markdown 文件中直接使用（无需 import）

### 首页实现

首页使用 VitePress 的 `layout: home` 和 frontmatter 配置：

```yaml
---
layout: home
hero:
  name: "ShenChuanChao"
  text: "个人技术博客"
  tagline: 专注后端开发、容器、Linux 与微服务实践
  actions:
    - theme: brand
      text: 全部文章 →
      link: /articles/
features:
  - title: 🐳 容器与运维
    details: Docker、K8s、PVE、Linux 运维实践与部署笔记
---
```

在 Markdown 中混合使用 Vue 组件：

```markdown
<div class="article-list">
<ArticleCard
  title="文章标题"
  date="2026-03-30"
  desc="文章描述"
  link="/articles/slug/"
/>
</div>
```

## 关键配置

### base 路径配置
在 `docs/.vitepress/config.mjs` 中：

```javascript
const repoName = '/my-tech-blog/'  // 必须与仓库名一致
export default defineConfig({
  base: repoName,  // GitHub Pages 部署必须配置
  // ...
})
```

### 导航和侧边栏
- **顶部导航**：在 `themeConfig.nav` 配置
- **侧边栏**：在 `themeConfig.sidebar` 按路径分组配置
- **本地搜索**：已启用 `search: { provider: 'local' }`

## 内容添加流程

1. 创建新的 Markdown 文件（如 `docs/articles/docker-optimization.md`）
2. 在首页 `docs/index.md` 添加 `<ArticleCard>` 组件
3. 如需分类，在 `config.mjs` 的 `sidebar` 配置中添加链接

## 重要注意事项

- **Vue 组件**：全部使用 Composition API 的 `<script setup>` 语法
- **样式作用域**：组件样式使用 `<style scoped>` 避免污染全局
- **主题定制**：优先扩展现有主题而非完全重写
- **路径配置**：修改仓库后必须同步更新 `config.mjs` 中的 `repoName`
