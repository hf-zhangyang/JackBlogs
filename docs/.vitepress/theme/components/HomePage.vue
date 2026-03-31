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
  background: #f8fafc;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 280px;
  gap: 3rem;
  padding: 4rem 6rem;
  width: 100%;
}

.left-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.main-content {
  min-width: 0;
}

.right-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

@media (max-width: 1200px) {
  .home-page {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .left-sidebar,
  .right-sidebar {
    position: static;
  }
}
</style>
