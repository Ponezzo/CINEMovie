<template>
  <div v-if="movie.title" class="detail-container">
    <div class="detail-left">
      <img 
        :src="'https://image.tmdb.org/t/p/original' + movie.poster_path" 
        alt="Movie Poster" 
        class="detail__image" 
      />
    </div>
    <div class="detail-right">
      <div class="title-container">
        <h2 class="detail__title">{{ movie.title }}</h2> <br>
        <p class="detail__genre">#{{ genreNames }} </p> <!-- 장르 추가 -->
      </div>
      <p class="detail__release-date">개봉일 : {{ movie.release_date }}</p>
      <p class="detail__rating">평점 : {{ movie.vote_average.toFixed(1) }} / 10.0</p> <!-- 장르 추가 -->
      <p class="detail__overview">{{ movie.overview }}</p>

      <div v-if="trailerUrl" class="media-container">
        <iframe 
          :src="trailerUrl" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen 
          class="trailer"
        ></iframe>
        <div class="cast-slider">
          <h3 class="cast-title">출연 배우</h3>
          <div class="cast-list">
            <div class="cast-items-wrapper" 
              @animationend="handleAnimationEnd">
              <div v-for="actor in cast" :key="actor.id" class="cast-item">
                <img 
                  :src="'https://image.tmdb.org/t/p/original' + actor.profile_path" 
                  :alt="actor.name" 
                  class="cast-photo"
                />
                <p class="cast-name">{{ actor.name }}</p>
              </div>
            </div>
          </div>
          <div class="scrollbar" v-show="isHovered">
            <div 
              class="scrollbar-dot" 
              v-for="(dot, index) in cast.length" 
              :key="index"
            ></div>
          </div>
        </div>
      </div>

      <!-- 수정 및 삭제 버튼 -->
      <div v-if="canEdit" class="edit-buttons">
        <button @click="editPost" class="edit-button">수정</button>
        <button @click="deletePost" class="delete-button">삭제</button>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading movie details...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'
import axios from '../axios' // axios 인스턴스

const route = useRoute()
const router = useRouter()
const counterStore = useCounterStore()
const movie = ref({}) // 영화 정보
const trailerUrl = ref('')
const cast = ref([]) // 캐스트 정보 저장
const isHovered = ref(false) // 마우스 hover 상태
const userToken = localStorage.getItem('userToken') // 로컬스토리지에서 userToken 가져오기
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const genreMapping = {
  28: '액션', 12: '모험', 16: '애니메이션', 35: '코미디', 80: '범죄', 99: '다큐멘터리',
  18: '드라마', 10751: '가족', 14: '판타지', 36: '역사', 27: '공포', 10402: '뮤지컬',
  9648: '미스터리', 10749: '로맨스', 878: 'SF', 10770: 'TV 영화', 53: '스릴러', 10752: '전쟁', 37: '서부'
}

const genreNames = computed(() => {
  return movie.value.genres
    ? movie.value.genres.slice(0, 2).map(genre => genreMapping[genre.id] || genre.name).join(' #')
    : ''
})

// 게시글 작성자 확인
const canEdit = computed(() => {
  return movie.value.user_token === userToken // 게시글의 작성자 토큰과 현재 사용자 토큰이 같으면 수정 가능
})

onMounted(() => {
  const movieId = route.params.id
  counterStore.getMovies().then(() => {
    const selectedMovie = counterStore.movies.find(m => m.id === parseInt(movieId))
    if (selectedMovie) {
      movie.value = selectedMovie
      fetchTrailer(selectedMovie.title)
      fetchCast(selectedMovie.id)
      fetchMovieDetails(selectedMovie.id)
    } else {
      console.error('Movie not found')
    }
  })
})

// TMDb API를 사용해 영화의 세부 정보를 가져오는 함수
const fetchMovieDetails = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    movie.value.genres = data.genres
    movie.value.user_token = data.user_token // 게시글 작성자 토큰을 영화 데이터에 추가 (여기서는 예시로 데이터에 포함)
  } catch (error) {
    console.error('Error fetching movie details:', error)
  }
}

// TMDb API를 사용해 캐스트 정보를 가져오는 함수
const fetchCast = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    cast.value = data.cast.slice(0, 10)
  } catch (error) {
    console.error('Error fetching cast:', error)
  }
}

const handleAnimationEnd = () => {
  const castItemsWrapper = document.querySelector('.cast-items-wrapper');
  const castItems = document.querySelectorAll('.cast-item');
  const lastItem = castItems[castItems.length - 1];
  const lastItemRight = lastItem.getBoundingClientRect().right;

  if (lastItemRight <= window.innerWidth) {
    castItemsWrapper.style.animationPlayState = 'paused';
  } else {
    castItemsWrapper.style.animationPlayState = 'running';
  }
}

// 유튜브 트레일러 검색
const fetchTrailer = async (title) => {
  const query = `${title} official trailer`
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId
      trailerUrl.value = `https://www.youtube.com/embed/${videoId}?autoplay=1`
    } else {
      console.error('No trailer found')
    }
  } catch (error) {
    console.error('Error fetching trailer:', error)
  }
}

// 수정 페이지로 이동
const editPost = () => {
  router.push(`/edit-post/${movie.value.id}`)
}

// 게시글 삭제
const deletePost = async () => {
  const confirmation = confirm('정말로 이 게시글을 삭제하시겠습니까?')
  if (confirmation) {
    try {
      await axios.delete(`/posts/${movie.value.id}/`, {
        headers: {
          Authorization: `Token ${userToken}`,
        }
      })
      alert('게시글이 삭제되었습니다.')
      router.push('/community')
    } catch (error) {
      console.error('게시글 삭제 오류:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
  }
}
</script>


<style scoped>
@import url('//fonts.googleapis.com/earlyaccess/nanummyeongjo.css');

.detail-container {
  font-family: 'Nanum Myeongjo', serif;
  font-weight: 900;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  height: 100vh;
  box-sizing: border-box;
}

.detail-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.detail__image {
  margin-top: 25px;
  width: 75%;
  max-width: 700px;
  max-height: 1000px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.like-button {
  position: absolute;
  margin-top: 35px;
  top: 1px;
  right: 103.5px;
  padding: 10px;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border: 2px solid #ece8e8;
  border-radius: 50%;
  cursor: pointer;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.like-button:hover {
  background-color: #ece8e8;
}

.liked {
  border-color: #ff4757;
  color: #ff4757;
}

.detail-right {
  margin-top: 10px;
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1px;
  max-width: 60%;
}

.title-container {
  display: flex-end;
  align-items: center;
}

.detail__title {
  font-size: 36px;
  max-width: 90%;
  font-weight: bold;
  color: #ece8e8;
  margin-bottom: 0px;
}

.detail__genre {
  margin-bottom: 5px;
  margin-top: -20px;
  font-size: 15px;
  color: #ece8e8;
  width: 80%;
  margin-bottom: 10px;
}

.detail__release-date,
.detail__rating {
  margin-bottom: 5px;
  margin-top: 10px;
  font-size: 25px;
  color: #ece8e8;
  width: 80%;
}

.detail__overview {
  height: 175px;
  width: 80%;
  font-size: 18px;
  color: #ece8e8;
  line-height: 2.0;
  word-break: keep-all;
  white-space: normal;
}

.media-container {
  display: flex;
  gap: 20px;
  margin-top: 60px;
}

.trailer {
  flex: 3;
  height: 315px;
  max-width: 560px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.cast-slider {
  flex: 1;
  max-width: 24%;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.80);
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
  position: relative;
}

.cast-title {
  font-size: 20px;
  color: #ece8e8;
  margin-bottom: 10px;
}

.cast-list {
  display: flex;
  gap: 15px;
  overflow: hidden;
  position: relative;
  width: 100%;
}


.cast-item {
  flex: 0 0 auto;
  width: 100px;
  text-align: center;
  margin-right: 20px;
}

.cast-photo {
  width: 100%;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
}

.cast-name {
  font-size: 14px;
  color: #ece8e8;
  text-overflow: ellipsis;
  white-space: break-word;
  overflow: hidden;
}

.loading {
  font-size: 18px;
  color: #888;
  text-align: center;
  padding: 20px;
}

.cast-items-wrapper {
  display: flex;
  transition: transform 15s ease-in-out; /* 슬라이드 애니메이션 */
  animation: auto-slide 150s infinite;
  animation-play-state: running; /* 초기 상태는 실행 */
}

/* 슬라이드 애니메이션 */
@keyframes auto-slide {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(100);
  }
}

</style>
