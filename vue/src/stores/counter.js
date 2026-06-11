import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { API_BASE_URL } from '@/config/api'

const formatAuthError = (err) => {
  const data = err?.response?.data
  if (!data) return '서버에 연결할 수 없습니다. Django 서버가 실행 중인지 확인해주세요.'
  if (typeof data === 'string') return data
  if (data.non_field_errors) return data.non_field_errors.join('\n')
  if (data.username) return data.username.join('\n')
  if (data.password1) return data.password1.join('\n')
  if (data.password2) return data.password2.join('\n')
  return JSON.stringify(data)
}

export const useCounterStore = defineStore('counter', () => {
  const articles = ref([])
  const movies = ref([])
  const likedMovies = ref([])
  const searchResults = ref([])
  const token = ref(localStorage.getItem('userToken'))

  const isLogin = computed(() => token.value !== null)

  const getMovies = function () {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&region=KR`

    return axios.get(url)
      .then((res) => {
        movies.value = res.data.results || []
      })
      .catch((err) => {
        console.error('Failed to fetch movies:', err)
      })
  }

  const saveSearchResults = () => {
    if (token.value) {
      localStorage.setItem(`searchResults_${token.value}`, JSON.stringify(searchResults.value))
    }
  }

  const loadSearchResults = () => {
    if (token.value) {
      const storedSearchResults = localStorage.getItem(`searchResults_${token.value}`)
      searchResults.value = storedSearchResults ? JSON.parse(storedSearchResults) : []
    }
  }

  const searchMovies = (query) => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ko-KR`

    axios.get(url)
      .then((res) => {
        searchResults.value = res.data.results || []
        saveSearchResults()
      })
      .catch((err) => {
        console.error('Failed to search movies:', err)
      })
  }

  const addLikedMovie = (movie) => {
    if (token.value && !likedMovies.value.some(m => m.id === movie.id)) {
      likedMovies.value.push(movie)
      localStorage.setItem(`likedMovies_${token.value}`, JSON.stringify(likedMovies.value))
    }
  }

  const removeLikedMovie = (movieId) => {
    if (token.value) {
      likedMovies.value = likedMovies.value.filter(movie => movie.id !== movieId)
      localStorage.setItem(`likedMovies_${token.value}`, JSON.stringify(likedMovies.value))
    }
  }

  const signUp = async (payload) => {
    const { username, password1, password2 } = payload

    if (!username || !password1 || !password2) {
      window.alert('아이디와 비밀번호를 모두 입력해주세요.')
      return
    }

    if (password1 !== password2) {
      window.alert('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      await axios.post(`${API_BASE_URL}/accounts/signup/`, {
        username,
        password1,
        password2,
      })
      await logIn({ username, password: password1 })
    } catch (err) {
      console.error(err)
      window.alert(formatAuthError(err))
    }
  }

  const logIn = async (payload) => {
    const { username, password } = payload

    if (!username || !password) {
      window.alert('아이디와 비밀번호를 입력해주세요.')
      return
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/accounts/login/`, { username, password })
      token.value = res.data.key
      localStorage.setItem('userToken', token.value)
      loadLikedMovies()
      router.push({ name: 'ArticleView' })
    } catch (err) {
      console.error(err)
      window.alert(formatAuthError(err))
    }
  }

  const logOut = () => {
    const currentToken = token.value
    token.value = null
    localStorage.removeItem('userToken')
    if (currentToken) {
      localStorage.removeItem(`likedMovies_${currentToken}`)
      localStorage.removeItem(`searchResults_${currentToken}`)
    }
    likedMovies.value = []
    searchResults.value = []
    router.push({ name: 'LogInView' })
  }

  const loadLikedMovies = () => {
    if (token.value) {
      const storedMovies = localStorage.getItem(`likedMovies_${token.value}`)
      likedMovies.value = storedMovies ? JSON.parse(storedMovies) : []
    }
  }

  onMounted(() => {
    loadSearchResults()
  })

  return {
    articles,
    movies,
    likedMovies,
    searchResults,
    API_URL: API_BASE_URL,
    getMovies,
    searchMovies,
    saveSearchResults,
    loadSearchResults,
    signUp,
    logIn,
    logOut,
    token,
    isLogin,
    addLikedMovie,
    removeLikedMovie,
  }
}, { persist: true })
