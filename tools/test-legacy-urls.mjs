#!/usr/bin/env node
/**
 * 旧 URL 重定向映射表测试
 *
 * 用法：node tools/test-legacy-urls.mjs
 *
 * 覆盖：带/不带 .html、带/不带结尾斜杠、中文路径的 percent-encoding、
 *       base 前缀的有无，以及"新 URL 不应误命中"的反例。
 * 修改 docs/.vitepress/theme/legacy-urls.mjs 的映射表后请重跑本测试。
 */

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { LEGACY_MAP, resolveLegacyPath } from '../docs/.vitepress/theme/legacy-urls.mjs'

const BASE = '/JackBlogs/'
const zh = (s) => encodeURIComponent(s)
const cases = [
  // 命中：各种等价写法
  [`${BASE}articles/docker/deploy`, '/articles/container/docker/deploy'],
  [`${BASE}articles/docker/deploy.html`, '/articles/container/docker/deploy'],
  [`${BASE}articles/docker/deploy/`, '/articles/container/docker/deploy'],
  [`/articles/docker/deploy`, '/articles/container/docker/deploy'], // 无 base（dev 根路径）
  [`${BASE}articles/backend/gitea`, '/articles/backend/tools/gitea'],
  [`${BASE}articles/linux/commands`, '/articles/linux/basic-commands/commands'],
  // 中文路径：浏览器实际发送的是 percent-encoded 形式
  [`${BASE}articles/${zh('容器与运维')}/${zh('示例文章-muqfbyqn')}`, '/articles/'],
  // 反例：新 URL 与不存在的路径都不应命中
  [`${BASE}articles/container/docker/deploy`, null],
  [`${BASE}articles/backend/design-patterns/thread-safe-singleton`, null],
  [`${BASE}articles/`, null],
  [`${BASE}nope`, null],
  [`${BASE}`, null]
]

let failed = 0
for (const [input, expected] of cases) {
  const got = resolveLegacyPath(input, BASE)
  const pass = got === expected
  if (!pass) failed++
  console.log(`${pass ? '✅' : '❌'} ${input}\n     实际：${got}${pass ? '' : `   期望：${expected}`}`)
}

console.log(`\n映射表条目：${Object.keys(LEGACY_MAP).length} 条 · 用例 ${cases.length} 个 · 通过 ${cases.length - failed} · 失败 ${failed}`)
process.exit(failed === 0 ? 0 : 1)
