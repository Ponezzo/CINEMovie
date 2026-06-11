<template>
  <div class="search-list-container">
    <div class="left-side">
      <h2 class="search-title">검색 결과</h2>
      <div v-if="movies.length > 0" class="movie-list">
        <div v-for="movie in limitedMovies" :key="movie.id" class="movie-item">
          <!-- 영화 포스터를 클릭하면 해당 영화의 세부 정보 페이지로 이동 -->
          <router-link :to="`/search-detail/${movie.id}`">
            <img 
              :src="'https://image.tmdb.org/t/p/original' + movie.poster_path" 
              alt="Movie Poster" 
              class="movie-poster"
            />
          </router-link>
          <div class="movie-info">
            <h3 class="movie-title">{{ movie.title }}</h3>
          </div>
        </div>
      </div>
      <div v-else class="no-results">검색 결과가 없습니다.</div>
    </div>

    <div class="right-side" v-if="relatedMovies.length > 0">
      <h3 class="related-movies-title">유사한 영화</h3>
      <div class="related-movie-list">
        <div v-for="relatedMovie in limitedRelatedMovies" :key="relatedMovie.id" class="related-movie-item">
          <router-link :to="`/search-detail/${relatedMovie.id}`">
            <img 
              :src="'https://image.tmdb.org/t/p/original' + relatedMovie.poster_path" 
              alt="Related Movie Poster" 
              class="related-movie-poster"
            />
          </router-link>
          <div class="related-movie-info">
            <h4 class="related-movie-title">{{ relatedMovie.title }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = route.query.query
const movies = ref([]) // 검색된 영화 목록
const relatedMovies = ref([]) // 장르가 일치하는 관련 영화 목록
const movieGenres = ref([]) // 첫 번째 영화의 장르
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY


// 영화 검색 API
const fetchMovies = async (query) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR`
  try {
    const response = await fetch(url)
    const data = await response.json()
    movies.value = data.results || []
    
    if (movies.value.length > 0) {
      // 검색된 영화와 관련 영화 데이터를 함께 localStorage에 저장
      localStorage.setItem('searchedMovies', JSON.stringify(movies.value))
      
      // 관련 영화 가져오기
      fetchRelatedMovies(movies.value[0].id) // 첫 번째 영화의 ID로 관련 영화 가져오기
    }
  } catch (error) {
    console.error('영화 검색 오류:', error)
  }
}

// 관련 영화 (장르 일치) 가져오기
const fetchRelatedMovies = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko-KR`
  try {
    const response = await fetch(url)
    const movieData = await response.json()
    movieGenres.value = movieData.genres.slice(0, 2).map(genre => genre.id) // 첫 번째 영화의 장르 ID 가져오기

    // 장르가 일치하는 영화 찾기
    fetchMoviesByGenres(movieGenres.value)
  } catch (error) {
    console.error('관련 영화 가져오기 오류:', error)
  }
}

// 장르 일치 영화 가져오기
const fetchMoviesByGenres = async (genreIds) => {
  const genreString = genreIds.join(',')
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreString}&sort_by=popularity.desc&language=ko-KR&page=1`
  try {
    const response = await fetch(url)
    const data = await response.json()
    relatedMovies.value = data.results.slice(0, 8) || [] // 관련 영화 최대 8개만 가져오기
    
    // 검색된 영화와 관련 영화 데이터를 함께 localStorage에 저장
    localStorage.setItem('allMovies', JSON.stringify({
      searchedMovies: movies.value,
      relatedMovies: relatedMovies.value
    }))
  } catch (error) {
    console.error('장르 일치 영화 가져오기 오류:', error)
  }
}

// 중복된 영화 제거
const filteredRelatedMovies = computed(() => {
  return relatedMovies.value.filter(relatedMovie => {
    // 왼쪽 목록에 있는 영화는 제외
    return !movies.value.some(movie => movie.id === relatedMovie.id)
  })
})

// 검색된 영화 최대 8개만 반환
const limitedMovies = computed(() => {
  return movies.value.slice(0, 8) // 검색 결과 최대 8개만 출력
})

// 유사한 영화 최대 8개만 반환
const limitedRelatedMovies = computed(() => {
  return filteredRelatedMovies.value.slice(0, 8) // 관련 영화 최대 8개만 출력
})

// 컴포넌트 마운트 시 검색 실행
onMounted(() => {
  if (searchQuery) {
    fetchMovies(searchQuery)
  }
})

// 검색어 변경 시 재검색
watch(() => route.query.query, (newQuery) => {
  if (newQuery) {
    fetchMovies(newQuery)
  }
})
</script>

<style scoped>
/* 스타일은 이전과 동일 */
.search-list-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left-side {
  flex: 1;
  padding-right: 20px;
}

.search-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 25px;
  color: whitesmoke;
}

.movie-list {
  display: flex;
  flex-wrap: wrap; /* 빈 공간을 채우기 위한 설정 */
  gap: 20px; /* 아이템 간격 설정 */
}

.movie-item {
  display: flex;
  flex-direction: column;
  width: 200px; /* 각 영화의 너비 */
}

.movie-poster {
  width: 100%; /* 포스터 너비를 컨테이너에 맞추기 */
  height: 270px; /* 포스터 높이 */
  object-fit: cover;
  border-radius: 8px;
}

.movie-info {
  margin-top: 10px;
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: 5px;
  text-align: center; /* 제목을 가운데 정렬 */
  word-break: keep-all;
  white-space: normal;
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
  display: -webkit-box; /* 여러 줄 텍스트 처리 */
  -webkit-line-clamp: 2; /* 2줄로 제한 */
  -webkit-box-orient: vertical; /* 세로로 클램프 */
  text-overflow: ellipsis; /* ... 표시 */
  color: #f5f5f5;
}

.no-results {
  font-size: 18px;
  color: #888;
}

.right-side {
  flex: 1;
  padding-left: 20px;
}

.related-movies-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color: whitesmoke;
}

.related-movie-list {
  display: flex;
  flex-wrap: wrap; /* 빈 공간을 채우기 위한 설정 */
  gap: 20px; /* 아이템 간격 설정 */
}

.related-movie-item {
  display: flex;
  flex-direction: column;
  width: 200px; /* 각 영화의 너비 */
}

.related-movie-poster {
  width: 100%; /* 포스터 너비를 컨테이너에 맞추기 */
  height: 270px; /* 포스터 높이 */
  object-fit: cover;
  border-radius: 8px;
}

.related-movie-info {
  margin-top: 10px;
}

.related-movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: 5px;
  text-align: center; /* 제목을 가운데 정렬 */
  word-break: keep-all;
  white-space: normal;
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
  display: -webkit-box; /* 여러 줄 텍스트 처리 */
  -webkit-line-clamp: 2; /* 2줄로 제한 */
  -webkit-box-orient: vertical; /* 세로로 클램프 */
  text-overflow: ellipsis; /* ... 표시 */
  color: #f5f5f5;
}
</style>
