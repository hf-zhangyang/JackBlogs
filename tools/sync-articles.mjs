#!/usr/bin/env node
/**
 * 文章索引同步工具
 *
 * 扫描 docs/articles/ 目录结构，重新生成 docs/articles/articles.js。
 * 用法：
 *   npm run sync
 *   node tools/sync-articles.mjs
 *
 * 该命令已挂在 dev / build 前置步骤中，通常无需手动执行。
 */

import path from 'node:path'
import { ARTICLES_DIR, ARTICLES_JS, ROOT, scanArticles, writeArticlesFile } from './articles-scan.mjs'

const rel = (p) => path.relative(ROOT, p)

function main() {
  const { categories, warnings, stats } = scanArticles()

  warnings.forEach((w) => console.warn('⚠️ ', w))

  if (stats.articles === 0) {
    console.error('❌ 未扫描到任何文章，已中止（避免清空 articles.js）')
    process.exit(1)
  }

  const { changed } = writeArticlesFile(categories)

  console.log('📘 扫描目录：', rel(ARTICLES_DIR))
  categories.forEach((cat) => {
    console.log(`   ${cat.icon} ${cat.category}（${cat._dir}/）`)
    cat.subcategories.forEach((sub) => {
      console.log(`      └─ ${sub.name}（${sub._dir}/） · ${sub.items.length} 篇`)
    })
  })
  console.log(
    `✅ ${changed ? '已更新' : '内容无变化'}：${rel(ARTICLES_JS)}` +
      `（${stats.categories} 个分类 / ${stats.subcategories} 个子分类 / ${stats.articles} 篇文章）`
  )
}

main()
