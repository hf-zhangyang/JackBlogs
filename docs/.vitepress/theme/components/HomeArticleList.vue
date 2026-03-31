<template>
  <div class="article-section">
    <h2>📜 最新文章</h2>
    <div class="article-list">
      <a href="/articles/docker/deploy" class="article-card">
        <strong>Docker 容器部署个人服务最佳实践</strong>
        <p class="article-date">2026-03-30</p>
        <p class="article-desc">讲解 Docker 基础镜像优化、数据持久化、网络配置与多服务编排。</p>
      </a>
      <a href="/articles/backend/gitea" class="article-card">
        <strong>轻量级代码仓库 Gitea 本地搭建教程</strong>
        <p class="article-date">2026-03-28</p>
        <p class="article-desc">Docker 一键部署 Gitea，配置 HTTPS、反向代理与数据备份。</p>
      </a>
      <a href="/articles/linux/commands" class="article-card">
        <strong>Linux 常用高效运维命令合集</strong>
        <p class="article-date">2026-03-25</p>
        <p class="article-desc">日常排查网络、磁盘、进程、日志高频命令，附带单行脚本。</p>
      </a>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.article-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-card {
  display: block;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.article-card:hover {
  background: rgba(139, 92, 246, 0.05);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.article-card strong {
  color: #1e293b;
  font-size: 1.05rem;
  display: block;
}

.article-date {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.article-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
}
</style>
