<template>
  <nav class="doc-nav">
    <h3 class="nav-title">
      <span class="nav-title-text">内容导航</span>
      <span class="nav-title-en">Contents</span>
    </h3>

    <ul class="nav-list">
      <li v-for="(category, index) in articleList" :key="index" class="category-item">
        <div
          @click.stop="toggleCategory(index)"
          class="category-link"
          :class="{ active: expandedCategories[index] }"
        >
          <span class="nav-icon"></span>
          <span class="category-text">{{ category.category }}</span>
          <svg
            class="toggle-icon"
            :class="{ rotated: expandedCategories[index] }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        <transition name="expand">
          <div v-show="expandedCategories[index]" class="subcategory-wrapper">
            <div
              v-for="(subcategory, subIndex) in category.subcategories"
              :key="`${index}-${subIndex}`"
              class="subcategory-item"
            >
              <div
                @click.stop="toggleSubcategory(index, subIndex)"
                class="subcategory-link"
                :class="{ active: expandedSubcategories[`${index}-${subIndex}`] }"
              >
                <span class="subcategory-text">{{ subcategory.name }}</span>
                <span class="article-count">{{ subcategory.items.length }}</span>
                <svg
                  class="toggle-icon sm"
                  :class="{ rotated: expandedSubcategories[`${index}-${subIndex}`] }"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              <transition name="expand">
                <div v-show="expandedSubcategories[`${index}-${subIndex}`]" class="article-wrapper">
                  <a
                    v-for="(article, articleIndex) in subcategory.items"
                    :key="`${index}-${subIndex}-${articleIndex}`"
                    :href="getFullLink(article.link)"
                    class="article-link"
                  >
                    <span class="article-dot"></span>
                    <span class="article-title">{{ article.title }}</span>
                  </a>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { articleList } from '../../../articles/articles.js'

const expandedCategories = ref({})
const expandedSubcategories = ref({})

const toggleCategory = (index) => {
  expandedCategories.value[index] = !expandedCategories.value[index]
}

const toggleSubcategory = (categoryIndex, subcategoryIndex) => {
  const key = `${categoryIndex}-${subcategoryIndex}`
  expandedSubcategories.value[key] = !expandedSubcategories.value[key]
}

const getFullLink = (link) => withBase(link)
</script>

<style scoped>
.doc-nav {
  background: var(--paper-card);
  border-radius: 6px;
  padding: 1.25rem;
  border: 1px solid var(--line);
  box-shadow: 0 2px 12px rgba(28, 25, 23, 0.06);
}

.nav-title {
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.nav-title-text {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--ink);
  font-family: var(--font-serif);
  letter-spacing: 0.12em;
}

.nav-title-en {
  font-size: 0.65rem;
  color: var(--ink-faint);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  margin-bottom: 0.25rem;
}

/* 一级目录 */
.category-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.625rem;
  color: var(--ink);
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}

.category-link:hover {
  background: var(--cinnabar-soft);
  color: var(--cinnabar);
}

.category-link:hover,
.category-link.active {
  color: var(--cinnabar);
  background: var(--cinnabar-soft);
}

.nav-icon {
  width: 4px;
  height: 1rem;
  background: var(--cinnabar);
  border-radius: 1px;
  flex-shrink: 0;
  transition: background 0.2s, height 0.2s;
}

.category-link:hover .nav-icon,
.category-link.active .nav-icon {
  background: var(--jade);
  height: 1.2rem;
}

.category-text {
  flex: 1;
}

.toggle-icon {
  width: 14px;
  height: 14px;
  color: var(--ink-faint);
  transition: transform 0.25s, color 0.2s;
  flex-shrink: 0;
}

.toggle-icon.sm {
  width: 12px;
  height: 12px;
}

.toggle-icon.rotated {
  transform: rotate(90deg);
}

.category-link:hover .toggle-icon {
  color: var(--cinnabar);
}

/* 二级目录 */
.subcategory-wrapper {
  padding: 0.25rem 0 0.25rem 0.5rem;
  border-left: 1px solid var(--line-soft);
  margin-left: 1rem;
}

.subcategory-item {
  margin-bottom: 0.2rem;
}

.subcategory-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
  color: var(--ink-soft);
  border-radius: 3px;
  transition: all 0.2s;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.subcategory-link:hover {
  background: var(--paper-soft);
  color: var(--cinnabar);
}

.subcategory-link:hover,
.subcategory-link.active {
  color: var(--cinnabar);
}

.subcategory-text {
  flex: 1;
}

.article-count {
  font-size: 0.65rem;
  color: var(--ink-faint);
  padding: 0.05rem 0.4rem;
  background: var(--paper-soft);
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  font-weight: 600;
}

/* 三级：文章链接 */
.article-wrapper {
  padding: 0.2rem 0 0.2rem 0.75rem;
  margin-left: 0.5rem;
  border-left: 1px solid var(--line-soft);
}

.article-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  color: var(--ink-muted);
  border-radius: 3px;
  transition: all 0.2s;
  font-size: 0.8rem;
  text-decoration: none;
}

.article-link:hover {
  background: var(--jade-soft);
  color: var(--jade);
}

.article-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--line);
  flex-shrink: 0;
  transition: background 0.2s;
}

.article-link:hover .article-dot {
  background: var(--jade);
}

.article-title {
  flex: 1;
  line-height: 1.4;
}

/* 折叠动画 */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
