<template>
  <div v-if="movie.title" class="detail-container">
    <div class="detail-left">
      <img 
        :src="'https://image.tmdb.org/t/p/original' + movie.poster_path" 
        alt="Movie Poster" 
        class="detail__image" 
      />
      <button @click="toggleLike" :class="{'liked': isLiked}" class="like-button">
        <span v-if="isLiked">❤️</span>
        <span v-else>🤍</span>
      </button>
    </div>
    <div class="detail-right">
      <div class="title-container">
        <h2 class="detail__title">{{ movie.title }}</h2>
        <p class="detail__genre">#{{ genreNames }}</p>
      </div>
      <p class="detail__release-date">개봉일 : {{ movie.release_date }}</p>
      <p class="detail__rating">평점 : {{ roundedVoteAverage }} / 10.0</p>
      <p class="detail__overview">{{ truncatedOverview || '정보 없음' }}</p>

      <div v-if="trailerKey" class="media-container">
        <iframe 
          :src="'https://www.youtube.com/embed/' + trailerKey + '?autoplay=1'"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen 
          class="trailer"
        ></iframe>
        <div class="cast-slider">
          <h3 class="cast-title">출연 배우</h3>
          <div class="cast-list" 
               :style="{ transform: 'translateX(-' + castIndex * 100 + '%)' }">
               <div class="cast-items-wrapper">
                 <div 
                 v-for="actor in movie.cast" 
                 :key="actor.id" 
                 class="cast-item"
                 >
                 <img 
                 :src="'https://image.tmdb.org/t/p/original' + actor.profile_path" 
                 alt="Cast Photo" 
                 class="cast-photo" 
                 />
                 <p class="cast-name">{{ actor.name }}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading movie details...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCounterStore } from '@/stores/counter';

const route = useRoute();
const movieId = route.params.id;
const movie = ref({
  genres: [],
  cast: [],
});
const castIndex = ref(0);
const genreMapping = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '뮤지컬',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부',
};

const truncatedOverview = computed(() => {
  const overview = movie.value.overview || '정보 없음';
  return overview.length > 200 ? overview.substring(0, 400) + '...' : overview;
});

const genreNames = computed(() => {
  return movie.value.genres
    ? movie.value.genres.slice(0, 2).map((genre) => genreMapping[genre.id] || genre.name).join(' #')
    : '';
});

const counterStore = useCounterStore();

const isLiked = computed(() => {
  // likedMovies 배열이 객체 배열일 경우, movie.id와 비교하여 좋아요 여부 확인
  return counterStore.likedMovies.some(movieObj => movieObj.id === movie.value.id);
});

const trailerKey = ref('');

const fetchMovieDetail = async () => {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  try {
    const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko-KR`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=ko-KR`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=ko-KR`),
    ]);

    const movieData = await movieResponse.json();
    const creditsData = await creditsResponse.json();
    const videosData = await videosResponse.json();

    movie.value = {
      ...movieData,
      cast: creditsData.cast.slice(0, 10),
    };

    const trailer = videosData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    trailerKey.value = trailer ? trailer.key : '';
  } catch (error) {
    console.error('영화 세부 정보 오류:', error);
  }
};

const roundedVoteAverage = computed(() => {
  return movie.value.vote_average ? (Math.round(movie.value.vote_average * 10) / 10).toFixed(1) : '없음';
});

// 좋아요 토글 함수
const toggleLike = () => {
  if (isLiked.value) {
    counterStore.removeLikedMovie(movie.value.id); // 좋아요 취소
  } else {
    counterStore.addLikedMovie(movie.value); // 영화 객체를 추가
  }
};

onMounted(async () => {
  await fetchMovieDetail();
});
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

/* Left Section */
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
  max-height: 800px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.like-button {
  position: absolute;
  margin-top: 35px;
  top: 1px;
  right: 105px;
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

/* Right Section */
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
  margin-top: 0px;
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
  width: 90%;
  font-size: 18px;
  color: #ece8e8;
  line-height: 2.0;
  word-break: keep-all;
  white-space: normal;
  margin-bottom: 30px;
}

.media-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
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
  overflow: hidden;
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
  flex: 0 0 auto; /* 항목 크기 고정 */
  width: 100px; /* 각 캐스트 아이템 크기 */
  text-align: center;
  margin-right: 20px; /* 간격 조정 */
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

.cast-items-wrapper {
  display: flex;
  transition: transform 15s ease-in-out; /* 슬라이드 애니메이션 */
  animation: auto-slide 150s infinite;
  animation-play-state: running; /* 초기 상태는 실행 */
}

@keyframes auto-slide {
  0% {
    transform: translateX(0); /* 처음 위치 */
  }
  50% {
    transform: translateX(-50%); /* 중간 위치 */
  }
  100% {
    transform: translateX(100%); /* 끝 위치 */
  }
}
</style>
