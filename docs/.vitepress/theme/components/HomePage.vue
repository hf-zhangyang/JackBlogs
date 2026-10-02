<template>
  <div class="home-page">
    <!-- 左侧栏：作者信息 -->
    <aside class="left-sidebar">
      <ProfileCard />
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <HeroSection />
      <HomeArticleList />
    </main>

    <!-- 右侧栏：目录 -->
    <aside class="right-sidebar">
      <DocNav />
    </aside>
  </div>
</template>

<script setup>
import ProfileCard from './ProfileCard.vue'
import HeroSection from './HeroSection.vue'
import HomeArticleList from './HomeArticleList.vue'
import DocNav from './DocNav.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--paper);
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 260px;
  gap: 3.5rem;
  padding: 3.5rem 4rem 4rem;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.left-sidebar,
.right-sidebar {
  padding-top: 1rem;
}

.left-sidebar > *,
.right-sidebar > * {
  position: sticky;
  top: 5rem;
  height: fit-content;
}

.main-content {
  min-width: 0;
}

@media (max-width: 1200px) {
  .home-page {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 2rem 2rem 3rem;
  }

  .left-sidebar > *,
  .right-sidebar > * {
    position: static;
  }
}

@media (max-width: 640px) {
  .home-page {
    padding: 1.25rem 1rem 2rem;
  }
}
</style>
