#!/usr/bin/env node
/**
 * 博客文章自动发布工具
 *
 * 用法：
 *   1. 在 Markdown 文档顶部加入 frontmatter 指定分类/子分类：
 *
 *      ---
 *      title: 我的新文章
 *      category: 容器与运维
 *      subcategory: Docker
 *      desc: 一句话简介
 *      icon: 📘           （一级分类的 emoji，仅首次新增该分类时使用）
 *      categoryDesc: ...  （一级分类的描述，仅首次新增该分类时使用）
 *      ---
 *
 *      # 正文标题
 *      …… 正文 ...
 *
 *   2. 运行：
 *      node tools/publish.mjs path/to/your-article.md
 *      或
 *      node tools/publish.mjs        （交互式输入文件路径）
 */

import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// ===== 路径常量 =====
const ROOT = path.resolve(process.cwd())
const ARTICLES_DIR = path.join(ROOT, 'docs', 'articles')
const ARTICLES_JS = path.join(ARTICLES_DIR, 'articles.js')

// ===== 工具函数 =====
const log = (...args) => console.log('📘', ...args)
const ok = (...args) => console.log('✅', ...args)
const warn = (...args) => console.warn('⚠️ ', ...args)
const err = (...args) => console.error('❌', ...args)

/**
 * 解析 Markdown 顶部的 YAML 风格 frontmatter
 * 支持：
 *   ---
 *   key: value
 *   ---
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) {
    return { meta: {}, body: content }
  }
  const meta = {}
  match[1].split('\n').forEach((line) => {
    const m = line.match(/^([\w\u4e00-\u9fa5]+)\s*:\s*(.*)$/)
    if (m) {
      meta[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '')
    }
  })
  return { meta, body: match[2] }
}

/**
 * 从正文提取 H1 作为标题（兜底）
 */
function extractTitle(body) {
  const m = body.match(/^\s*#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : ''
}

/**
 * slugify：从标题生成英文/拼音文件名
 * 简单实现：保留中文，转拼音需要额外依赖，这里直接用 pinyin 兜底为哈希
 */
function slugify(title) {
  // 中文标题：取首字+时间戳后四位，避免重名
  const safe = title
    .toLowerCase()
    .replace(/[\s/\\?%*:|"<>]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // 中文长度截断
  const zhPart = title.match(/[\u4e00-\u9fa5]/g)?.slice(0, 4).join('') || ''
  const enPart = safe.match(/[a-z0-9-]+/g)?.[0] || ''

  // 若包含中文则使用 zhPart-enPart-时间戳，避免拼音库依赖
  if (zhPart) {
    return `${zhPart}-${Date.now().toString(36)}`
  }
  return enPart.slice(0, 40) || `post-${Date.now().toString(36)}`
}

/**
 * 读取 articles.js 的源代码并定位 articleList 文本
 */
function loadArticlesSource() {
  if (!fs.existsSync(ARTICLES_JS)) {
    throw new Error(`找不到 ${ARTICLES_JS}`)
  }
  return fs.readFileSync(ARTICLES_JS, 'utf-8')
}

/**
 * 用 AST-lite 方式解析 articleList
 * 由于结构固定，我们用正则匹配顶层括号的内容，截取第一个 export const articleList = [ ... ] 块。
 */
function extractArticleList(source) {
  const startMarker = 'export const articleList = ['
  const start = source.indexOf(startMarker)
  if (start === -1) throw new Error('未找到 articleList 定义')
  const listBegin = start + startMarker.length - 1 // `[` 位置
  // 从 `[` 开始匹配括号
  let depth = 0
  let end = -1
  for (let i = listBegin; i < source.length; i++) {
    const ch = source[i]
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  if (end === -1) throw new Error('articleList 块未闭合')
  const inner = source.slice(listBegin + 1, end)
  return { listBegin, end, inner }
}

/**
 * 把分类/子分类/条目项序列化为 JS 源码（缩进匹配现有格式）
 */
function serializeCategory(cat, indent = '    ') {
  const lines = []
  lines.push(`${indent}{`)
  lines.push(`${indent}  category: ${JSON.stringify(cat.category)},`)
  if (cat.icon) lines.push(`${indent}  icon: ${JSON.stringify(cat.icon)},`)
  if (cat.description) lines.push(`${indent}  description: ${JSON.stringify(cat.description)},`)
  lines.push(`${indent}  subcategories: [`)
  cat.subcategories.forEach((sub, i) => {
    lines.push(`${indent}    {`)
    lines.push(`${indent}      name: ${JSON.stringify(sub.name)},`)
    lines.push(`${indent}      items: [`)
    sub.items.forEach((item, j) => {
      lines.push(`${indent}        {`)
      lines.push(`${indent}          title: ${JSON.stringify(item.title)},`)
      lines.push(`${indent}          link: ${JSON.stringify(item.link)},`)
      lines.push(`${indent}          desc: ${JSON.stringify(item.desc)}`)
      lines.push(`${indent}        }${j < sub.items.length - 1 ? ',' : ''}`)
    })
    lines.push(`${indent}      ]`)
    lines.push(`${indent}    }${i < cat.subcategories.length - 1 ? ',' : ''}`)
  })
  lines.push(`${indent}  ]`)
  lines.push(`${indent}}`)
  return lines.join('\n')
}

/**
 * 简易解析 articleList inner 文本为对象数组
 * 期望格式与现有 articles.js 一致；只解析 category / subcategories / items 字段
 */
function parseArticleList(inner) {
  // 抓取每个分类块（基于 { 与 } 配对）
  const categories = []
  let i = 0
  while (i < inner.length) {
    // 跳过空白与逗号
    while (i < inner.length && /[\s,]/.test(inner[i])) i++
    if (i >= inner.length) break
    if (inner[i] !== '{') {
      i++
      continue
    }
    // 配对 {}
    let depth = 1
    let j = i + 1
    while (j < inner.length && depth > 0) {
      if (inner[j] === '{') depth++
      else if (inner[j] === '}') depth--
      if (depth === 0) break
      j++
    }
    const block = inner.slice(i, j + 1)

    // 简单提取字段
    const cat = parseCategoryFromBlock(block)
    if (cat) categories.push(cat)
    i = j + 1
  }
  return categories
}

function parseCategoryFromBlock(block) {
  const get = (re) => {
    const m = block.match(re)
    return m ? m[1] : ''
  }
  const category = get(/category\s*:\s*['"]([^'"]+)['"]/)
  const icon = get(/icon\s*:\s*['"]([^'"]+)['"]/)
  const description = get(/description\s*:\s*['"]([^'"]+)['"]/)

  // 找到 subcategories: [ ... ] 的子串
  const subStart = block.indexOf('subcategories:')
  if (subStart === -1) return null
  const arrStart = block.indexOf('[', subStart)
  if (arrStart === -1) return null
  let depth = 1
  let k = arrStart + 1
  while (k < block.length && depth > 0) {
    if (block[k] === '[') depth++
    else if (block[k] === ']') depth--
    if (depth === 0) break
    k++
  }
  const subInner = block.slice(arrStart + 1, k)
  const subcategories = []
  let p = 0
  while (p < subInner.length) {
    while (p < subInner.length && /[\s,]/.test(subInner[p])) p++
    if (p >= subInner.length) break
    if (subInner[p] !== '{') {
      p++
      continue
    }
    let d2 = 1
    let q = p + 1
    while (q < subInner.length && d2 > 0) {
      if (subInner[q] === '{') d2++
      else if (subInner[q] === '}') d2--
      if (d2 === 0) break
      q++
    }
    const subBlock = subInner.slice(p, q + 1)
    const nameMatch = subBlock.match(/name\s*:\s*['"]([^'"]+)['"]/)
    const subName = nameMatch ? nameMatch[1] : ''
    // items: [ { title, link, desc }, ... ]
    const items = []
    const itemsIdx = subBlock.indexOf('items:')
    if (itemsIdx !== -1) {
      const arr2Start = subBlock.indexOf('[', itemsIdx)
      if (arr2Start !== -1) {
        let d3 = 1
        let r = arr2Start + 1
        while (r < subBlock.length && d3 > 0) {
          if (subBlock[r] === '[') d3++
          else if (subBlock[r] === ']') d3--
          if (d3 === 0) break
          r++
        }
        const itemsInner = subBlock.slice(arr2Start + 1, r)
        let s = 0
        while (s < itemsInner.length) {
          while (s < itemsInner.length && /[\s,]/.test(itemsInner[s])) s++
          if (s >= itemsInner.length) break
          if (itemsInner[s] !== '{') {
            s++
            continue
          }
          let d4 = 1
          let t = s + 1
          while (t < itemsInner.length && d4 > 0) {
            if (itemsInner[t] === '{') d4++
            else if (itemsInner[t] === '}') d4--
            if (d4 === 0) break
            t++
          }
          const itemBlock = itemsInner.slice(s, t + 1)
          const get3 = (re) => {
            const m = itemBlock.match(re)
            return m ? m[1] : ''
          }
          const title = get3(/title\s*:\s*['"]([^'"]+)['"]/)
          const link = get3(/link\s*:\s*['"]([^'"]+)['"]/)
          const desc = get3(/desc\s*:\s*['"]([^'"]+)['"]/)
          if (title && link) items.push({ title, link, desc })
          s = t + 1
        }
      }
    }
    if (subName) subcategories.push({ name: subName, items })
    p = q + 1
  }

  if (!category) return null
  return { category, icon, description, subcategories }
}

/**
 * 写入 articles.js（替换 articleList 块，保持其它内容不变）
 */
function writeArticleList(categories) {
  const source = loadArticlesSource()
  const { listBegin, end } = extractArticleList(source)
  const before = source.slice(0, listBegin + 1)
  const after = source.slice(end)
  const serialized =
    '\n' +
    categories
      .map((cat, idx) => {
        const sep = idx < categories.length - 1 ? ',' : ''
        return serializeCategory(cat, '  ') + sep
      })
      .join('\n') +
    '\n'
  const next = before + serialized + after
  fs.writeFileSync(ARTICLES_JS, next, 'utf-8')
}

/**
 * 主流程
 */
async function main() {
  let filePath = process.argv[2]
  if (!filePath) {
    const rl = readline.createInterface({ input, output })
    filePath = (await rl.question('请输入 Markdown 文件路径: ')).trim()
    rl.close()
  }

  if (!filePath) {
    err('未提供文件路径')
    process.exit(1)
  }

  const absPath = path.resolve(filePath)
  if (!fs.existsSync(absPath)) {
    err(`文件不存在: ${absPath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(absPath, 'utf-8')
  const { meta, body } = parseFrontmatter(raw)
  const title = meta.title || extractTitle(body)
  if (!title) {
    err('无法从 frontmatter / 正文 H1 提取标题，请检查文件')
    process.exit(1)
  }
  const categoryName = meta.category
  const subcategoryName = meta.subcategory
  const desc = meta.desc || title
  if (!categoryName || !subcategoryName) {
    err('frontmatter 必须指定 category 与 subcategory，例如：')
    err('  category: 容器与运维')
    err('  subcategory: Docker')
    process.exit(1)
  }

  const icon = meta.icon || '📘'
  const categoryDesc = meta.categoryDesc || `${categoryName}相关文章。`

  // 生成 slug 与目标路径
  const slug = slugify(title)
  const catKey = categoryName.toLowerCase().replace(/\s+/g, '-')
  const targetDir = path.join(ARTICLES_DIR, catKey)
  const targetPath = path.join(targetDir, `${slug}.md`)
  const link = `/articles/${catKey}/${slug}`

  log(`标题：${title}`)
  log(`分类：${categoryName} / ${subcategoryName}`)
  log(`目标文件：${path.relative(ROOT, targetPath)}`)

  // 1. 写入 .md 文件（保留 frontmatter 与正文）
  fs.mkdirSync(targetDir, { recursive: true })
  const finalContent = `---\ntitle: ${title}\ncategory: ${categoryName}\nsubcategory: ${subcategoryName}\ndesc: ${desc}\n---\n\n${body.trimStart()}`
  fs.writeFileSync(targetPath, finalContent, 'utf-8')
  ok(`已写入文章文件：${path.relative(ROOT, targetPath)}`)

  // 2. 更新 articles.js
  const source = loadArticlesSource()
  const { inner } = extractArticleList(source)
  const categories = parseArticleList(inner)
  let cat = categories.find((c) => c.category === categoryName)
  if (!cat) {
    log(`未找到分类「${categoryName}」，将自动新建`)
    cat = {
      category: categoryName,
      icon,
      description: categoryDesc,
      subcategories: []
    }
    categories.push(cat)
  } else {
    // 保持现有 icon / description
    if (!cat.icon && meta.icon) cat.icon = icon
    if (!cat.description && meta.categoryDesc) cat.description = categoryDesc
  }
  let sub = cat.subcategories.find((s) => s.name === subcategoryName)
  if (!sub) {
    log(`未找到子分类「${subcategoryName}」，将在「${categoryName}」下新建`)
    sub = { name: subcategoryName, items: [] }
    cat.subcategories.push(sub)
  }
  // 去重（按 link）
  if (sub.items.some((it) => it.link === link)) {
    warn(`检测到同链接已存在：${link}，将跳过注册但保留 md 文件`)
  } else {
    sub.items.push({ title, link, desc })
    writeArticleList(categories)
    ok(`已在 articles.js 注册：${link}`)
  }

  log('')
  ok('全部完成 ✅')
  log(`- 文件：docs/articles/${catKey}/${slug}.md`)
  log(`- 链接：${link}`)
  log(`下次启动 vitepress dev 即可访问`)
}

main().catch((e) => {
  err(e.message)
  console.error(e.stack)
  process.exit(1)
})