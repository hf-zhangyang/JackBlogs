# 一步把 continue-7wivro 合并到 main（含冲突已解决、所有改动）
# 用法：在仓库根目录下执行 powershell -ExecutionPolicy Bypass -File tools/merge-to-main.ps1

$ErrorActionPreference = "Stop"

$br = git branch --show-current
if ($br -ne "continue-7wivro") {
  Write-Host "错误：当前不在 continue-7wivro 分支（当前 $br）" -ForegroundColor Red
  exit 1
}

# 1. 暂存
git add `
  docs/.vitepress/theme/components/ArticlesList.vue, `
  docs/.vitepress/theme/components/DocNav.vue, `
  docs/.vitepress/theme/components/HeroSection.vue, `
  docs/.vitepress/theme/components/HomeArticleList.vue, `
  docs/.vitepress/theme/components/HomePage.vue, `
  docs/.vitepress/theme/components/ProfileCard.vue, `
  docs/.vitepress/theme/style.css, `
  docs/articles/articles.js, `
  package.json, `
  "docs/articles/容器与运维/", `
  tools/

# 2. 完成合并提交或普通提交
$mergeHeadPath = Join-Path (git rev-parse --git-dir) "MERGE_HEAD"
if (Test-Path $mergeHeadPath) {
  Write-Host "检测到 MERGE_HEAD 状态，自动完成合并提交" -ForegroundColor Yellow
  git commit -m "Merge main into continue-7wivro: resolve conflicts

- 保留 192daae 引入的'现代文人书房'主题（宣纸底色、墨色文字、朱砂点缀、毛笔楷字体）
- 同步新增 tools/publish.mjs 博客文章自动发布工具"
} else {
  Write-Host "检测到普通脏改动，单独提交" -ForegroundColor Yellow
  git commit -m "feat: 添加博客文章自动发布工具 + 示例文章

- 新增 tools/publish.mjs 与 tools/example.md、tools/README.md
- 注册 npm run publish 命令
- 示例文章：Docker Compose 多服务编排"
}

# 3. 切换 main 并 fast-forward 合并
git checkout main
git merge continue-7wivro --ff-only

# 4. 验证
Write-Host "--- main 分支最新提交 ---" -ForegroundColor Green
git log --oneline -5
Write-Host "--- 工作树状态 ---" -ForegroundColor Green
git status

Write-Host ""
Write-Host "✅ 完成！如需推送到远端：git push origin main" -ForegroundColor Green