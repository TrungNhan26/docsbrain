// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://docsbrain.id.vn', // Thay đổi baseURL nếu backend của bạn ở nơi khác
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
