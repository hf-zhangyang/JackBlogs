<template>
  <div class="home-page">
    <!-- 左侧个人资料 -->
    <aside class="left-sidebar">
      <ProfileCard />
    </aside>

    <!-- 中间内容区 -->
    <main class="main-content">
      <HeroSection />
      <HomeArticleList />
    </main>

    <!-- 右侧内容导航 -->
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
  grid-template-columns: 260px minmax(0, 1fr) 260px;
  gap: 2.5rem;
  padding: 2.5rem 4rem;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.left-sidebar {
  position: sticky;
  top: 5rem;
  height: fit-content;
}

.main-content {
  min-width: 0;
}

.right-sidebar {
  position: sticky;
  top: 5rem;
  height: fit-content;
}

@media (max-width: 1200px) {
  .home-page {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem 2rem;
  }

  .left-sidebar,
  .right-sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .home-page {
    padding: 1rem;
  }
}
</style>
