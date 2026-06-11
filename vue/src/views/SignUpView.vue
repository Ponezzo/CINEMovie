<template>
  <div class="signup-container">
    <div class="signup-box">
      <h1>CINEMovie</h1>
      <form @submit.prevent="signUp">
        <div class="input-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model.trim="username" placeholder="Enter your username" />
        </div>

        <div class="input-group">
          <label for="password1">비밀번호</label>
          <input type="password" id="password1" v-model.trim="password1" placeholder="Enter your password" />
        </div>

        <div class="input-group">
          <label for="password2">비밀번호 확인</label>
          <input type="password" id="password2" v-model.trim="password2" placeholder="Confirm your password" />
        </div>

        <button type="submit" class="signup-btn">Go!</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

const username = ref(null)
const password1 = ref(null)
const password2 = ref(null)

const store = useCounterStore()

const signUp = () => {
  const payload = {
    username: username.value,
    password1: password1.value,
    password2: password2.value
  }
  store.signUp(payload)
}
</script>

<style scoped>
/* @font-face 추가 */
@font-face {
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
  font-weight: normal;
  font-stretch: semi-expanded;
  font-style: normal;
}

/* 전체 배경 설정 */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: transparent;
  background-size: cover;
  background-position: center;
  font-family: 'GowunBatang-Regular', sans-serif; /* 기본 폰트 설정 */
}

/* 회원가입 박스 스타일 */
.signup-box {
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
  border: 1px solid grey;
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

/* 회원가입 버튼 스타일 */
.signup-btn {
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

.signup-btn:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.signup-btn:active {
  background-color: grey;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .signup-box {
    padding: 30px;
  }

  h1 {
    font-size: 24px;
  }

  .input-group input {
    padding: 8px;
  }

  .signup-btn {
    font-size: 16px;
  }
}
</style>
