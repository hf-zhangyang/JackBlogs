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

// 从配置中读取文章列表
const articleList = site.value.articleList || []

const getFullLink = (link) => {
  const cleanLink = link.replace(/^\//, '')
  return `${site.value.base}${cleanLink}`
}
</script>

<style scoped>
.articles-layout {
  min-height: 100vh;
  background: #f8fafc;
  display: grid;
  grid-template-columns: 200px 1fr !important;
  gap: 1.5rem;
  padding: 1.5rem 2rem 2rem 2rem;
}

.left-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
  width: 200px !important;
  flex-shrink: 0;
}

.category-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.nav-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.25);
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
  color: #475569;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.nav-list a:hover {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  transform: translateX(4px);
}

.nav-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.main-content {
  min-width: 0;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  text-align: center;
}

.welcome-text {
  text-align: center;
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.category-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-section h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.category-desc {
  color: #64748b;
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
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.article-link:hover {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateX(4px);
}

.article-title {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.25rem;
}

.article-desc {
  display: block;
  font-size: 0.85rem;
  color: #94a3b8;
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
