# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 **VitePress 1.6** 的个人技术博客网站，专注后端开发、容器化、Linux 运维和微服务架构。内容部署在 GitHub Pages。

## 开发命令

```bash
# 启动开发服务器（默认 http://localhost:5173/JackBlogs/，与生产 base 一致）
# 前置自动执行 sync
npm run dev

# 构建生产版本（输出到 docs/.vitepress/dist/），同样前置执行 sync
npm run build

# 预览构建结果
npm run preview

# 仅重新扫描目录生成文章索引
npm run sync

# 批量导入外部 Markdown（自动落盘 + 同步索引）
npm run publish -- 文章.md
npm run publish -- ./drafts/
```

## 核心架构

### 技术栈
- **VitePress 1.6** - 基于 Vue 3 的静态网站生成器
- **Vue 3 Composition API** - 自定义组件使用 `<script setup>` 语法
- **GitHub Pages** - 生产环境部署

### 项目结构
```
docs/
├── .vitepress/
│   ├── config.mjs              # 站点配置（base、导航、搜索、appearance）
│   └── theme/
│       ├── index.js            # 主题入口：注册全局组件、覆盖 home 布局、挂载 BgmPlayer
│       ├── style.css / home.css
│       ├── legacy-urls.mjs     # 旧 URL → 新 URL 映射表（404 跳转用）
│       ├── layouts/home.vue    # 自定义首页布局
│       └── components/
│           ├── HomePage.vue        # 首页三栏布局（作者信息 | 主内容 | 目录）
│           ├── ProfileCard.vue     # 左侧作者信息卡片
│           ├── HeroSection.vue     # 首页 Hero 区块
│           ├── HomeArticleList.vue # 首页文章列表（取 date 最新 3 篇）
│           ├── DocNav.vue          # 右侧目录
│           ├── ArticlesList.vue    # 文章总览页列表
│           ├── LegacyRedirect.vue  # 404 页旧链接跳转（挂在 layout-top）
│           ├── ArticleCard.vue / ArticleList.vue / ArticleListSummary.vue
│           └── BgmPlayer.vue       # 背景音乐播放器（挂载于 layout-bottom）
├── articles/
│   ├── <分类目录>/              # ⭐ 目录即分类：目录名 = URL 片段
│   │   ├── _meta.md            # 分类元数据（title 显示名 / icon / desc / order）
│   │   └── <子分类目录>/
│   │       ├── _meta.md        # 子分类元数据（title / order）
│   │       └── <文章>.md       # 文章：frontmatter title / desc / date / order
│   ├── articles.js             # ⚙️ 自动生成的索引（勿手改）
│   └── index.md                # 文章总览页
└── index.md                    # 首页（layout: page + <HomePage/>）

tools/
├── articles-scan.mjs           # 目录扫描与前端索引序列化（共享库）
├── sync-articles.mjs           # 生成 docs/articles/articles.js
├── publish.mjs                 # 批量导入外部 Markdown
└── test-legacy-urls.mjs        # 旧 URL 重定向映射表测试
```

### 数据流（核心）

**目录是唯一事实来源，`articles.js` 是生成产物**：

```
docs/articles/<分类>/<子分类>/*.md + _meta.md
        │
        │  tools/sync-articles.mjs（扫描，逻辑在 tools/articles-scan.mjs）
        ▼
docs/articles/articles.js  ──┬─→ config.mjs        生成侧边栏（generateSidebar）
                             ├─→ DocNav.vue / ArticlesList.vue   文章总览与目录树
                             └─→ HomeArticleList.vue            首页最新文章（按 date 取前 3）
```

**关键约束**：`articles.js` 同时被 **Node 端**（`config.mjs` 生成侧边栏）与 **浏览器端**（Vue 组件直接 import）消费，
因此它必须是纯数据模块、不能读文件系统 —— 这就是为什么采用"构建前生成"而不是"运行时扫描"。

**添加文章**：把 `.md` 放进 `<分类>/<子分类>/`，运行 `npm run sync`（dev / build 已内置前置）。
**新增分类**：建目录 + 写 `_meta.md`（`title` 填中文显示名）。URL 由目录名决定，显示名由 `_meta.md` 决定。

目录约定：以 `_` 或 `.` 开头的文件/目录被忽略（`_meta.md` 即元数据文件，已在 `config.mjs` 的 `srcExclude` 中排除）；
直接放在分类目录下、未归入子分类的 `.md` 会被警告并跳过——规范固定为三级。

### VitePress 主题扩展机制

本项目基于默认主题（DefaultTheme）扩展，见 `docs/.vitepress/theme/index.js`：

```javascript
export default {
  ...DefaultTheme,                      // 必须展开以保留默认功能
  enhanceApp({ app }) {                 // 注册全局组件（可在任意 md 中直接使用）
    app.component('HomePage', HomePage)
    // ... 其余组件
  },
  layouts: {
    home: HomeLayout                    // 覆盖 layout: home 的布局
  },
  Layout() {                            // 全局布局：把 BgmPlayer 挂到 layout-bottom 插槽
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(BgmPlayer)
    })
  }
}
```

### 首页实现

`docs/index.md` 使用 `layout: page` 渲染自定义组件 `<HomePage />`，
内部为三栏 grid 布局（240px | 弹性 | 260px），带 1200px / 640px 两级响应式降级，
侧栏使用 `position: sticky`。

## 内容工具链（tools/）

| 文件 | 职责 |
|------|------|
| `articles-scan.mjs` | 目录扫描库：frontmatter 解析、三级结构组装、`articles.js` 序列化。**唯一的解析实现**，被下面两个脚本复用 |
| `sync-articles.mjs` | CLI：扫描目录 → 生成 `articles.js`（内容无变化则不写盘，避免触发 Vite 无谓重载） |
| `publish.mjs` | CLI：批量导入外部 Markdown（支持多文件 / 目录递归 / `--category= --subcategory=`），导入后自动同步 |

### publish.mjs 的导入约定

```yaml
---
title: 我的新文章            # 可选，缺省取正文 H1
desc: 一句话简介             # 可选，缺省同 title
date: 2026-10-03            # 可选，缺省取文件修改时间
slug: docker-compose        # 可选，缺省由标题生成（保留中文，冲突时追加时间戳后缀）
category: 容器与运维          # 必填，支持显示名或目录名（container）
subcategory: Docker         # 必填，同上
---
```

导入后 frontmatter 会被重写为 `title/desc/date`（`category`/`subcategory` 被剥离，分类信息此后由目录承载）。
分类不存在时报错并列出可用分类，**不会自动新建目录**。

### 旧链接重定向

文章路径变动后旧 URL 会 404。主题在 404 页挂了跳转：`theme/legacy-urls.mjs`（映射表）+ `theme/components/LegacyRedirect.vue`
（经 `Layout()` 的 `layout-top` 插槽注入，仅在 `page.isNotFound` 为真时执行 `location.replace`）。

**改动任何文章路径时**：在 `legacy-urls.mjs` 补一条映射，并运行 `npm run test:legacy` 校验
（测试覆盖 `.html`/结尾斜杠/中文 percent-encoding/有无 base 的等价写法与新 URL 反例）。

## 关键配置

### base 路径
`docs/.vitepress/config.mjs` 中固定 `const base = '/JackBlogs/'`，本地 dev / preview / build 统一使用该值（不再通过 `--base` 参数覆盖），保证本地与生产行为一致。**修改仓库名后必须同步更新此值**。

### 其他配置
- **本地搜索**：`themeConfig.search: { provider: 'local' }`
- **明暗模式**：顶层 `appearance: false` 关闭切换（注意是顶层配置项，不属于 themeConfig）
- **源文件排除**：顶层 `srcExclude: ['**/_meta.md', '**/README.md']`，避免元数据文件生成页面
- **页脚 / 上一篇下一篇 / 目录层级**：均在 `themeConfig` 中配置

### 仓库卫生
`.gitignore` 已忽略 `node_modules/`、`docs/.vitepress/dist/`、`docs/.vitepress/cache/`、`.workbuddy/`。
构建产物由 CI 生成（`.github/workflows/deploy.yml`），不需要提交；`.workbuddy/` 内含跨项目工作笔记，不应进入公开仓库。

## 重要注意事项

- **Vue 组件**：全部使用 Composition API 的 `<script setup>` 语法
- **样式作用域**：组件样式使用 `<style scoped>` 避免污染全局
- **目录即分类**：分类结构改动落在目录 + `_meta.md` 上；`articles.js` 是生成产物，**禁止手工编辑**（会被下次 `npm run sync` 覆盖）
- **不要在组件里硬编码文章数据**：所有列表/导航都从 `articleList` 读取
- **URL 即文件路径**：移动或重命名文章文件会导致旧链接失效，务必同步更新 `theme/legacy-urls.mjs` 并跑 `npm run test:legacy`
- **Markdown 中的 `<T>` 必须用行内代码包裹**：VitePress 把 md 当 Vue 模板编译，裸写 `Lazy<T>` 会被当作未注册组件（写成 `` `Lazy<T>` ``）
- **主题定制**：优先扩展现有主题而非完全重写
- **路径配置**：修改仓库名后必须同步更新 `config.mjs` 中的 `base`
