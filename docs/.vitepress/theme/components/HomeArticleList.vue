<template>
  <section class="article-section">
    <header class="section-header">
      <h2 class="section-title">
        <span class="title-ink">最新文章</span>
        <span class="title-en">Recent Writings</span>
      </h2>
      <span class="section-deco"></span>
    </header>

    <div class="article-list">
      <a
        v-for="article in articles"
        :key="article.link"
        :href="withBase(article.link)"
        class="article-card"
      >
        <div class="card-left">
          <span class="article-icon">{{ article.seal }}</span>
        </div>
        <div class="card-body">
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-desc">{{ article.desc }}</p>
          <div class="article-meta">
            <span class="meta-date">{{ article.date }}</span>
            <span class="meta-tag">{{ article.tag }}</span>
          </div>
        </div>
        <span class="card-arrow">→</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { withBase } from 'vitepress'

const articles = [
  {
    title: 'Docker 容器部署个人服务最佳实践',
    desc: '讲解 Docker 基础镜像优化、数据持久化、网络配置与多服务编排。',
    date: '2026-03-30',
    tag: '容器运维',
    seal: '容',
    link: '/articles/docker/deploy'
  },
  {
    title: '轻量级代码仓库 Gitea 本地搭建教程',
    desc: 'Docker 一键部署 Gitea，配置 HTTPS、反向代理与数据备份。',
    date: '2026-03-28',
    tag: '后端工具',
    seal: '码',
    link: '/articles/backend/gitea'
  },
  {
    title: 'Linux 常用高效运维命令合集',
    desc: '日常排查网络、磁盘、进程、日志高频命令，附带单行脚本。',
    date: '2026-03-25',
    tag: 'Linux',
    seal: '令',
    link: '/articles/linux/commands'
  }
]
</script>

<style scoped>
.article-section {
  background: var(--paper-card);
  padding: 1.75rem;
  border-radius: 6px;
  border: 1px solid var(--line);
  box-shadow: 0 2px 12px rgba(28, 25, 23, 0.06);
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--line-soft);
}

.section-title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.title-ink {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--ink);
  font-family: var(--font-serif);
  letter-spacing: 0.05em;
}

.title-en {
  font-size: 0.7rem;
  color: var(--ink-faint);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 400;
}

.section-deco {
  width: 48px;
  height: 3px;
  background: var(--cinnabar);
  border-radius: 2px;
}

.section-title {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
}

.title-ink {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--ink);
  font-family: var(--font-serif);
  letter-spacing: 0.12em;
}

.title-en {
  font-size: 0.65rem;
  color: var(--ink-faint);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.section-note {
  font-size: 0.7rem;
  color: var(--ink-muted);
  letter-spacing: 0.15em;
}

/* 行式列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.article-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  background: var(--paper-soft);
  border: 1px solid var(--line-soft);
  border-left: 3px solid transparent;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover {
  background: var(--paper-card);
  border-left-color: var(--cinnabar);
  border-color: var(--line);
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(28, 25, 23, 0.08);
}

.card-left {
  flex-shrink: 0;
}

.article-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--cinnabar);
  color: var(--paper);
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 4px;
  transform: rotate(-3deg);
  box-shadow: 0 2px 8px rgba(185, 28, 28, 0.3);
  transition: transform 0.25s;
}

.article-card:hover .article-icon {
  transform: rotate(0deg) scale(1.05);
}

.card-body {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 0.3rem 0;
  line-height: 1.4;
  font-family: var(--font-serif);
}

.article-card:hover .article-title {
  color: var(--cinnabar);
}

.article-desc {
  font-size: 0.85rem;
  color: var(--ink-muted);
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
}

.meta-date {
  color: var(--ink-faint);
  font-family: monospace;
}

.meta-tag {
  color: var(--jade);
  padding: 0.1rem 0.5rem;
  background: var(--jade-soft);
  border-radius: 3px;
  font-weight: 500;
}

.card-arrow {
  flex-shrink: 0;
  color: var(--ink-faint);
  font-size: 1.1rem;
  transition: all 0.25s;
}

.article-card:hover .card-arrow {
  color: var(--cinnabar);
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .article-card {
    flex-wrap: wrap;
  }
}
</style>
