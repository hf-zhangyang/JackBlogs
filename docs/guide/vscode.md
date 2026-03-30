# VS Code 配置指南

## 概述

VS Code 是一款轻量级但功能强大的代码编辑器，特别适合前端和 Markdown 编辑。

## 推荐插件

### Markdown 编辑

1. **Markdown All in One**
   - 键盘快捷键
   - 自动预览
   - 目录生成

2. **French Press Preview**
   - 专为 VitePress 优化
   - 实时预览
   - 样式一致

3. **Markdown Preview Enhanced**
   - 强大的预览功能
   - 支持数学公式
   - 导出多种格式

### 代码质量

1. **ESLint**
   - JavaScript/TypeScript 代码检查
   - 自动修复

2. **Prettier**
   - 代码格式化
   - 统一代码风格

3. **Stylelint**
   - CSS/SCSS 代码检查

### Git 集成

1. **GitLens**
   - Git 增强功能
   - 代码作者信息
   - 提交历史

2. **Git Graph**
   - 可视化 Git 历史
   - 分支管理

### 其他实用插件

1. **Auto Rename Tag**
   - 自动重命名配对的 HTML/XML 标签

2. **Bracket Pair Colorizer**
   - 括号颜色匹配

3. **Path Intellisense**
   - 路径自动完成

## 推荐设置

### 用户设置 (settings.json)

```json
{
  // 编辑器
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.formatOnSave": true,

  // 文件
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true
  },

  // Markdown
  "[markdown]": {
    "editor.formatOnSave": false,
    "editor.wordWrap": "on",
    "editor.quickSuggestions": {
      "other": true,
      "comments": false,
      "strings": false
    }
  },

  // 主题
  "workbench.colorTheme": "Default Dark+",
  "workbench.iconTheme": "vs-seti"
}
```

### 键盘快捷捷键 (keybindings.json)

```json
[
  {
    "key": "ctrl+b",
    "command": "markdown.preview.toggle"
  },
  {
    "key": "ctrl+k v",
    "command": "markdown.preview.side"
  }
]
```

## 工作区配置

### .vscode/settings.json

在项目根目录创建工作区特定设置：

```json
{
  "vitepress.startScript": "dev",
  "vitepress.host": "localhost",
  "vitepress.port": 5173
}
```

### .vscode/extensions.json

推荐团队安装的插件：

```json
{
  "recommendations": [
    "yzhang.markdown-all-in-one",
    "bierner.markdown-mermaid",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

## 代码片段

### Markdown 代码片段

创建 `.vscode/markdown.code-snippets`：

```json
{
  "Front Matter": {
    "prefix": "frontmatter",
    "body": [
      "---",
      "title: ${1:标题}",
      "date: ${2:2024-01-01}",
      "tags: ['${3:标签}']",
      "---",
      "$0"
    ],
    "description": "插入文章 Front Matter"
  },

  "代码块": {
    "prefix": "code",
    "body": [
      "\`\`\`${1:javascript}",
      "$0",
      "\`\`\`"
    ],
    "description": "插入代码块"
  }
}
```

## 调试配置

### launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动 VitePress",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## 性能优化

### 提高性能的设置

```json
{
  // 禁用不必要的功能
  "telemetry.telemetryLevel": "off",
  "extensions.autoUpdate": false,

  // 优化文件监视
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true
  }
}
```

## 实用技巧

### 1. 快速打开文件

- `Ctrl + P`：快速打开文件
- `Ctrl + Shift + P`：命令面板

### 2. 多光标编辑

- `Alt + Click`：添加光标
- `Ctrl + Alt + Up/Down`：向上/下添加光标

### 3. 代码导航

- `Ctrl + Click`：跳转到定义
- `Ctrl + Shift + Click`：在侧边打开

### 4. 快速修复

- `Ctrl + .`：快速修复
- `F2`：重命名符号

## 总结

良好的 VS Code 配置可以大大提高开发效率：

- ✅ 安装必要的插件
- ✅ 配置合适的设置
- ✅ 使用代码片段提高速度
- ✅ 利用快捷键操作

建议根据自己的习惯不断优化配置。