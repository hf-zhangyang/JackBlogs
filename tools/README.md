# 博客文章发布工具

把任意 Markdown 文档丢进工具，自动完成：
1. 创建 `docs/articles/<分类目录>/<slug>.md`
2. 解析 frontmatter 中的 `category` / `subcategory`
3. 自动注册到 `docs/articles/articles.js`
4. （缺失分类/子分类时自动新建）

## 1. 发布一篇文章

```bash
npm run publish -- tools/example.md
# 或
node tools/publish.mjs tools/example.md
# 不带参数会提示输入
```

文档顶部需要一段 frontmatter：

```markdown
---
title: 文章标题             # 必填（也可用 H1 兜底）
category: 容器与运维        # 必填：现存分类名
subcategory: Docker         # 必填：现存子分类名
desc: 一句话简介             # 必填
icon: 📘                    # 可选：首次新增分类时使用
categoryDesc: 分类描述       # 可选：首次新增分类时使用
---

# 正文标题
……
```

## 2. 一键合并 continue-7wivro 到 main

```bash
# Linux / macOS / Git Bash
./tools/merge-to-main.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File tools/merge-to-main.ps1
```

脚本会自动：
- 检测当前分支（要求在 continue-7wivro）
- 暂存冲突解决文件 + 工具文件 + 示例文章
- 完成合并提交（或普通提交，取决于是否有 MERGE_HEAD）
- 切换到 main，执行 fast-forward 合并
- 打印结果状态

合并完成后如需发布到 GitHub Pages，再执行：

```bash
git push origin main
```