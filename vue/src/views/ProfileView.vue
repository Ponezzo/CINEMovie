<template>
  <div class="profile-container">
    <div class="left-section">
      <div class="favorite-movie">
        <template v-if="!favoriteMovie || likedMovies.length === 0">
          <p class="no-favorite-movie">최애 영화를 선택해주세요.</p>
        </template>
        <template v-else>
          <h2 class="section-title"></h2>
          <img 
            :src="'https://image.tmdb.org/t/p/original' + favoriteMovie.poster_path" 
            :alt="favoriteMovie.title + ' Poster'" 
            class="favorite-movie-poster"
          />
        </template>
      </div>
    </div>
    <div class="right-section">
      <div class="liked-movies">
        <h2 class="section-heart">❤</h2>
        <div 
          class="movies-list" 
          @wheel="onWheel"
        >
          <div 
            v-for="movie in likedMovies" 
            :key="movie.id" 
            class="movie-item"
            :class="{'selected': isSelected(movie.id), 'selectable': selectMode}"
            @click="selectMode ? selectMovie(movie) : goToDetail(movie)"
          >
            <img 
              v-if="movie.poster_path" 
              :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
              :alt="movie.title + ' Poster'" 
              class="movie-poster" 
            />
            <img 
              v-else 
              src="https://via.placeholder.com/500x750?text=No+Image" 
              alt="No Image Available" 
              class="movie-poster" 
            />
            <p class="movie-title">{{ movie.title }}</p>
            <div v-if="isSelected(movie.id)" class="checkmark">✔</div>
          </div>
        </div>
        <button @click="toggleSelectMode" class="select-favorite-button">
          {{ selectMode ? '선택 완료' : '최애영화 선택하기' }}
        </button>
        <button @click="fetchRecommendMovies" class="recommend-button">
          추천 받기
        </button>
      </div>

      <div class="my-posts">
        <h2 class="section-title">Recommend</h2>
        <div class="movies-list">
          <div 
            v-for="movie in recommendMovies" 
            :key="movie.id" 
            class="movie-item"
            @click="goToDetail(movie)"
          >
            <img 
              v-if="movie.poster_path" 
              :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
              :alt="movie.title + ' Poster'" 
              class="movie-poster" 
            />
            <img 
              v-else 
              src="https://via.placeholder.com/500x750?text=No+Image" 
              alt="No Image Available" 
              class="movie-poster" 
            />
            <p class="movie-title">{{ movie.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
import axios from 'axios'

const recommendMovies = ref([]); // 추천 영화를 위한 ref

const counterStore = useCounterStore()
const router = useRouter()

const selectMode = ref(false)
const selectedMovieId = ref(null)

const likedMovies = computed(() => counterStore.likedMovies);

let isScrolling = false; // 스크롤 중복 방지 플래그

const smoothScroll = (element, delta, duration = 450) => {
  if (isScrolling) return; // 이미 스크롤 중이면 중단
  isScrolling = true;

  const startTime = performance.now();
  const startScrollLeft = element.scrollLeft;

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // 진행률 계산 (0~1)
    const ease = progress * (2 - progress); // ease-out 효과

    element.scrollLeft = startScrollLeft + delta * ease; // 스크롤 위치 계산

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isScrolling = false; // 애니메이션 완료 후 스크롤 가능
    }
  };

  requestAnimationFrame(animate);
};

const onWheel = (event) => {
  event.preventDefault(); // 기본 스크롤 방지
  const moviesList = event.currentTarget;
  smoothScroll(moviesList, event.deltaY); // 부드럽게 스크롤
};


// TMDB API 키
const apiKey = import.meta.env.VITE_TMDB_API_KEY;  // 환경 변수로 API 키 가져오기

// 로컬 스토리지에 저장된 최애 영화 ID 가져오기
const favoriteMovieId = ref(localStorage.getItem('favoriteMovieId'))

// 최애 영화 계산
const favoriteMovie = computed(() => {
  if (
    likedMovies.value.length === 0 ||
    !likedMovies.value.some(movie => movie.id === parseInt(favoriteMovieId.value))
  ) {
    return null
  }
  return likedMovies.value.find(movie => movie.id === parseInt(favoriteMovieId.value))
})

// TMDB에서 영화 정보 가져오기
const fetchMovieDetails = async () => {
  const moviePromises = likedMovies.value.map(async (movieId) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`)
    return response.data
  })

  counterStore.movies = await Promise.all(moviePromises)
}

// 추천 영화 가져오기
const fetchRecommendMovies = async () => {
  if (favoriteMovie.value) {
    const genreIds = favoriteMovie.value.genres.slice(0, 2).map(genre => genre.id); // 최애 영화의 앞 2개의 장르 추출
    const genreString = genreIds.join(',');
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreString}&sort_by=popularity.desc&language=ko-KR&page=${randomPage}`;
    try {
      const response = await axios.get(url);
      const allMovies = response.data.results; // 인기순으로 정렬된 영화들
      const randomMovies = getRandomMovies(allMovies, 6); // 6개를 랜덤으로 선택
      recommendMovies.value = randomMovies;
    } catch (error) {
      console.error('추천 영화 가져오기 오류:', error);
    }
  }
}

// 주어진 영화 배열에서 n개의 랜덤 영화 선택
const getRandomMovies = (movies, n) => {
  const shuffled = [...movies]; // 배열 복사
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0부터 i까지 랜덤 인덱스
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 값 교환
  }
  return shuffled.slice(0, n); // 앞 6개 요소 반환
}


// 좋아요 리스트 변화 감지
watch(likedMovies, (newLikedMovies) => {
  console.log('Liked Movies Updated:', newLikedMovies)
  if (newLikedMovies.length === 0) {
    favoriteMovieId.value = null
    localStorage.removeItem('favoriteMovieId')
  }
})

// 최애 영화 선택 모드 토글
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value
  if (!selectMode.value && selectedMovieId.value) {
    favoriteMovieId.value = selectedMovieId.value
    localStorage.setItem('favoriteMovieId', selectedMovieId.value)
    counterStore.setFavoriteMovie(selectedMovieId.value)
  }
}

// 영화 선택
const selectMovie = (movie) => {
  if (selectMode.value) {
    selectedMovieId.value = movie.id
  }
}

// 선택된 영화 확인
const isSelected = (movieId) => selectedMovieId.value === movieId

// 디테일 페이지로 이동
const goToDetail = (movie) => {
  router.push(`/search-detail/${movie.id}`)
}

// 로컬 스토리지 동기화
watchEffect(() => {
  if (favoriteMovieId.value) {
    localStorage.setItem('favoriteMovieId', favoriteMovieId.value)
  }
})

// 컴포넌트가 마운트될 때 TMDB API에서 영화 정보를 가져옵니다
onMounted(() => {
  fetchMovieDetails()
})
</script>


<style scoped>
/* 스타일은 그대로 유지 */
</style>



<style scoped>
.profile-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left-section {
  width: 40%;
  text-align: center;
}

.right-section {
  width: 60%;
}

.favorite-movie {
  margin-bottom: 20px;
}

.favorite-movie-poster {
  width: 68%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.no-favorite-movie {
  font-size: 18px;
  color: #b8b8b8;
  text-align: center;
  margin-top: 50px;
}

.select-favorite-button {
  padding: 7px 13px;
  background-color: #f5f5f5;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.select-favorite-button:hover {
  background-color: #d3d3d3;
}

.recommend-button {
  padding: 7px 13px;
  background-color: #f5f5f5;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-left: 10px;
}

.recommend-button:hover {
  background-color: #d3d3d3;
}

.section-heart {
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ebedee;
}

.section-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ebedee;
}

.movies-list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  min-width: 100%;
}

.movies-list::-webkit-scrollbar {
  height: 8px;
}

.movie-item {
  width: 150px;
  text-align: center;
  position: relative;
  flex-shrink: 0;
}

.movie-poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s;
}

.movie-item.selected .movie-poster {
  opacity: 0.5;
}

.movie-item.selectable:hover .movie-poster {
  opacity: 0.7;
}

.checkmark {
  position: absolute;
  height: auto;
  width: 22px;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  border-radius: 50%;
}

.movie-title {
  font-size: 16px;
  margin-top: 10px;
  color: #ece8e8;
  word-break: keep-all;
  white-space: normal;
}

.my-posts {
  margin-top: 30px;
}

.my-posts h2 {
  font-size: 30px;
  font-weight: bold;
  color: #ebedee;
  margin-bottom: 20px;
}
</style>
