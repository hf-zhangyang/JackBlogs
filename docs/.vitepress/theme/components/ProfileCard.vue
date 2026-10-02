<template>
  <div class="profile-card">
    <!-- 顶部朱砂色条 -->
    <div class="card-top-bar"></div>

    <div class="avatar-wrap">
      <img src="/images/avatar.jpg" alt="头像" class="avatar-img" />
      <span class="avatar-seal">闲</span>
    </div>

    <h3 class="profile-title">偷得浮生半日闲</h3>
    <p class="profile-desc">专注后端开发、容器、Linux、微服务与 CS 应用实践</p>

    <div class="profile-meta">
      <div class="meta-item">
        <span class="meta-icon">⌬</span>
        <span class="meta-label">GitHub</span>
        <span class="meta-value">hf-zhangyang</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">✉</span>
        <span class="meta-label">邮箱</span>
        <span class="meta-value">392732502@qq.com</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">⌖</span>
        <span class="meta-label">坐标</span>
        <span class="meta-value">中国·合肥</span>
      </div>
    </div>

    <div class="card-bottom-line"></div>
  </div>
</template>

<style scoped>
.profile-card {
  background: var(--paper-card);
  border-radius: 6px;
  padding: 2rem 1.5rem 1.75rem;
  border: 1px solid var(--line);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(28, 25, 23, 0.06);
}

/* 顶部朱砂色条 */
.card-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--cinnabar);
}

/* 头像 */
.avatar-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 1.25rem;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--paper-card);
  outline: 1px solid var(--line);
  box-shadow: 0 6px 20px rgba(28, 25, 23, 0.15);
}

/* 头像角标印章 */
.avatar-seal {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cinnabar);
  color: var(--paper);
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1rem;
  border-radius: 50%;
  border: 2px solid var(--paper-card);
  box-shadow: 0 2px 8px rgba(185, 28, 28, 0.4);
}

.profile-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ink);
  text-align: center;
  margin: 0 0 0.6rem 0;
  font-family: var(--font-serif);
  letter-spacing: 0.03em;
}

.profile-desc {
  font-size: 0.85rem;
  color: var(--ink-muted);
  line-height: 1.7;
  text-align: center;
  margin: 0 0 1.25rem 0;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 1.1rem;
  border-top: 1px dashed var(--line);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.meta-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper-soft);
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--cinnabar);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.meta-label {
  color: var(--ink-muted);
  min-width: 2.5rem;
}

.meta-value {
  color: var(--ink-soft);
  font-weight: 500;
  word-break: break-all;
}

.card-bottom-line {
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--line), transparent);
}
</style>
