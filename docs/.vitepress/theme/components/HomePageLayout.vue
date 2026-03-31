<template>
  <div class="home-page-layout">
    <div class="layout-container">
      <!-- 左侧个人资料 -->
      <aside class="left-sidebar">
        <ProfileCard />
      </aside>

      <!-- 中间内容区 -->
      <main class="main-content">
        <slot />
      </main>

      <!-- 右侧文档导航 -->
      <aside class="right-sidebar">
        <DocNav />
      </aside>
    </div>
  </div>
</template>

<script setup>
import ProfileCard from './ProfileCard.vue'
import DocNav from './DocNav.vue'
</script>

<style scoped>
.home-page-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #0a192f 100%);
}

.layout-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 2rem;
  align-items: start;
}

.left-sidebar {
  position: sticky;
  top: 2rem;
}

.main-content {
  min-width: 0;
}

.right-sidebar {
  position: sticky;
  top: 2rem;
}

@media (max-width: 1200px) {
  .layout-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .left-sidebar,
  .right-sidebar {
    position: static;
  }
}
</style>
