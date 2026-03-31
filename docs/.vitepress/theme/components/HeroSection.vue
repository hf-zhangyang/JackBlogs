<template>
  <div class="hero-section">
    <img src="/images/hero.jpg" alt="技术博客" />
    <div class="poetry-float">
      <p class="poetry-title">天地人</p>
      <p class="poetry-line">三才者，天地人</p>
      <p class="poetry-line">天有阴阳，运化四时</p>
      <p class="poetry-line">地有刚柔，承载万物</p>
      <p class="poetry-line">人禀中和，参赞天地</p>
      <p class="poetry-line">天人合一，道法自然</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  position: relative;
  margin-bottom: 2rem;
}

.hero-section img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid rgba(148, 163, 184, 0.3);
}

.poetry-float {
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 1.5rem 1.2rem;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.poetry-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #FFD700;
  margin-left: 0.8rem;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Adobe Kaiti Std', serif;
  letter-spacing: 0.4em;
  line-height: 1.5;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(255, 215, 0, 0.3);
}

.poetry-line {
  font-size: 1rem;
  color: #F0E68C;
  margin-left: 0.6rem;
  line-height: 2;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Adobe Kaiti Std', serif;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.9),
    0 0 15px rgba(240, 230, 140, 0.2);
}
</style>

