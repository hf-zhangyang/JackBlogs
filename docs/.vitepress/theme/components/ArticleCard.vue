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

const fullLink = computed(() => {
  const cleanLink = props.link.replace(/^\//, '')
  return `${site.value.base}${cleanLink}`
})
</script>

<style scoped>
.card {
  background: var(--paper-card);
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid var(--line);
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(28, 25, 23, 0.05);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(28, 25, 23, 0.1);
  border-color: var(--cinnabar);
}

.title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-family: var(--font-serif);
}

.title a {
  color: var(--ink);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.title a:hover {
  color: var(--cinnabar);
}

.meta {
  font-size: 0.8125rem;
  color: var(--ink-faint);
  margin-bottom: 0.5rem;
  font-family: monospace;
}

.desc {
  font-size: 0.875rem;
  color: var(--ink-muted);
  line-height: 1.6;
}
</style>
