<template>
  <div class="articles-page">
    <!-- 左侧栏 - 分类导航 -->
    <aside class="left-sidebar">
      <div class="category-nav">
        <h3 class="nav-title">
          <span class="nav-title-text">分类</span>
          <span class="nav-title-en">Categories</span>
        </h3>
        <ul class="nav-list">
          <li v-for="category in articleList" :key="category.category">
            <a :href="'#' + category.category" @click.prevent="scrollToCategory(category.category)">
              <span class="nav-icon"></span>
              {{ category.category }}
            </a>
          </li>
        </ul>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <header class="page-header">
          <h1 class="page-title">技术博客</h1>
          <p class="welcome-text">
            记录后端开发、容器化、运维和架构方面的实践心得
          </p>
          <div class="header-deco"></div>
        </header>

        <div
          v-for="category in articleList"
          :key="category.category"
          :id="category.category"
          class="category-section"
        >
          <div class="category-header">
            <h2>
              <span class="cat-icon"></span>
              {{ category.category }}
            </h2>
            <p class="category-desc">{{ category.description }}</p>
          </div>

          <!-- 遍历子分类 -->
          <div
            v-for="subcategory in category.subcategories"
            :key="subcategory.name"
            class="subcategory-section"
          >
            <h3 class="subcategory-title">
              <span class="book-dot"></span>
              {{ subcategory.name }}
              <span class="article-count">{{ subcategory.items.length }} 篇</span>
            </h3>
            <div class="article-links">
              <a
                v-for="article in subcategory.items"
                :key="article.link"
                :href="getFullLink(article.link)"
                class="article-link"
              >
                <span class="link-arrow">›</span>
                <div class="link-body">
                  <span class="article-title">{{ article.title }}</span>
                  <span class="article-desc">{{ article.desc }}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { articleList } from '../../../articles/articles.js'
import { withBase } from 'vitepress'

const getFullLink = (link) => {
  return withBase(link.startsWith('/') ? link : `/${link}`)
}

const scrollToCategory = (categoryId) => {
  const element = document.getElementById(categoryId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
  background: var(--paper);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.left-sidebar {
  position: sticky;
  top: 5rem;
  height: fit-content;
}

.category-nav {
  background: var(--paper-card);
  border-radius: 6px;
  padding: 1.25rem;
  border: 1px solid var(--line);
  box-shadow: 0 2px 12px rgba(28, 25, 23, 0.06);
}

.nav-title {
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.nav-title-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--font-serif);
}

.nav-title-en {
  font-size: 0.65rem;
  color: var(--ink-faint);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 0.25rem;
}

.nav-list a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: var(--ink-soft);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 0.9rem;
  cursor: pointer;
}

.nav-list a:hover {
  background: var(--cinnabar-soft);
  color: var(--cinnabar);
  transform: translateX(3px);
}

.nav-icon {
  width: 4px;
  height: 0.9rem;
  background: var(--cinnabar);
  border-radius: 1px;
  flex-shrink: 0;
  transition: background 0.2s;
}

.nav-list a:hover .nav-icon {
  background: var(--jade);
}

.main-content {
  min-width: 0;
}

.content-wrapper {
  background: var(--paper-card);
  border-radius: 6px;
  padding: 2.5rem;
  border: 1px solid var(--line);
  box-shadow: 0 2px 12px rgba(28, 25, 23, 0.06);
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--ink);
  margin: 0 0 0.5rem 0;
  font-family: var(--font-serif);
  letter-spacing: 0.05em;
}

.welcome-text {
  color: var(--ink-muted);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.7;
}

.header-deco {
  width: 64px;
  height: 3px;
  background: var(--cinnabar);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.category-section {
  margin-bottom: 2.5rem;
  scroll-margin-top: 5rem;
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-header {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--line-soft);
}

.category-header h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 0.4rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-serif);
}

.cat-icon {
  width: 5px;
  height: 1.3rem;
  background: var(--cinnabar);
  border-radius: 1px;
  flex-shrink: 0;
}

.category-desc {
  color: var(--ink-muted);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.6;
}

.subcategory-section {
  margin-bottom: 1.25rem;
}

.subcategory-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink-soft);
  margin: 0 0 0.875rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.book-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cinnabar);
}

.article-count {
  font-size: 0.7rem;
  color: var(--ink-faint);
  font-weight: 400;
}

.article-links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.article-link {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--paper-soft);
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.2s;
}

.article-link:hover {
  background: var(--paper-card);
  border-color: var(--line);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(28, 25, 23, 0.06);
}

.link-arrow {
  color: var(--ink-faint);
  font-size: 1.3rem;
  line-height: 1.2;
  transition: color 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.article-link:hover .link-arrow {
  color: var(--cinnabar);
  transform: translateX(2px);
}

.link-body {
  flex: 1;
  min-width: 0;
}

.article-title {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.article-link:hover .article-title {
  color: var(--cinnabar);
}

.article-desc {
  display: block;
  font-size: 0.85rem;
  color: var(--ink-muted);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .articles-page {
    grid-template-columns: 1fr;
  }
  .left-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .articles-page {
    padding: 1rem;
  }
  .content-wrapper {
    padding: 1.5rem;
  }
}
</style>
