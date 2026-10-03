<template>
  <div class="articles-page">
    <header class="page-header">
      <h1>技术<em>笔记</em>全目录</h1>
      <p class="welcome">
        按分类归档 · 共 {{ totalArticles }} 篇文章 · {{ articleList.length }} 个分类
      </p>
    </header>

    <section
      v-for="category in articleList"
      :key="category.category"
      :id="category.category"
      class="cat-section"
    >
      <div class="cat-header">
        <h2>{{ category.category }}</h2>
        <p class="cat-desc">{{ category.description }}</p>
      </div>

      <div
        v-for="subcategory in category.subcategories"
        :key="subcategory.name"
        class="subcat-section"
      >
        <h3 class="subcat-title">
          {{ subcategory.name }}
          <span class="count">{{ subcategory.items.length }} 篇</span>
        </h3>
        <div class="post-list">
          <a
            v-for="article in subcategory.items"
            :key="article.link"
            :href="getFullLink(article.link)"
            class="post-item"
          >
            <span class="t">{{ article.title }}</span>
            <span class="d">{{ article.desc }}</span>
            <span class="m">{{ article.date }}</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { articleList } from '../../../articles/articles.js'

const totalArticles = computed(() =>
  articleList.reduce(
    (sum, c) =>
      sum + c.subcategories.reduce((s, sub) => s + sub.items.length, 0),
    0
  )
)

const getFullLink = (link) => withBase(link.startsWith('/') ? link : `/${link}`)
</script>

<style scoped>
.articles-page {
  padding: 40px 48px 96px;
  max-width: 1152px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--ink-1);
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  border: none;
  padding: 0;
}

.page-header h1 em {
  font-style: normal;
  background: linear-gradient(120deg, #646cff 0%, #42b883 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.page-header .welcome {
  font-size: 1rem;
  color: var(--ink-3);
  margin: 0;
  line-height: 1.65;
}

.cat-section {
  margin-bottom: 44px;
  scroll-margin-top: 80px;
}

.cat-section:last-child {
  margin-bottom: 0;
}

.cat-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
}

.cat-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink-1);
  margin: 0;
  letter-spacing: -0.02em;
  border: none;
  padding: 0;
}

.cat-header .cat-desc {
  color: var(--ink-3);
  font-size: 13.5px;
  margin: 0;
}

.subcat-section {
  margin-bottom: 20px;
}

.subcat-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin: 0 0 12px;
  padding-left: 10px;
  border-left: 3px solid #646cff;
  letter-spacing: 0.02em;
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.subcat-title .count {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--ink-4);
  font-weight: 400;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.post-item {
  padding: 18px 20px;
  background: #f9f9fc;
  border-radius: 10px;
  border-left: 3px solid #646cff;
  text-decoration: none;
  color: inherit;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

.subcat-section:nth-of-type(2) .post-item { border-left-color: #42b883; }
.subcat-section:nth-of-type(3) .post-item { border-left-color: #ff8e6b; }
.subcat-section:nth-of-type(4) .post-item { border-left-color: #f0b72f; }

.post-item:hover {
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 108, 255, 0.1);
}

.post-item .t {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-1);
  line-height: 1.4;
  margin-bottom: 6px;
  letter-spacing: -0.005em;
}

.post-item:hover .t {
  color: var(--vp-c-brand-1);
}

.post-item .d {
  display: block;
  font-size: 13px;
  color: var(--ink-3);
  line-height: 1.55;
  margin-bottom: 10px;
}

.post-item .m {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--ink-4);
}

@media (max-width: 768px) {
  .articles-page {
    padding: 24px 20px 60px;
  }
}
</style>
