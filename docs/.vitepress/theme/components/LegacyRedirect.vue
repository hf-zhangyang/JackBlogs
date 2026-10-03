<template><!-- 无渲染组件：仅在 404 页做旧链接跳转 --></template>

<script setup>
/**
 * 旧 URL 重定向
 *
 * 分类改为「目录即分类」后，部分文章 URL 发生变化，旧链接会落到 404 页面。
 * 本组件挂在 DefaultTheme 的 layout-top 插槽：只在 404 页（page.isNotFound）执行，
 * 命中 legacy-urls.mjs 中的映射表则立即跳转到新地址，否则保持原 404 页面不动。
 */
import { onMounted } from 'vue'
import { useData, withBase } from 'vitepress'
import { resolveLegacyPath } from '../legacy-urls.mjs'

const { page, site } = useData()

onMounted(() => {
  if (!page.value?.isNotFound) return
  const base = site.value?.base || '/'
  const target = resolveLegacyPath(window.location.pathname, base)
  if (!target) return
  window.location.replace(withBase(target) + window.location.hash)
})
</script>
