/**
 * 文章扫描库
 *
 * 设计原则：**目录即分类，文章文件即数据源**。
 * 本模块是 `docs/articles/` 目录结构的唯一解析实现，
 * 被 tools/sync-articles.mjs（生成 articles.js）与 tools/publish.mjs（导入外部文档）复用。
 *
 * 目录规范（固定三级）：
 *
 *   docs/articles/
 *   ├── <分类目录>/                 # 目录名即 URL 片段，建议英文小写
 *   │   ├── _meta.md                # 分类元数据：title(显示名) / icon / desc / order
 *   │   └── <子分类目录>/            # 同上，目录名即 URL 片段
 *   │       ├── _meta.md            # 子分类元数据：title(显示名) / order
 *   │       └── <文章>.md           # 文章：frontmatter title / desc / date / order
 *
 * 约定：
 * - 以 `_` 或 `.` 开头的文件/目录一律忽略（`_meta.md` 即元数据文件）
 * - 文章直接放在分类目录下（没有子分类层）会被警告并跳过，规范只认三级
 * - order 缺省值极大（排在最后），文章在同一子分类内按 order → date 倒序 → 标题排序
 */

import fs from 'node:fs'
import path from 'node:path'

export const ROOT = process.cwd()
export const ARTICLES_DIR = path.join(ROOT, 'docs', 'articles')
export const ARTICLES_JS = path.join(ARTICLES_DIR, 'articles.js')
export const META_FILE = '_meta.md'

/** 排序缺省值：未显式指定 order 的项排在最后 */
const DEFAULT_ORDER = Number.MAX_SAFE_INTEGER

// ===== frontmatter 解析 =====

/**
 * 解析 Markdown 顶部的 YAML 风格 frontmatter
 * 支持：
 *   ---
 *   key: value
 *   ---
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: content }
  const meta = {}
  match[1].split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([\w\u4e00-\u9fa5]+)\s*:\s*(.*)$/)
    if (m) {
      meta[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '')
    }
  })
  return { meta, body: match[2] }
}

/** 从正文提取 H1 作为标题兜底 */
export function extractH1(body) {
  const m = body.match(/^\s*#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : ''
}

// ===== 目录扫描 =====

const isIgnored = (name) => name.startsWith('.') || name.startsWith('_')

function readDirEntries(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !isIgnored(e.name))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function readMeta(dir) {
  const p = path.join(dir, META_FILE)
  if (!fs.existsSync(p)) return {}
  return parseFrontmatter(fs.readFileSync(p, 'utf-8')).meta
}

function toOrder(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : DEFAULT_ORDER
}

/**
 * 扫描文章目录，组装三级分类结构
 * @param {string} [root] 文章根目录，默认 docs/articles
 * @returns {{ categories: Array, warnings: string[], stats: {categories:number,subcategories:number,articles:number} }}
 */
export function scanArticles(root = ARTICLES_DIR) {
  const categories = []
  const warnings = []

  if (!fs.existsSync(root)) {
    return { categories, warnings: [`文章目录不存在：${root}`], stats: { categories: 0, subcategories: 0, articles: 0 } }
  }

  for (const catEntry of readDirEntries(root).filter((e) => e.isDirectory())) {
    const catPath = path.join(root, catEntry.name)
    const catMeta = readMeta(catPath)
    const catDirs = readDirEntries(catPath)

    // 规范只认三级：分类目录下的散装 md 一律跳过
    catDirs
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .forEach((e) => warnings.push(`未归入子分类目录，已跳过：${path.relative(ROOT, path.join(catPath, e.name))}`))

    const subcategories = []
    for (const subEntry of catDirs.filter((e) => e.isDirectory())) {
      const subPath = path.join(catPath, subEntry.name)
      const subMeta = readMeta(subPath)
      const subName = subMeta.title || subEntry.name
      const items = []

      const mdFiles = readDirEntries(subPath).filter((e) => e.isFile() && e.name.endsWith('.md'))
      for (const file of mdFiles) {
        const filePath = path.join(subPath, file.name)
        const { meta, body } = parseFrontmatter(fs.readFileSync(filePath, 'utf-8'))
        const title = meta.title || extractH1(body)
        if (!title) {
          warnings.push(`缺少标题（frontmatter.title 或正文 H1），已跳过：${path.relative(ROOT, filePath)}`)
          continue
        }
        const slug = path.basename(file.name, '.md')
        items.push({
          title,
          link: `/articles/${catEntry.name}/${subEntry.name}/${slug}`,
          desc: meta.desc || title,
          date: meta.date || '',
          _order: toOrder(meta.order),
          _file: path.relative(ROOT, filePath)
        })
      }

      items.sort(
        (a, b) => a._order - b._order || (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title)
      )

      if (items.length === 0) {
        warnings.push(`子分类「${subName}」下没有文章，已跳过：${path.relative(ROOT, subPath)}`)
        continue
      }
      subcategories.push({ name: subName, _dir: subEntry.name, _order: toOrder(subMeta.order), items })
    }

    subcategories.sort((a, b) => a._order - b._order || a.name.localeCompare(b.name))

    if (subcategories.length === 0) {
      warnings.push(`分类「${catMeta.title || catEntry.name}」下没有子分类，已跳过：${path.relative(ROOT, catPath)}`)
      continue
    }

    categories.push({
      category: catMeta.title || catEntry.name,
      icon: catMeta.icon || '📘',
      description: catMeta.desc || `${catMeta.title || catEntry.name}相关文章。`,
      _dir: catEntry.name,
      _order: toOrder(catMeta.order),
      subcategories
    })
  }

  categories.sort((a, b) => a._order - b._order || a.category.localeCompare(b.category))

  const stats = {
    categories: categories.length,
    subcategories: categories.reduce((n, c) => n + c.subcategories.length, 0),
    articles: categories.reduce((n, c) => n + c.subcategories.reduce((m, s) => m + s.items.length, 0), 0)
  }
  return { categories, warnings, stats }
}

/**
 * 列出可用分类/子分类目标（供 publish.mjs 反查显示名 → 目录名）
 */
export function listTargets(root = ARTICLES_DIR) {
  if (!fs.existsSync(root)) return []
  return readDirEntries(root)
    .filter((e) => e.isDirectory())
    .map((catEntry) => {
      const catPath = path.join(root, catEntry.name)
      const catMeta = readMeta(catPath)
      return {
        category: catMeta.title || catEntry.name,
        dir: catEntry.name,
        subcategories: readDirEntries(catPath)
          .filter((e) => e.isDirectory())
          .map((subEntry) => {
            const subMeta = readMeta(path.join(catPath, subEntry.name))
            return { name: subMeta.title || subEntry.name, dir: subEntry.name }
          })
      }
    })
}

// ===== articles.js 序列化 =====

const FILE_HEADER = `// 文章列表配置（⚠️ 本文件由 tools/sync-articles.mjs 自动生成，请勿手动编辑）
// 内容来源：docs/articles/<分类目录>/<子分类目录>/*.md
// 添加文章：把 .md 丢进对应目录（分类信息写在目录上），然后运行 npm run sync
// 支持三级目录：分类 → 子分类 → 文章
`

const SIDEBAR_FN = `// 根据文章列表生成侧边栏配置
export function generateSidebar() {
  const sidebar = {}

  articleList.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.items.forEach(article => {
        // 提取文章路径的目录部分
        const pathMatch = article.link.match(/\\/articles\\/([^/]+)\\//)
        if (pathMatch) {
          const categoryPath = \`/articles/\${pathMatch[1]}/\`

          if (!sidebar[categoryPath]) {
            sidebar[categoryPath] = []
          }

          // 查找或创建子分类组
          let subcategoryGroup = sidebar[categoryPath].find(
            group => group.text === subcategory.name
          )

          if (!subcategoryGroup) {
            subcategoryGroup = {
              text: subcategory.name,
              items: []
            }
            sidebar[categoryPath].push(subcategoryGroup)
          }

          subcategoryGroup.items.push({
            text: article.title,
            link: article.link
          })
        }
      })
    })
  })

  return sidebar
}
`

const j = (v) => JSON.stringify(v ?? '')

/**
 * 把三级分类结构序列化为 articles.js 源码
 */
export function serializeArticles(categories) {
  const blocks = categories.map((cat) => {
    const subs = cat.subcategories
      .map((sub) => {
        const items = sub.items
          .map(
            (it) =>
              `        {\n          title: ${j(it.title)},\n          link: ${j(it.link)},\n          desc: ${j(it.desc)},\n          date: ${j(it.date)}\n        }`
          )
          .join(',\n')
        return `    {\n      name: ${j(sub.name)},\n      items: [\n${items}\n      ]\n    }`
      })
      .join(',\n')
    return `  {\n    category: ${j(cat.category)},\n    icon: ${j(cat.icon)},\n    description: ${j(cat.description)},\n    subcategories: [\n${subs}\n    ]\n  }`
  })

  return `${FILE_HEADER}\nexport const articleList = [\n${blocks.join(',\n')}\n]\n\n${SIDEBAR_FN}`
}

/**
 * 写入 articles.js（内容无变化时不写，避免触发 Vite 无谓重载）
 * @returns {{ changed: boolean, path: string }}
 */
export function writeArticlesFile(categories, target = ARTICLES_JS) {
  const next = serializeArticles(categories)
  if (fs.existsSync(target) && fs.readFileSync(target, 'utf-8') === next) {
    return { changed: false, path: target }
  }
  fs.writeFileSync(target, next, 'utf-8')
  return { changed: true, path: target }
}
