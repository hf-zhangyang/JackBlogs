<template>
  <div class="article-list-summary">
    <div v-for="category in articleList" :key="category.category" class="category-item">
      <h4>{{ category.icon }} {{ category.category }}</h4>
      <p>{{ category.description }}</p>
      <div class="subcategory-list">
        <div v-for="subcategory in category.subcategories" :key="subcategory.name" class="subcategory">
          <span class="subcategory-name">{{ subcategory.name }}</span>
          <span class="subcategory-count">({{ subcategory.items.length }}篇)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

const { theme } = useData()

// 从配置中读取文章列表
const articleList = theme.value.articleList || []
</script>

<style scoped>
.article-list-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.category-item {
  text-align: center !important;
  max-width: 600px;
}

.category-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center !important;
}

.category-item p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
  text-align: center !important;
}

.subcategory-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.subcategory {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 6px;
  font-size: 0.875rem;
}

.subcategory-name {
  color: #475569;
  font-weight: 500;
}

.subcategory-count {
  color: #8b5cf6;
  font-size: 0.75rem;
}
</style>
