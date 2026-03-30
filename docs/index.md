---
layout: home

hero:
  name: "ShenChuanChao"
  text: "个人技术博客"
  tagline: 专注后端开发、容器、Linux 与微服务实践
  actions:
    - theme: brand
      text: 全部文章 →
      link: /articles/
    - theme: alt
      text: 关于我
      link: /about/

features:
  - title: 🐳 容器与运维
    details: Docker、K8s、PVE、Linux 运维实践与部署笔记
  - title: 💻 后端开发
    details: .NET、微服务、消息队列、架构设计与代码优化
  - title: 📝 学习笔记
    details: 大模型本地部署、工具折腾、踩坑总结
---

# 最新文章

<div class="article-list">

<ArticleCard
  title="Docker 容器部署个人服务最佳实践"
  date="2026-03-30"
  desc="讲解 Docker 基础镜像优化、数据持久化、网络配置与多服务编排。"
  link="/articles/docker-deploy/"
/>

<ArticleCard
  title="轻量级代码仓库 Gitea 本地搭建教程"
  date="2026-03-28"
  desc="Docker 一键部署 Gitea，配置 HTTPS、反向代理与数据备份。"
  link="/articles/gitea/"
/>

<ArticleCard
  title="Linux 常用高效运维命令合集"
  date="2026-03-25"
  desc="日常排查网络、磁盘、进程、日志高频命令，附带单行脚本。"
  link="/articles/linux-commands/"
/>

</div>

<style>
.article-list {
  margin-top: 2rem;
}
</style>