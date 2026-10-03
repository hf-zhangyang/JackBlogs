#!/usr/bin/env node
/**
 * 外部文档批量导入工具
 *
 * 把工作区外部的 Markdown 按 frontmatter 声明的分类，批量放入目录规范位置：
 *   docs/articles/<分类目录>/<子分类目录>/<slug>.md
 * 导入完成后自动重新生成 articles.js。
 *
 * 用法：
 *   node tools/publish.mjs 文章.md
 *   node tools/publish.mjs 系列一.md 系列二.md        # 一次导入多篇
 *   node tools/publish.mjs ./drafts/                  # 目录内所有 .md（递归）
 *   node tools/publish.mjs --category=container --subcategory=docker 文章.md
 *
 * frontmatter 字段：
 *   ---
 *   title: 文章标题        # 可选，缺省取正文 H1
 *   desc: 一句话简介        # 可选，缺省同 title
 *   date: 2026-10-03      # 可选，缺省取文件修改时间
 *   slug: my-article      # 可选，缺省由标题生成
 *   category: 容器与运维    # 必填（也可用 --category 传目录名）
 *   subcategory: Docker   # 必填（也可用 --subcategory 传目录名）
 *   ---
 *
 * 分类即目录：category / subcategory 支持填显示名（如「容器与运维」）或目录名（如 container），
 * 目录不存在时会报错并列出可用选项 —— 分类结构由目录决定，不再由脚本自动新建。
 */

import fs from 'node:fs'
import path from 'node:path'
import {
  ARTICLES_DIR,
  ROOT,
  extractH1,
  listTargets,
  parseFrontmatter,
  scanArticles,
  writeArticlesFile
} from './articles-scan.mjs'

const ok = (...a) => console.log('✅', ...a)
const log = (...a) => console.log('📘', ...a)
const warn = (...a) => console.warn('⚠️ ', ...a)
const err = (...a) => console.error('❌', ...a)

/** 由标题或显式 slug 生成文件名（保留中文，去除文件系统非法字符） */
function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[\s/\\?%*:|"'<>.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'post'
  )
}

/** 递归收集 Markdown 文件 */
function collectMarkdown(inputs) {
  const files = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.md')) files.push(full)
    }
  }
  for (const input of inputs) {
    const abs = path.resolve(input)
    if (!fs.existsSync(abs)) {
      warn(`跳过不存在的路径：${input}`)
      continue
    }
    if (fs.statSync(abs).isDirectory()) walk(abs)
    else if (abs.endsWith('.md')) files.push(abs)
    else warn(`跳过非 Markdown 文件：${input}`)
  }
  return files
}

/** 把 frontmatter 重新序列化（分类信息改由目录承载，故剔除 category / subcategory） */
function buildContent(meta, body) {
  const skip = new Set(['category', 'subcategory'])
  const lines = [`title: ${meta.title}`, `desc: ${meta.desc}`, `date: ${meta.date}`]
  Object.entries(meta).forEach(([key, value]) => {
    if (skip.has(key) || ['title', 'desc', 'date'].includes(key)) return
    lines.push(`${key}: ${value}`)
  })
  return `---\n${lines.join('\n')}\n---\n\n${body.trimStart()}`
}

function printTargets() {
  console.error('   可用分类 / 子分类：')
  listTargets().forEach((cat) => {
    console.error(`     - ${cat.category}（目录：${cat.dir}）`)
    cat.subcategories.forEach((sub) => {
      console.error(`         └─ ${sub.name}（目录：${sub.dir}）`)
    })
  })
}

function resolveTarget(categoryName, subcategoryName) {
  const targets = listTargets()
  const cat = targets.find((c) => c.category === categoryName || c.dir === categoryName)
  if (!cat) {
    err(`未找到分类「${categoryName}」`)
    printTargets()
    return null
  }
  const sub = cat.subcategories.find((s) => s.name === subcategoryName || s.dir === subcategoryName)
  if (!sub) {
    err(`分类「${cat.category}」下未找到子分类「${subcategoryName}」`)
    printTargets()
    return null
  }
  return { catDir: cat.dir, subDir: sub.dir, category: cat.category, subcategory: sub.name }
}

function main() {
  const args = process.argv.slice(2)
  const flags = {}
  const inputs = []
  args.forEach((arg) => {
    const m = arg.match(/^--([\w-]+)=(.*)$/)
    if (m) flags[m[1]] = m[2]
    else inputs.push(arg)
  })

  if (inputs.length === 0) {
    err('未提供文件路径。用法：node tools/publish.mjs [--category=容器与运维] [--subcategory=Docker] <文件或目录> ...')
    process.exit(1)
  }

  const files = collectMarkdown(inputs)
  if (files.length === 0) {
    err('未找到任何 Markdown 文件')
    process.exit(1)
  }

  log(`待导入 ${files.length} 篇文档`)
  const written = []
  let failed = 0

  for (const filePath of files) {
    const relFile = path.relative(ROOT, filePath)
    if (filePath.startsWith(ARTICLES_DIR + path.sep)) {
      warn(`已在文章目录内，请直接运行 npm run sync：${relFile}`)
      failed++
      continue
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { meta, body } = parseFrontmatter(raw)
    const title = meta.title || extractH1(body)
    if (!title) {
      err(`无法提取标题（frontmatter.title 或正文 H1）：${relFile}`)
      failed++
      continue
    }

    const categoryName = flags.category || meta.category
    const subcategoryName = flags.subcategory || meta.subcategory
    if (!categoryName || !subcategoryName) {
      err(`缺少分类信息（frontmatter 的 category / subcategory，或 --category/--subcategory）：${relFile}`)
      failed++
      continue
    }

    const target = resolveTarget(categoryName, subcategoryName)
    if (!target) {
      failed++
      continue
    }

    const targetDir = path.join(ARTICLES_DIR, target.catDir, target.subDir)
    fs.mkdirSync(targetDir, { recursive: true })

    let slug = slugify(meta.slug || title)
    if (fs.existsSync(path.join(targetDir, `${slug}.md`))) {
      slug = `${slug}-${Date.now().toString(36)}`
      warn(`目标文件已存在，slug 追加后缀：${slug}`)
    }

    const normalized = {
      title,
      desc: meta.desc || title,
      date: meta.date || fs.statSync(filePath).mtime.toISOString().slice(0, 10),
      ...meta
    }
    const targetPath = path.join(targetDir, `${slug}.md`)
    fs.writeFileSync(targetPath, buildContent(normalized, body), 'utf-8')
    written.push({ from: relFile, to: path.relative(ROOT, targetPath), target })
  }

  written.forEach((w) => {
    ok(`${w.from} → ${w.to}`)
  })

  if (written.length > 0) {
    const { categories } = scanArticles()
    writeArticlesFile(categories)
    log(`已同步文章索引（${written.length} 篇已导入）`)
  }

  if (failed > 0) {
    warn(`${failed} 篇未导入`)
    process.exit(1)
  }
  ok('全部完成')
}

main()
