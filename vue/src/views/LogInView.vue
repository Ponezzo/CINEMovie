<template>
  <div class="login-container">
    <div class="login-box">
      <h1>CINEMovie</h1>
      <form @submit.prevent="logIn">
        <div class="input-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model.trim="username" placeholder="Enter your Id" />
        </div>

        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model.trim="password" placeholder="Enter your password" />
        </div>

        <button type="submit" class="login-btn">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

const username = ref(null)
const password = ref(null)

const store = useCounterStore()

const logIn = () => {
  const payload = {
    username: username.value,
    password: password.value
  }
  store.logIn(payload)
}
</script>

<style scoped>
/* 전체 배경 설정 */
@font-face {
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
  font-weight: normal;
  font-stretch: semi-expanded;
  font-style: normal;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: transparent;
  background-size: cover;
  background-position: center;
  
}

/* 로그인 박스 스타일 */
.login-box {
  background: rgba(0, 0, 0, 0.4); /* 투명 배경 */
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 제목 스타일 */
h1 {
  color: whitesmoke;
  font-size: 28px;
  margin-bottom: 20px;
  font-family: 'GowunBatang-Regular', sans-serif; /* 제목에 폰트 적용 */
}

/* 입력 필드 그룹 스타일 */
.input-group {
  margin-bottom: 20px;
  text-align: left;
  margin-right: 22px;
}

.input-group label {
  font-size: 18px;
  color: whitesmoke;
  margin-bottom: 5px;
  display: block;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f8f8f8;
  color: black;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: grey;
  background-color: #fff;
  outline: none;
}

/* 로그인 버튼 스타일 */
.login-btn {
  width: 80%;
  padding: 12px;
  background-color:whitesmoke;
  color: black;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
  font-weight: normal;
  font-stretch: semi-expanded;
  font-style: bold;
}

.login-btn:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.login-btn:active {
  background-color: grey;
}


/* 반응형 디자인 */
@media (max-width: 768px) {
  .login-box {
    padding: 30px;
  }

  h1 {
    font-size: 24px;
  }

  .input-group input {
    padding: 8px;
  }

  .login-btn {
    font-size: 16px;
  }
}
</style>
