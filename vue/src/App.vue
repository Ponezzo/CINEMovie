<template>
  <div id="app">
    <header class="navbar">
      <div class="navbar__container">
        <!-- 왼쪽 그룹 -->
        <div class="navbar__left">
          <img src="@/assets/Logo.png" alt="Logoimg" class="logoimg" @click="goHome" />
          <!-- <router-link to="/" class="Home">CINEMovie</router-link> -->
        </div>
        <!-- 오른쪽 그룹 -->
        <div class="navbar__right">
          <!-- 로그인되지 않은 경우 Signup, Login 보이기 -->
          <router-link v-if="!isLoggedIn" to="/signup" class="SignUp">Signup</router-link>
          <router-link v-if="!isLoggedIn" to="/login" class="Login">Login</router-link>
          
          <!-- 로그인된 경우 Logout 텍스트 보이기, 버튼 대신 클릭 이벤트로 로그아웃 -->
          <router-link v-if="isLoggedIn" to="/community" class="Community">Community</router-link>
          <router-link v-if="isLoggedIn" to="/profile" class="Profile">Profile</router-link>
          <router-link v-if="isLoggedIn" to="/search" class="Search">Search</router-link>
          <button v-if="isLoggedIn" @click="logOut" class="Logout">Logout</button>
          
          <!-- ChatView 버튼 -->
          <button class="chat-btn" @click="toggleChatView">Chat</button>

          <!-- ChatView 모달 -->
          <div v-if="isChatViewVisible" class="chat-modal">
            <div class="chat-modal-content">
              <ChatView />
              <button class="close-btn" @click="toggleChatView">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Fade-in/Fade-out 애니메이션 추가 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'  // Pinia store 가져오기
import ChatView from "@/views/ChatView.vue"

const router = useRouter()
const store = useCounterStore()

// 홈으로 가는 함수
const goHome = () => {
  router.push('/')
}

// 로그인 상태 계산 (Pinia store의 isLogin을 기반으로)
const isLoggedIn = computed(() => store.isLogin)

// 로그아웃 함수
const logOut = () => {
  store.logOut()  // Pinia store에서 로그아웃 처리
  router.push('/')  // 로그아웃 후 로그인 페이지로 리다이렉트
}

// 모달 상태 관리
const isChatViewVisible = ref(false)

// 모달 열기/닫기 함수
const toggleChatView = () => {
  isChatViewVisible.value = !isChatViewVisible.value
}
</script>


<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

.navbar__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: transparent;
  height: 60px;
}

.navbar__left,
.navbar__right {
  display: flex;
  align-items: center; 
  gap: 15px;
  height: 100%; 
}

.logoimg {
  height: 40px;
  cursor: pointer;
  display: block;
  object-fit: contain;
  margin-right: 10px;
  scale: 2.5;
}

.Home, .SignUp, .Login, .Logout, .Profile, .Search, .Community, .chat-btn {
  font-size: 18px;
  text-decoration: none;
  color: white;
  cursor: pointer;
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.Home::after, .SignUp::after, .Login::after, .Logout::after, .Profile::after, .Search::after, .Community::after, .chat-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: red;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.4s ease-out;
}

.Home:hover::after, .SignUp:hover::after, .Login:hover::after, .Logout:hover::after, .Profile:hover::after, .Search:hover::after, .Community:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.Home, .SignUp, .Login, .Logout, .Profile, .Search, .Community, .chat-btn:hover {
  color: whitesmoke; /* 글자 색 변경 */
}


.Logout {
  font-size: 18px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
  font-weight: normal;
  font-stretch: semi-expanded;
  font-style: normal;
}

.chat-btn {
  font-size: 18px;
  text-decoration: none;
  color: white;
  background-color: transparent;
  border: 1px solid white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.chat-btn:hover {
  background-color: white;
  color: black;
}

.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.chat-modal-content {
  background: #000; 
  padding: 20px;
  border-radius: 8px; 
  max-width: 400px;
  width: 90%; 
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgb(0, 0, 0); 
  border: none;
  font-size: 20px;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

@keyframes pop-in {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}


</style>
