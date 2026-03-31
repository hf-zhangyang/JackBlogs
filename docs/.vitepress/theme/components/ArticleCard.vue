<template>
  <div class="card">
    <h3 class="title">
      <a :href="fullLink">{{ title }}</a>
    </h3>
    <div class="meta">{{ date }}</div>
    <p class="desc">{{ desc }}</p>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const props = defineProps(['title', 'date', 'desc', 'link'])
const { site } = useData()

// 自动拼接 base 路径，支持 GitHub Pages 部署
const fullLink = computed(() => {
  // 移除 link 开头的斜杠，避免重复
  const cleanLink = props.link.replace(/^\//, '')
  return `${site.value.base}${cleanLink}`
})
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
  background: rgba(255, 255, 255, 1);
  border-color: rgba(139, 92, 246, 0.35);
}

.title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.title a {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.title a:hover {
  color: #a78bfa;
  text-decoration: underline;
}

.meta {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
}
</style>
