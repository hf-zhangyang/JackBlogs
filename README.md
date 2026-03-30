# 我的技术博客

这是一个基于 [VitePress](https://vitepress.dev/) 构建的个人技术博客，部署在 GitHub Pages 上。

## ✨ 特性

- 🚀 **VitePress 1.0** - 基于 Vue 3 的静态网站生成器
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔍 **全文搜索** - 内置本地搜索功能
- 🎨 **自定义主题** - 基于 VitePress 默认主题扩展
- 📝 **Markdown 支持** - 丰富的 Markdown 语法和组件

## 🛠️ 技术栈

- **框架**: VitePress 1.0
- **前端**: Vue 3 (Composition API)
- **部署**: GitHub Pages
- **构建**: Vite

## 📦 项目结构

```
my-tech-blogs/
├── docs/                      # 文档源文件
│   ├── .vitepress/            # VitePress 配置
│   │   ├── config.mjs         # 站点配置
│   │   └── theme/             # 主题扩展
│   │       ├── index.js       # 主题入口
│   │       ├── style.css      # 全局样式
│   │       └── components/    # Vue 组件
│   │           └── ArticleCard.vue
│   ├── articles/              # 博客文章
│   ├── guide/                 # 指南文档
│   ├── index.md               # 首页
│   └── public/                # 静态资源
├── .github/                   # GitHub 配置
│   └── workflows/             # GitHub Actions
│       └── deploy.yml         # 自动部署配置
├── package.json               # 项目依赖
└── README.md                  # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或其他包管理器

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `docs/.vitepress/dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

## 📝 添加新文章

1. 在 `docs/articles/` 目录下创建新的 Markdown 文件
2. 在首页 `docs/index.md` 中添加文章卡片
3. 在 `docs/.vitepress/config.mjs` 的 `sidebar` 配置中添加链接

### 文章模板

```markdown
---
title: 文章标题
date: 2026-03-30
tags: ['标签1', '标签2']
---

# 文章标题

文章内容...
```

## 🎨 自定义组件

项目包含自定义 Vue 组件，位于 `docs/.vitepress/theme/components/`。

### ArticleCard 组件

用于首页显示文章卡片：

```markdown
<ArticleCard
  title="文章标题"
  date="2026-03-30"
  desc="文章描述"
  link="/articles/slug/"
/>
```

## 🌐 部署

### GitHub Pages

项目已配置 GitHub Actions 自动部署，推送到 `main` 分支后自动构建并部署。

确保在 GitHub 仓库设置中：

1. **Settings** > **Pages**
2. **Source** 选择 **GitHub Actions**

### 手动部署

```bash
npm run build
# 将 docs/.vitepress/dist/ 目录内容部署到你的服务器
```

## ⚙️ 配置

### 修改站点信息

编辑 `docs/.vitepress/config.mjs`：

```javascript
export default defineConfig({
  title: "我的技术博客",      // 站点标题
  description: "技术博客",    // 站点描述
  base: '/my-tech-blogs/',    // 基础路径（与仓库名一致）
  // ...
})
```

### 修改导航和侧边栏

在 `config.mjs` 的 `themeConfig` 中配置：

```javascript
themeConfig: {
  nav: [
    { text: '首页', link: '/' },
    // 添加更多导航项
  ],
  sidebar: {
    '/articles/': [
      // 配置侧边栏
    ]
  }
}
```

## 📄 许可证

[MIT License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- GitHub: [@hf-zhangyang](https://github.com/hf-zhangyang)
- Email: your-email@example.com

---

**使用 VitePress 构建** - [查看文档](https://vitepress.dev/)