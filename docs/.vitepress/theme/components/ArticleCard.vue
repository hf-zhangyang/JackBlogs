<template>
  <div class="card">
    <h3 class="title">
      <a :href="link">{{ title }}</a>
    </h3>
    <div class="meta">{{ date }}</div>
    <p class="desc">{{ desc }}</p>
  </div>
</template>

<script setup>
defineProps(['title', 'date', 'desc', 'link'])
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}
.title {
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}
.title a {
  color: #2d3748;
  text-decoration: none;
}
.title a:hover {
  color: #3b82f6;
}
.meta {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.6rem;
}
.desc {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.6;
}
</style>