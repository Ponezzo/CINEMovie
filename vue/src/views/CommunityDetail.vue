<template>
  <div class="community-detail">
    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="detail-container">
      <!-- 왼쪽: 영화 포스터 -->
      <div class="poster-container">
        <img 
          :src="'https://image.tmdb.org/t/p/w500' + post.movie_poster" 
          alt="Movie Poster" 
          class="movie-poster"
        />
      </div>

      <!-- 오른쪽: 제목과 내용 -->
      <div class="content-container">
        <h1 class="title">제목: {{ post.title }}</h1>
        <p class="content">{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { useRoute } from 'vue-router';

const post = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();

onMounted(async () => {
  const token = localStorage.getItem('userToken');
  try {
    const postId = route.params.id;
    const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}/`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
    post.value = response.data || {};
  } catch (err) {
    console.error('Error:', err.response || err.message);
    error.value = '게시글 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.community-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 페이지를 화면 전체로 채움 */
  padding: 20px;
  box-sizing: border-box;
}

.detail-container {
  display: flex;
  flex-direction: row; /* 가로 배치 */
  gap: 20px;
  max-width: 1200px; /* 콘텐츠의 최대 너비 제한 */
  width: 100%;
}

.poster-container {
  flex: 1; /* 포스터는 공간을 동일 비율로 차지 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.movie-poster {
  max-width: 500px; /* 포스터 최대 너비 제한 */
  max-height: 700px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.content-container {
  flex: 2; /* 텍스트 콘텐츠는 포스터보다 약간 더 큰 비율 */
  display: flex;
  flex-direction: column; /* 세로 배치 */
  justify-content: center; /* 수직으로 가운데 정렬 */
  padding: 10px;
}

.title {
  margin-top: 10px;
  font-size: 18px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  font-family: 'GowunBatang-Regular', sans-serif;
}

.content {
  margin-top: 10px;
  font-size: 18px;
  color: white;
  background-color:rgba(0, 0, 0, 0.5);
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  font-family: 'GowunBatang-Regular', sans-serif;
  height: 300px;
}
</style>
