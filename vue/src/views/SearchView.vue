<template>
  <div :class="{'search-container-dark': isFocused}" class="search-container">
    <input 
      v-model="searchQuery" 
      @input="onSearch" 
      type="text" 
      class="search-input" 
      placeholder=""
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="onEnter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('') // 검색어 저장
const isFocused = ref(false) // 검색창 포커스 상태
const router = useRouter()

const onSearch = () => {
  console.log('검색어:', searchQuery.value)
}

const onEnter = () => {
  if (searchQuery.value.trim()) {
    // 엔터 키를 누르면 검색어를 URL 파라미터로 넘기며 검색 페이지로 이동
    router.push({ name: 'SearchList', query: { query: searchQuery.value } })
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* backdrop-filter: blur(10px); */
  transition: background-color 0.3s ease;
}

.search-container-dark {
  backdrop-filter: blur(10px);
}

.search-input {
  width: 60%;
  height: 15%;
  padding: 10px;
  font-size: 50px;
  border: 2px solid #ece8e8;
  border-radius: 45px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #333;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  caret-color: transparent;
  padding-left: 50px;
}

.search-input::placeholder {
  color: #ccc;
}
</style>
