import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,  // 로그인 여부
    user: null,              // 사용자 정보
    token: null,             // 인증 토큰
  }),
  actions: {
    login(userData, token) {
      this.isAuthenticated = true
      this.user = userData
      this.token = token
      localStorage.setItem('token', token) // 토큰을 로컬 스토리지에 저장
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      this.token = null
      localStorage.removeItem('token') // 로컬 스토리지에서 토큰 삭제
    }
  }
})
