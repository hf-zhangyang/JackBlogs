<template>
  <figure class="hero-section">
    <!-- 水墨画卷底图 -->
    <div class="hero-image-wrap">
      <img :src="withBase('/images/hero.jpg')" alt="天地人" class="hero-image" />
      <div class="hero-overlay"></div>
    </div>

    <!-- 竖排书法诗词 -->
    <div class="poetry-scroll">
      <div class="poetry-inner">
        <h1 class="poetry-title">天地人</h1>
        <p class="poetry-line">三才者，天地人</p>
        <p class="poetry-line">天有阴阳，运化四时</p>
        <p class="poetry-line">地有刚柔，承载万物</p>
        <p class="poetry-line">人禀中和，参赞天地</p>
        <p class="poetry-line">天人合一，道法自然</p>
      </div>
      <!-- 朱砂印章 -->
      <span class="seal">印</span>
    </div>
  </figure>
</template>

<script setup>
import { withBase } from 'vitepress'
</script>

<style scoped>
.hero-section {
  position: relative;
  margin-bottom: 2.5rem;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(28, 25, 23, 0.15);
}

.hero-image-wrap {
  position: relative;
  width: 100%;
  height: 280px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(0.9) contrast(1.03) brightness(1.05);
}

/* 画面上的水墨晕染遮罩（轻量，保留底图通透感） */
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(28, 25, 23, 0.28) 0%, rgba(28, 25, 23, 0.05) 50%, rgba(28, 25, 23, 0.15) 100%),
    radial-gradient(ellipse at 30% 50%, rgba(28, 25, 23, 0.08) 0%, transparent 70%);
}

/* 竖排书法诗词 */
.poetry-scroll {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.2rem;
  background: rgba(245, 240, 230, 0.55);
  backdrop-filter: blur(1px);
  border: 1px solid rgba(217, 207, 188, 0.5);
  border-radius: 2px;
  box-shadow: 0 4px 20px rgba(28, 25, 23, 0.25);
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.poetry-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.poetry-title {
  font-size: 1.9rem;
  font-weight: 900;
  color: var(--cinnabar);
  margin: 0 0 0.6rem 0;
  font-family: var(--font-serif);
  letter-spacing: 0.5em;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.poetry-line {
  font-size: 1rem;
  color: var(--ink);
  margin: 0;
  line-height: 2.1;
  font-family: var(--font-serif);
  font-weight: 500;
  letter-spacing: 0.25em;
}

/* 朱砂印章 */
.seal {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cinnabar);
  color: var(--paper);
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 3px;
  transform: rotate(-4deg);
  box-shadow: 0 2px 6px rgba(185, 28, 28, 0.4);
  letter-spacing: 0;
}

@media (max-width: 768px) {
  .hero-image-wrap {
    height: 200px;
  }
  .poetry-title {
    font-size: 1.4rem;
  }
  .poetry-line {
    font-size: 0.85rem;
  }
  .seal {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
}
</style>
