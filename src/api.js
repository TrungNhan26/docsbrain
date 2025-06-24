// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Thay đổi baseURL nếu backend của bạn ở nơi khác
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
