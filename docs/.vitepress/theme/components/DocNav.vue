<template>
  <div class="doc-nav">
    <h3 class="nav-title">
      <span class="nav-title-icon">📚</span>
      <span>内容导航</span>
    </h3>
    <div class="nav-section">
      <ul class="nav-list">
        <li v-for="(category, index) in articleList" :key="index" class="category-item">
          <!-- 一级目录 -->
          <div
            @click.stop="toggleCategory(index)"
            class="category-link"
            :class="{ active: expandedCategories[index] }"
          >
            <span class="nav-icon">{{ category.icon }}</span>
            <span class="category-text">{{ category.category }}</span>
            <span class="toggle-btn">
              <svg :class="{ rotated: expandedCategories[index] }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <!-- 二级目录（子分类） -->
          <transition name="expand">
            <div v-show="expandedCategories[index]" class="subcategory-wrapper">
              <div v-for="(subcategory, subIndex) in category.subcategories" :key="`${index}-${subIndex}`" class="subcategory-item">
                <div
                  @click.stop="toggleSubcategory(index, subIndex)"
                  class="subcategory-link"
                  :class="{ active: expandedSubcategories[`${index}-${subIndex}`] }"
                >
                  <span class="subcategory-icon">
                    📖
                  </span>
                  <span class="subcategory-text">{{ subcategory.name }}</span>
                  <span class="article-count">{{ subcategory.items.length }}</span>
                  <span class="toggle-btn">
                    <svg :class="{ rotated: expandedSubcategories[`${index}-${subIndex}`] }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </div>

                <!-- 三级：文章链接 -->
                <transition name="expand">
                  <div v-show="expandedSubcategories[`${index}-${subIndex}`]" class="article-wrapper">
                    <a
                      v-for="(article, articleIndex) in subcategory.items"
                      :key="`${index}-${subIndex}-${articleIndex}`"
                      :href="getFullLink(article.link)"
                      class="article-link"
                    >
                      <span class="article-dot">📄</span>
                      <span class="article-title">{{ article.title }}</span>
                    </a>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vitepress'
import { articleList } from '../../../articles/articles.js'

const route = useRoute()

// 展开状态
const expandedCategories = ref({})
const expandedSubcategories = ref({})

// 切换一级目录展开/收起
const toggleCategory = (index) => {
  expandedCategories.value[index] = !expandedCategories.value[index]
}

// 切换二级目录展开/收起
const toggleSubcategory = (categoryIndex, subcategoryIndex) => {
  const key = `${categoryIndex}-${subcategoryIndex}`
  expandedSubcategories.value[key] = !expandedSubcategories.value[key]
}

// 生成完整链接
const getFullLink = (link) => {
  // 开发环境使用根路径
  return link.startsWith('/') ? link : `/${link}`
}
</script>

<style scoped>
.doc-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem 1.25rem;
  border: 1px solid rgba(139, 92, 246, 0.15);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.nav-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-title-icon {
  font-size: 1.5rem;
}

.nav-section {
  margin-bottom: 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  margin-bottom: 0.5rem;
}

/* 一级目录 */
.category-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  color: #1e293b;
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
}

.category-link:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(167, 155, 250, 0.05) 100%);
  color: #8b5cf6;
  transform: translateX(4px);
}

.category-link.active {
  color: #8b5cf6;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 155, 250, 0.08) 100%);
  border-color: rgba(139, 92, 246, 0.2);
}

.nav-icon {
  font-size: 1.35rem;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(139, 92, 246, 0.15));
}

.category-text {
  flex: 1;
}

.toggle-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
  flex-shrink: 0;
  color: #94a3b8;
}

.category-link:hover .toggle-btn {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.toggle-btn svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-btn svg.rotated {
  transform: rotate(90deg);
}

/* 二级目录容器 */
.subcategory-wrapper {
  padding: 0.25rem 0 0.5rem 0;
}

.subcategory-item {
  margin-bottom: 0.375rem;
}

.subcategory-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  margin-left: 0.5rem;
  color: #1e293b;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
}

.subcategory-link:hover {
  background: rgba(139, 92, 246, 0.06);
  color: #8b5cf6;
  transform: translateX(2px);
}

.subcategory-link.active {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.15);
}

.subcategory-icon {
  font-size: 1.5rem;
  color: #8b5cf6;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.book-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.subcategory-text {
  flex: 1;
}

.article-count {
  font-size: 0.75rem;
  color: #94a3b8;
  padding: 0.125rem 0.5rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 10px;
  font-weight: 600;
}

/* 三级：文章链接 */
.article-wrapper {
  padding: 0.25rem 0 0.25rem 1.25rem;
}

.article-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #475569;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.95rem;
  text-decoration: none;
  border: 1px solid transparent;
}

.article-link:hover {
  background: rgba(139, 92, 246, 0.06);
  color: #8b5cf6;
  transform: translateX(4px);
  border-color: rgba(139, 92, 246, 0.15);
}

.article-dot {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.article-title {
  flex: 1;
  line-height: 1.4;
}

/* 折叠动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-8px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: scaleY(1) translateY(0);
}
</style>
