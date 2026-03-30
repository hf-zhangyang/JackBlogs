# 环境搭建指南

## 前置要求

在开始搭建 VitePress 博客之前，请确保你的系统已安装以下软件：

### 必需软件

1. **Node.js**
   - 推荐 Node.js 18.x 或更高版本
   - 下载地址：[https://nodejs.org/](https://nodejs.org/)

2. **包管理器**
   - npm（随 Node.js 一起安装）
   - 或 pnpm：`npm install -g pnpm`
   - 或 yarn：`npm install -g yarn`

3. **Git**
   - 下载地址：[https://git-scm.com/](https://git-scm.com/)

### 验证安装

```bash
node --version   # 应显示 v18.x.x 或更高
npm --version    # 应显示 9.x.x 或更高
git --version    # 应显示 git 版本
```

## 快速开始

### 1. 创建项目目录

```bash
mkdir my-blog
cd my-blog
```

### 2. 初始化项目

```bash
npm init -y
```

### 3. 安装 VitePress

```bash
npm install -D vitepress
```

### 4. 创建基础结构

```bash
mkdir docs
echo '# Hello World' > docs/index.md
```

### 5. 配置 VitePress

创建 `docs/.vitepress/config.js`：

```javascript
export default {
  title: '我的博客',
  description: '我的技术博客',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' }
    ]
  }
}
```

### 6. 添加开发脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
}
```

### 7. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果。

## 推荐工具

### 代码编辑器

- **VS Code**：推荐安装插件
  - VitePress
  - Markdown All in One
  - French Press Preview

### Markdown 编辑器

- **Typora**：所见即所得
- **Obsidian**：知识管理
- **Mark Text**：开源免费

## 部署环境

### GitHub Pages

1. 创建 GitHub 仓库
2. 配置 GitHub Actions
3. 推送代码自动部署

### Vercel

1. 连接 GitHub 仓库
2. 自动检测 VitePress
3. 一键部署

### Netlify

1. 连接 GitHub 仓库
2. 配置构建命令
3. 自动部署

## 常见问题

### Node.js 版本问题

```bash
# 使用 nvm 管理 Node.js 版本
nvm install 18
nvm use 18
```

### 端口冲突

```bash
# 使用其他端口
npm run dev -- --port 3000
```

### 构建失败

```bash
# 清除缓存重新安装
rm -rf node_modules
npm install
```

## 下一步

环境搭建完成后，你可以：

1. 配置主题和样式
2. 添加自定义组件
3. 编写博客文章
4. 配置自动部署

祝你搭建顺利！