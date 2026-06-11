<template>
  <div class="carousel-container">
    <div class="carousel">
      <div 
        v-for="(movie, index) in movies" 
        :key="movie.id" 
        class="carousel__item" 
        :style="getStyle(index)"
        @click="handleClick(movie.id)"
        @mouseenter="onMouseEnter(index)"
        @mouseleave="onMouseLeave"
      >
        <img 
          :src="'https://image.tmdb.org/t/p/original' + (movie.poster_path || '/path/to/default-image.jpg')" 
          alt="Movie Poster" 
          class="carousel__image" 
        />
        <div class="carousel__number">{{ index + 1 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'

const router = useRouter()
const counterStore = useCounterStore()
const movies = ref([])

const rotationAngle = ref(0)
const hoveredIndex = ref(null)
const isNavigating = ref(false)

onMounted(() => {
  counterStore.getMovies().then(() => {
    movies.value = counterStore.movies.slice(0, 8)
    setInterval(() => {
      if (hoveredIndex.value === null) {
        rotationAngle.value -= 45
      }
    }, 3500)
  })
})

const getStyle = (index) => {
  const angle = 45 * index + rotationAngle.value
  const rad = (angle * Math.PI) / 180
  const x = Math.sin(rad) * 450
  const z = Math.cos(rad) * 450

  const scale = hoveredIndex.value === index ? 1.2 : 1
  const opacity = z > 0 ? 1 : 0.6

  return {
    transform: `translate3d(${x}px, -50%, ${z}px) rotateY(${angle}deg) scale(${scale})`,
    opacity: opacity,
    zIndex: z > 0 ? 10 : 0,
    transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
  }
}

const handleClick = (movieId) => {
  if (!isNavigating.value) {
    isNavigating.value = true
    setTimeout(() => {
      router.push({ name: 'DetailView', params: { id: movieId } })
    }, 300) // 0.5초 딜레이 후 라우팅
  }
}

const onMouseEnter = (index) => {
  hoveredIndex.value = index
}

const onMouseLeave = () => {
  hoveredIndex.value = null
}
</script>

<style scoped>
.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  perspective: 2400px;
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 400px;
  height: 200px;
  transform-style: preserve-3d;
  transition: transform 1.5s ease-in-out;
}

.carousel__item {
  position: absolute;
  top: 50%;
  left: 15%;
  width: 320px;
  height: 500px;
  transform-origin: center center;
  transform-style: preserve-3d;
  transition: transform 1.5s ease-in-out, opacity 1.5s ease-in-out;
  cursor: pointer;
}

.carousel__image {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
  transition: filter 0.5s ease-in-out;
  filter: grayscale(100%); /* 처음에는 흑백으로 설정 */
}

.carousel__item:hover .carousel__image {
  filter: grayscale(0%); /* hover 시 원래 색상으로 돌아옴 */
}

.carousel__number {
  position: absolute;
  top: 5px;
  left: 5px;
  color: #f5f5f5;
  font-size: 55px;
  font-style: italic;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 20;
}
</style>
