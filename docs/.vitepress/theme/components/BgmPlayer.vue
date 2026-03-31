<template>
  <div class="bgm-player">
    <div class="player-container" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
      <!-- 播放按钮 -->
      <button @click="togglePlay" class="play-btn" :title="isPlaying ? '暂停音乐' : '播放音乐'">
        <svg v-if="!isPlaying" class="icon play-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
        <svg v-else class="icon pause-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </button>

      <!-- 音乐波浪动画 -->
      <div class="music-waves" v-if="isPlaying">
        <span class="wave" v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.1}s` }"></span>
      </div>

      <!-- 提示文字 -->
      <transition name="fade">
        <div class="tooltip" v-if="showTooltip">
          {{ isPlaying ? '点击暂停' : '点击播放' }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const audio = ref(null)
const isPlaying = ref(false)
const showTooltip = ref(false)

// 创建全局音频元素（只创建一次）
if (!window.__bgm_audio__) {
  window.__bgm_audio__ = new Audio('/audio/高山流水 - 纯音乐网.mp3')
  window.__bgm_audio__.loop = true
  window.__bgm_audio__.volume = 0.3
}

const togglePlay = () => {
  if (isPlaying.value) {
    window.__bgm_audio__.pause()
    isPlaying.value = false
  } else {
    window.__bgm_audio__.play()
    isPlaying.value = true
  }
}

const syncState = () => {
  isPlaying.value = !window.__bgm_audio__.paused
}

onMounted(() => {
  audio.value = window.__bgm_audio__

  // 同步播放状态
  audio.value.addEventListener('play', syncState)
  audio.value.addEventListener('pause', syncState)
  syncState()

  // 尝试自动播放
  const playPromise = audio.value.play()
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.removeEventListener('play', syncState)
    audio.value.removeEventListener('pause', syncState)
  }
})
</script>

<style scoped>
.bgm-player {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.player-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* 播放按钮 */
.play-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(139, 92, 246, 0.3);
  box-shadow:
    0 4px 16px rgba(139, 92, 246, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow:
    0 6px 24px rgba(139, 92, 246, 0.6),
    0 0 0 4px rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
}

.play-btn:active {
  transform: scale(0.95);
}

.icon {
  width: 16px;
  height: 16px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.play-btn:hover .icon {
  transform: scale(1.1);
}

/* 音乐波浪 */
.music-waves {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0.5rem 0.75rem;
  background: rgba(139, 92, 246, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.wave {
  width: 3px;
  height: 12px;
  background: linear-gradient(to top, #8b5cf6, #a78bfa);
  border-radius: 2px;
  animation: wave 1.2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
}

@keyframes wave {
  0%, 100% {
    height: 12px;
    opacity: 0.6;
  }
  50% {
    height: 20px;
    opacity: 1;
  }
}

/* 提示文字 */
.tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem 1rem;
  background: rgba(139, 92, 246, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  pointer-events: none;
}

.tooltip::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid rgba(139, 92, 246, 0.95);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
