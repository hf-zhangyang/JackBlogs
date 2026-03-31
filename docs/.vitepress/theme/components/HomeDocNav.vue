<template>
  <div class="doc-nav">
    <h3>📚 内容导航</h3>
    <div class="nav-links">
      <a href="/articles/docker/deploy">📘 容器与运维</a>
      <a href="/articles/linux/commands">📗 Linux 运维</a>
      <a href="/articles/backend/gitea">📙 后端开发</a>
    </div>
  </div>
</template>

<script setup>
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

.doc-nav h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.2);
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-links a {
  padding: 0.75rem 1rem;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 8px;
  text-decoration: none;
  color: #475569;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.nav-links a:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
  transform: translateX(4px);
}
</style>
