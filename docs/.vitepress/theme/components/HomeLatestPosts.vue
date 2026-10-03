<template>
  <section class="home-latest">
    <div class="head">
      <h2>最新文章</h2>
      <a class="more" :href="moreLink">查看全部 →</a>
    </div>
    <div class="posts">
      <a
        v-for="post in posts"
        :key="post.link"
        :href="fullLink(post.link)"
        class="post-card"
      >
        <span class="post-cat">{{ post.tag }}</span>
        <span class="post-title">{{ post.title }}</span>
        <span class="post-desc">{{ post.desc }}</span>
        <span class="post-meta">{{ post.date }}</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { articleList } from '../../../articles/articles.js'

const MAX_ITEMS = 4

const posts = computed(() =>
  articleList
    .flatMap((category) =>
      category.subcategories.flatMap((subcategory) =>
        subcategory.items.map((item) => ({
          title: item.title,
          desc: item.desc,
          date: item.date || '',
          tag: subcategory.name,
          link: item.link
        }))
      )
    )
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, MAX_ITEMS)
)

const moreLink = computed(() => withBase('/articles/'))
const fullLink = (link) => withBase(link)
</script>
