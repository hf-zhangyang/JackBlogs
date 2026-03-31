<template>
  <div class="custom-home-layout">
    <!-- 左侧栏 - 个人资料 -->
    <aside class="left-sidebar">
      <ProfileCard />
    </aside>

    <!-- 中间内容区 -->
    <main class="main-content">
      <slot />
    </main>

    <!-- 右侧栏 - 文档导航 -->
    <aside class="right-sidebar">
      <DocNav />
    </aside>
  </div>
</template>

<script setup>
import ProfileCard from '../components/ProfileCard.vue'
import DocNav from '../components/DocNav.vue'
</script>

<style>
/* 隐藏VitePress默认的内容容器限制 */
.custom-home-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #0a192f 100%);
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 2rem;
  padding: 2rem;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  position: relative;
  left: 0;
  right: 0;
}

.left-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
  width: 280px;
}

.main-content {
  min-width: 0;
}

.right-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
  width: 280px;
}

@media (max-width: 1200px) {
  .custom-home-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-left: 0;
    width: 100%;
  }

  .left-sidebar,
  .right-sidebar {
    position: static;
  }
}
</style>
