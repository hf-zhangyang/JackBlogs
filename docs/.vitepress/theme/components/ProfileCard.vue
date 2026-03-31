<template>
  <div class="profile-card">
    <div class="avatar">
      <img src="/images/avatar.jpg" alt="头像" class="avatar-img" />
    </div>
    <h3 class="profile-title">偷得浮生半日闲</h3>
    <p class="profile-desc">
      专注后端开发、容器、Linux、微服务与 CS 应用实践
    </p>
    <div class="profile-meta">
      <span>📧 GitHub: hf-zhangyang</span>
      <span>📮 邮箱: 392732502@qq.com</span>
      <span>📍 中国·合肥</span>
    </div>
    <div class="profile-border"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.profile-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd);
}

.avatar {
  text-align: center;
  margin-bottom: 1.5rem;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
  border: 4px solid rgba(139, 92, 246, 0.25);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
}

.profile-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin-bottom: 1rem;
}

.profile-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 1rem;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.profile-meta span {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.profile-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.25), transparent);
}
</style>
