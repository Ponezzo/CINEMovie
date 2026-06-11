<template>
  <div class="community-page">
    <!-- <h1 class="title">게시글 목록</h1> -->
    
    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="posts.length > 0" class="posts-list">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="post-item"
        :style="getCardStyle(post.id)"
        @click="goToDetail(post.id)"
      >
        <img 
          :src="post.movie_poster" 
          alt="Movie Poster" 
          class="movie-poster"
        />
        <div class="post-content">
          <!-- <h3>{{ post.title || '영화 제목 없음' }}</h3> -->
          <!-- <p>{{ post.content || '내용이 없습니다.' }}</p> -->
        </div>
      </div>
    </div>
    <div v-else>
      <p>게시글이 없습니다.</p>
    </div>
    
    <button @click="goToCreatePost" class="create-post-button">Write</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();
const positions = ref([]);  // 카드들의 위치를 추적
const targetPositions = ref([]);  // 목표 위치를 추적
const moving = ref([]);  // 각 카드가 이동 중인지 여부
const buttonPosition = ref({ top: 0, left: 0, width: 0, height: 0 });  // 게시글 작성하기 버튼 위치

const goToDetail = (postId) => {
  router.push(`/community/${postId}`);
}

const goToCreatePost = () => {
  router.push('/article-create');
}

// 스타일을 동적으로 지정
const getCardStyle = (postId) => {
  const postIndex = posts.value.findIndex(post => post.id === postId);
  const position = positions.value[postIndex];
  
  return {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    transition: 'all 1s ease-out',  // 느리게 이동하는 애니메이션
  };
}

// 카드가 목표 위치에 도달했는지 확인
const hasReachedTarget = (postIndex) => {
  const pos = positions.value[postIndex];
  const target = targetPositions.value[postIndex];
  
  const distance = Math.sqrt(Math.pow(target.left - pos.left, 2) + Math.pow(target.top - pos.top, 2));
  return distance < 10;  // 목표 위치와 10px 이하로 가까워지면 도달한 것으로 판단
}

const moveCards = () => {
  setInterval(() => {
    posts.value.forEach((post, index) => {
      if (hasReachedTarget(index)) {
        // 목표 지점에 도달했다면 새로운 목표를 설정
        setNewTargetPosition(index);
      } else {
        // 목표 지점으로 이동
        moveTowardsTarget(index);
      }
    });
    checkCollisions();  // 충돌 체크
    preventButtonCollision(); // 버튼과 카드의 충돌 방지
  }, 100); // 0.1초마다 확인
}

const setNewTargetPosition = (index) => {
  const currentPos = positions.value[index];
  
  // 랜덤한 방향으로 최소 200px에서 최대 500px 거리만큼 이동할 목표 좌표 설정
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 150; // 최소 200px, 최대 500px
  
  const targetLeft = currentPos.left + Math.cos(angle) * distance;
  const targetTop = currentPos.top + Math.sin(angle) * distance;
  
  targetPositions.value[index] = {
    left: Math.min(Math.max(targetLeft, 0), window.innerWidth - 500),  // 화면 내에서만 이동
    top: Math.min(Math.max(targetTop, 0), window.innerHeight - 500),  // 화면 내에서만 이동
  };
  
  moving.value[index] = true;  // 이동 시작
}

const moveTowardsTarget = (index) => {
  const pos = positions.value[index];
  const target = targetPositions.value[index];
  
  const deltaX = target.left - pos.left;
  const deltaY = target.top - pos.top;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // 이동 속도 설정
  const speed = 1;  // 2px per update
  
  if (distance > 1) {
    const moveX = (deltaX / distance) * speed;
    const moveY = (deltaY / distance) * speed;
    
    positions.value[index] = {
      left: pos.left + moveX,
      top: pos.top + moveY,
    };
  } else {
    // 목표 위치에 거의 도달하면 이동 멈춤
    moving.value[index] = false;
  }
}

// 충돌 처리
const checkCollisions = () => {
  for (let i = 0; i < positions.value.length; i++) {
    for (let j = i + 1; j < positions.value.length; j++) {
      const posA = positions.value[i];
      const posB = positions.value[j];
      
      const distance = Math.sqrt(Math.pow(posB.left - posA.left, 2) + Math.pow(posB.top - posA.top, 2));
      
      // 충돌 범위 내에 있을 경우
      if (distance < 120) {  // 150px 범위 안에서 충돌로 판단
        const angle = Math.atan2(posB.top - posA.top, posB.left - posA.left);
        
        // 충돌한 카드를 반대 방향으로 밀어냄
        const newTargetA = {
          left: posA.left - Math.cos(angle) * 50,  // 반대 방향으로 이동
          top: posA.top - Math.sin(angle) * 50,
        };
        
        const newTargetB = {
          left: posB.left + Math.cos(angle) * 50,  // 반대 방향으로 이동
          top: posB.top + Math.sin(angle) * 50,
        };
        
        positions.value[i] = newTargetA;
        positions.value[j] = newTargetB;

        // 밀린 후 새로운 목표 위치를 설정
        targetPositions.value[i] = {
          left: newTargetA.left,
          top: newTargetA.top,
        };
        
        targetPositions.value[j] = {
          left: newTargetB.left,
          top: newTargetB.top,
        };
      }
    }
  }
}

// 게시글 작성하기 버튼과 카드의 충돌 방지
const preventButtonCollision = () => {
  posts.value.forEach((post, index) => {
    const pos = positions.value[index];
    
    const distance = Math.sqrt(Math.pow(pos.left - buttonPosition.value.left, 2) + Math.pow(pos.top - buttonPosition.value.top, 2));
    
    if (distance < buttonPosition.value.width + 50) {  // 버튼과 너무 가까운 경우
      const angle = Math.atan2(buttonPosition.value.top - pos.top, buttonPosition.value.left - pos.left);
      
      // 카드가 버튼을 피하도록 반대 방향으로 밀어냄
      positions.value[index] = {
        left: pos.left - Math.cos(angle) * 30,
        top: pos.top - Math.sin(angle) * 30,
      };
      
      targetPositions.value[index] = positions.value[index];
    }
  });
}

onMounted(async () => {
  const token = localStorage.getItem('userToken');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    
    if (Array.isArray(response.data)) {
      posts.value = response.data;
      
      // 각 카드의 랜덤 위치 설정
      posts.value.forEach((_, index) => {
        positions.value[index] = {
          top: Math.random() * window.innerHeight,
          left: Math.random() * window.innerWidth,
        };
        
        targetPositions.value[index] = {
          left: positions.value[index].left,
          top: positions.value[index].top,
        };
        
        moving.value[index] = false;
      });
      
      // 게시글 작성하기 버튼의 위치와 크기 설정
      const button = document.querySelector('.create-post-button');
      if (button) {
        buttonPosition.value = button.getBoundingClientRect();
      }
      
      moveCards();  // 카드 이동 시작
    } else {
      error.value = '잘못된 데이터 형식입니다.';
    }
  } catch (err) {
    error.value = '게시글을 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

</script>

<style scoped>
.community-page {
  text-align: center;
  padding: 20px;
  height: 100vh;
  position: relative;
}

.title {
  color: #f5f5f5;
}

.posts-list {
  display: block;
  position: relative;
}

.post-item {
  background-color: #f5f5f5;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}

.movie-poster {
  width: 100px;
  border-radius: 10px;
}

.post-content {
  margin-top: auto;
}

h3 {
  font-size: 18px;  /* 제목 크기 증가 */
  font-weight: bold;
}

p {
  font-size: 14px;  /* 내용 크기 증가 */
}

.create-post-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: transparent;
  color: white;  /* 글씨 색을 하얀색으로 설정 */
  border-radius: 10px;
  margin-top: 30px;
  cursor: pointer;
  font-size: 20px;  /* 버튼 크기 증가 */
  font-weight: 600;
}


</style>
