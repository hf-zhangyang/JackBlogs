/**
 * 旧 URL → 新 URL 映射表
 *
 * 背景：分类改为「目录即分类」（docs/articles/<分类>/<子分类>/<文章>.md）后，
 * 部分文章 URL 发生变化，旧链接会落到 404。LegacyRedirect.vue 在 404 页读取本表做跳转。
 *
 * 新增一条：'旧路径': '新路径'（站点内路径，不含 base，不要写 .html）
 *   '/articles/docker/deploy': '/articles/container/docker/deploy'
 */

export const LEGACY_MAP = {
  '/articles/docker/deploy': '/articles/container/docker/deploy',
  '/articles/backend/gitea': '/articles/backend/tools/gitea',
  '/articles/linux/commands': '/articles/linux/basic-commands/commands',
  // 示例文章已下线（旧发布工具的测试残留，内容与 Docker Compose 主题重复）
  '/articles/容器与运维/示例文章-muqfbyqn': '/articles/',
  '/articles/容器与运维/示例文章-muqfd9tx': '/articles/'
}

/**
 * 归一化路径：去掉 base 前缀、解码、抹平 .html / index.html / 结尾斜杠差异
 * @param {string} pathname window.location.pathname
 * @param {string} base 站点 base，如 '/JackBlogs/'
 * @returns {string} 形如 '/articles/docker/deploy'，站点根为 '/'
 */
export function normalizePath(pathname, base) {
  let p = pathname || '/'
  if (base && base !== '/' && p.startsWith(base)) p = '/' + p.slice(base.length)
  try {
    p = decodeURIComponent(p)
  } catch {
    /* 非法编码时按原样比较 */
  }
  return p.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/+$/, '') || '/'
}

/**
 * 查询旧路径对应的新路径
 * @returns {string|null} 新路径（未命中返回 null）
 */
export function resolveLegacyPath(pathname, base) {
  return LEGACY_MAP[normalizePath(pathname, base)] ?? null
}
