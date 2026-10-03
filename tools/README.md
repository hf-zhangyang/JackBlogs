# 博客内容管理工具

## 核心思路：目录即分类

文章的分类结构**完全由目录结构决定**，不再需要手工维护中央清单：

```
docs/articles/
├── container/                    # 一级分类目录（目录名 = URL 片段）
│   ├── _meta.md                  # 分类元数据：显示名 / 图标 / 描述 / 排序
│   └── docker/                   # 二级子分类目录
│       ├── _meta.md              # 子分类元数据：显示名 / 排序
│       ├── deploy.md             # 文章
│       └── docker-compose.md
├── linux/
│   └── basic-commands/
│       └── commands.md
└── articles.js                   # ⚙️ 自动生成，请勿手动编辑
```

URL 规则：`/articles/<分类目录>/<子分类目录>/<文件名>`
例：`docs/articles/container/docker/deploy.md` → `/articles/container/docker/deploy`

## 1. 添加文章

```bash
# ① 把 .md 丢进对应子分类目录即可
# ② 同步索引（dev / build 已内置为前置步骤，通常无需手动执行）
npm run sync
```

文章 frontmatter 支持的字段：

```markdown
---
title: 文章标题          # 可选，缺省取正文 H1
desc: 一句话简介          # 可选，缺省同 title
date: 2026-10-03        # 可选，缺省为空（影响首页「最新文章」排序）
order: 10               # 可选，同组内排序；缺省按 date 倒序 → 标题
---

# 正文标题
……
```

> 新增文章后侧边栏需要重启 `npm run dev`（侧边栏在配置期生成），文章列表页会自动更新。

## 2. 新增分类 / 子分类

```bash
mkdir -p docs/articles/database/mysql
```

然后建对应的 `_meta.md` 填写显示名：

```markdown
---
title: 数据库          # 显示名（必填，目录名只用于 URL）
icon: 🗄️              # 可选，一级分类图标
desc: MySQL、Redis 等数据库的使用和优化。   # 可选，一级分类描述
order: 4              # 可选，分类排序
---
```

跳过的规则：以 `_` 或 `.` 开头的文件/目录一律忽略；文章直接放在分类目录下（没有子分类层）会被警告并跳过——**规范只认三级**。

## 3. 批量导入外部文档

工作区外部的 Markdown 用 `publish` 一次性导入多篇：

```bash
# 导入多篇
node tools/publish.mjs 第一课.md 第二课.md 第三课.md

# 导入整个目录（递归收集 .md）
npm run publish -- ./drafts/

# 分类写在 frontmatter 里
node tools/publish.mjs 文章.md
```

frontmatter 中的 `category` / `subcategory` 支持填**显示名**（如「容器与运维」）或**目录名**（如 `container`），
导入后会自动剥离这两个字段（分类信息此后由目录承载）并同步索引。

分类不存在时会报错并列出当前可用的分类 / 子分类——脚本不会自动新建分类，目录结构请显式创建。

## 4. 命令速查

| 命令 | 说明 |
|------|------|
| `npm run dev` | 同步索引 + 启动开发服务器（http://localhost:5173/JackBlogs/） |
| `npm run build` | 同步索引 + 构建生产版本到 `docs/.vitepress/dist/` |
| `npm run preview` | 预览构建结果 |
| `npm run sync` | 仅重新扫描目录、生成 `docs/articles/articles.js` |
| `npm run publish -- <文件/目录>` | 批量导入外部 Markdown 并同步索引 |
| `npm run test:legacy` | 校验旧 URL 重定向映射表 |

## 5. 旧链接重定向

分类改为目录结构时文章的 URL 会变化，旧链接在 GitHub Pages 上落到 404。
主题里挂了一个只在 404 页生效的跳转组件：

```
docs/.vitepress/theme/
├── legacy-urls.mjs                    # 映射表：'旧路径': '新路径'
└── components/LegacyRedirect.vue      # 挂在 layout-top 插槽，命中映射则 location.replace
```

改动文章路径时，在 `legacy-urls.mjs` 加一条映射，然后跑测试：

```bash
npm run test:legacy
```

测试覆盖带/不带 `.html`、带/不带结尾斜杠、中文路径的 percent-encoding、有无 base 前缀，
以及"新 URL 不应误命中"的反例。

## 6. 相关文件

| 文件 | 职责 |
|------|------|
| `tools/articles-scan.mjs` | 目录扫描库（唯一解析实现，被下面两个脚本复用） |
| `tools/sync-articles.mjs` | 扫描目录 → 生成 `articles.js` |
| `tools/publish.mjs` | 外部文档批量导入 → 自动同步 |
| `tools/test-legacy-urls.mjs` | 旧 URL 映射表测试 |
| `docs/articles/articles.js` | 生成产物，被 `config.mjs` 与前端组件消费 |

## 7. 一键合并 continue-7wivro 到 main

```bash
# Linux / macOS / Git Bash
./tools/merge-to-main.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File tools/merge-to-main.ps1
```

脚本会自动：检测当前分支 → 暂存冲突解决文件 + 工具文件 + 示例文章 → 完成合并提交 → 切换到 main 执行 fast-forward 合并 → 打印结果状态。

合并完成后如需发布到 GitHub Pages：

```bash
git push origin main
```
