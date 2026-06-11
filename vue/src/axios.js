import axios from 'axios'
import { API_BASE_URL } from '@/config/api'

const instance = axios.create({
    baseURL: `${API_BASE_URL}/api/`,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default instance
