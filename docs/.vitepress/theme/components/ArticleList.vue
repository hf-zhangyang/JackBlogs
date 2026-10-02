<template>
  <div class="articles-layout">
    <!-- 左侧栏 - 分类导航 -->
    <aside class="left-sidebar">
      <div class="category-nav">
        <h3 class="nav-title">📚 分类</h3>
        <ul class="nav-list">
          <li v-for="category in articleList" :key="category.category">
            <a :href="'#' + category.category">
              <span class="nav-icon">{{ category.icon }}</span>
              {{ category.category }}
            </a>
          </li>
        </ul>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <h1 class="page-title">博客文章</h1>
        <p class="welcome-text">欢迎来到我的技术博客！这里记录了我在后端开发、容器化、运维和架构方面的实践心得。</p>

        <div v-for="category in articleList" :key="category.category" :id="category.category" class="category-section">
          <h2>{{ category.icon }} {{ category.category }}</h2>
          <p class="category-desc">{{ category.description }}</p>
          <div class="article-links">
            <a v-for="article in category.items" :key="article.link"
               :href="getFullLink(article.link)"
               class="article-link">
              <span class="article-title">{{ article.title }}</span>
              <span class="article-desc">{{ article.desc }}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

const { site } = useData()
const articleList = site.value.articleList || []

const getFullLink = (link) => {
  const cleanLink = link.replace(/^\//, '')
  return `${site.value.base}${cleanLink}`
}
</script>

<style scoped>
.articles-layout {
  min-height: 100vh;
  background: var(--paper);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.5rem 2rem 2rem 2rem;
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
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-serif);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 0.5rem;
}

.nav-list a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: var(--ink-soft);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.nav-list a:hover {
  background: var(--cinnabar-soft);
  color: var(--cinnabar);
  transform: translateX(3px);
}

.nav-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.main-content {
  min-width: 0;
}

.content-wrapper {
  background: var(--paper-card);
  border-radius: 6px;
  padding: 2rem;
  border: 1px solid var(--line);
  box-shadow: 0 2px 12px rgba(28, 25, 23, 0.06);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 0.75rem;
  text-align: center;
  font-family: var(--font-serif);
}

.welcome-text {
  text-align: center;
  color: var(--ink-muted);
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.category-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--paper-soft);
  border-radius: 6px;
  border: 1px solid var(--line-soft);
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-section h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 0.5rem;
  font-family: var(--font-serif);
}

.category-desc {
  color: var(--ink-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.article-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.article-link {
  display: block;
  padding: 1rem 1.25rem;
  background: var(--paper-card);
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.2s;
}

.article-link:hover {
  border-left: 3px solid var(--cinnabar);
  border-color: var(--line);
  transform: translateX(3px);
}

.article-title {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.25rem;
}

.article-link:hover .article-title {
  color: var(--cinnabar);
}

.article-desc {
  display: block;
  font-size: 0.85rem;
  color: var(--ink-muted);
}

@media (max-width: 1024px) {
  .articles-layout {
    grid-template-columns: 1fr;
  }
  .left-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .articles-layout {
    padding: 1rem;
  }
  .content-wrapper {
    padding: 1.5rem;
  }
}
</style>
