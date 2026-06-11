<template>
  <div class="article-create">
    <div class="content-wrapper">
      <!-- 영화 선택 섹션 -->
      <div class="left-section">
        <!-- 초기에만 영화 선택 버튼이 보이고, 영화 선택 후에는 포스터가 보이도록 설정 -->
        <div v-if="!selectedMovie">
          <button @click="openMovieModal" class="movie-select-button">영화 선택</button>
        </div>
        <div v-else class="selected-movie" @click="openMovieModal">
          <img :src="'https://image.tmdb.org/t/p/original' + selectedMovie.poster_path" alt="Selected Poster" />
          <h3>{{ selectedMovie.title }}</h3>
        </div>
      </div>

      <!-- 입력 폼 섹션 -->
      <div class="right-section">
        <form @submit.prevent="createPost">
          <div class="form-group">
            <label for="title">제목</label>
            <input 
              type="text" 
              id="title" 
              v-model="title" 
              maxlength="20" 
              placeholder="제목을 입력하세요" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="content">내용</label>
            <textarea 
              id="content" 
              v-model="content"
              class="textinput"
              placeholder="내용을 입력하세요" 
              required
            ></textarea>
          </div>

          <button type="submit" class="submit-button">작성하기</button>
        </form>
      </div>
    </div>

    <!-- 영화 선택 Modal -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <input 
          type="text"
          class="modalsearch"
          v-model="searchQuery" 
          placeholder="영화를 검색하세요" 
          @keyup.enter="searchMovies"
        />
        <div v-if="searchResults.length" class="search-results">
          <div 
            v-for="movie in searchResults" 
            :key="movie.id" 
            @click="selectMovie(movie)" 
            class="search-item"
          >
            <img :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path" alt="Poster" />
            <span class="movie-title">{{ movie.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../axios'; // axios 인스턴스

const title = ref('');
const content = ref('');
const searchQuery = ref('');
const searchResults = ref([]);
const selectedMovie = ref(null);
const showModal = ref(false);
const router = useRouter();
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const openMovieModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const searchMovies = async () => {
  if (searchQuery.value.trim() === '') {
    searchResults.value = [];
    return;
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: searchQuery.value,
        language: 'ko'
      },
    });
    searchResults.value = response.data.results;
  } catch (error) {
    console.error('영화 검색 중 오류 발생:', error);
  }
};

const selectMovie = (movie) => {
  selectedMovie.value = movie;
  searchResults.value = [];
  showModal.value = false;
};

const createPost = async () => {
  if (!selectedMovie.value) {
    alert('영화를 선택해주세요!');
    return;
  }

  const token = localStorage.getItem('userToken'); // 저장된 토큰 가져오기

  if (!token) {
    alert('로그인 후 게시글을 작성할 수 있습니다.');
    return;
  }

  // 포스터 URL을 완전한 URL로 변환
  const moviePosterUrl = 'https://image.tmdb.org/t/p/original' + selectedMovie.value.poster_path;

  try {
    const response = await axios.post(
      '/posts/',
      {
        title: title.value,
        content: content.value,
        movie_title: selectedMovie.value.title,
        movie_poster: moviePosterUrl, // 완전한 URL로 전달
      },
      {
        headers: {
          Authorization: `Token ${token}`, // 인증 토큰을 헤더에 추가
        },
      }
    );

    alert('게시글이 성공적으로 작성되었습니다.');
    router.push('/community'); // 게시글 작성 후 커뮤니티 페이지로 이동
  } catch (error) {
    console.error('게시글 작성 중 오류 발생:', error);
    alert('게시글 작성에 실패했습니다.');
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
}

.article-create {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin: 10px;
  height: 100vh;
  font-family: 'GowunBatang-Regular', sans-serif; /* 글꼴을 GowunBatang으로 설정 */
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.left-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.right-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  margin-top: 100px;
}

.movie-select-button {
  display: inline-block;
  padding: 10px 20px;
  background-color:transparent;
  color: whitesmoke;
  border-radius: 5px;
  margin-top: 20px;
  text-decoration: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;  /* 텍스트를 굵게 설정 */
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
  font-stretch: semi-expanded;
  font-style: normal;
}

.selected-movie img {
  max-width: 550px;
  margin-bottom: 10px;
  cursor: pointer;
}

.selected-movie h3 {
  font-size: 18px;
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 20px;
  color: white;
  font-weight: bold;
}

input, textarea {
  margin-top: 10px;
  font-size: 18px;
  color: white;
  background-color: #333;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  font-family: 'GowunBatang-Regular', sans-serif; /* input 및 textarea에도 글꼴 적용 */
}

textarea {
  height: 200px; /* 고정된 높이 */
  resize: none; /* 크기 조정 비활성화 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  padding: 10px;
  font-size: 18px;
  color: white;
  background-color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-family: 'GowunBatang-Regular', sans-serif; /* input 및 textarea에도 글꼴 적용 */
}

/* 스크롤바 스타일링 */
textarea::-webkit-scrollbar {
  width: 8px; /* 스크롤바 너비 */
}

textarea::-webkit-scrollbar-track {
  background: transparent; /* 스크롤바 배경 투명 */
}

textarea::-webkit-scrollbar-thumb {
  background: transparent; /* 스크롤바 색상 (반투명 흰색) */
}

.search-results {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개의 포스터로 제한 */
  gap: 10px;
  max-height: 400px; /* 고정된 높이 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
}

.search-item {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #444;
  text-align: center;
  display: flex;
  flex-direction: column; /* 세로로 정렬 */
  justify-content: center;
  align-items: center;
}

.search-item img {
  max-width: 150px; /* 포스터 크기 키우기 */
  max-height: 250px;
}

.movie-title {
  color: white;
  font-size: 14px;
  margin-top: 5px;
  word-break: keep-all;
  white-space: normal;
}

.submit-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: transparent;
  color: whitesmoke;
  border-radius: 5px;
  margin-top: 20px;
  text-decoration: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;  /* 텍스트를 굵게 설정 */
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
  font-stretch: semi-expanded;
  font-style: normal;
}

.modalsearch {
  width: 575px;
  margin-bottom: 15px;
  margin-top: 17px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: rgba(148, 148, 148, 0.2);
  padding: 20px;
  border-radius: 5px;
  width: 60%; /* 모달 크기 좁히기 */
  max-width: 600px;
  max-height: 80vh; /* 최대 높이 설정 (스크롤이 생기게 하기) */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  overflow-x: hidden; /* 가로 스크롤 방지 */
}

/* 스크롤바 스타일 */
.search-results::-webkit-scrollbar {
  width: 0px; /* 스크롤바 너비 */
}

.search-results::-webkit-scrollbar-track {
  background: transparent; /* 스크롤바 배경 투명 */
}

.search-results::-webkit-scrollbar-thumb {
  background: transparent; /* 스크롤바 색상 (반투명 흰색) */
}



</style>
