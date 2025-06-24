<template>
  <div class="admin-dashboard">
    <div class="sidebar">
      <div class="logo">
        <h2>Admin Dashboard</h2>
      </div>
      <ul class="menu">
        <li @click="activeSection = 'users'" :class="{ active: activeSection === 'users' }">
          <i class="fas fa-users"></i> Quản lý User
        </li>
        <li @click="activeSection = 'documents'" :class="{ active: activeSection === 'documents' }">
          <i class="fas fa-file-alt"></i> Quản lý Document
        </li>
      </ul>
      <div class="sidebar-footer">
        </div>
    </div>

    <div class="main-content">
      <div class="navbar">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            :placeholder="`Tìm kiếm trong ${activeSection === 'users' ? 'users' : 'documents'}...`"
            v-model="searchQuery"
            @input="handleSearch"
          >
        </div>
        <div class="user-profile">
          <span>{{ currentUser.name }}</span>
          <button @click="logout" class="btn btn-logout" title="Đăng xuất">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <div class="content">
        <div v-show="activeSection === 'users'" class="section">
          <UserTable 
            :currentUser="currentUser"
            :searchQuery="searchQuery"
            @refresh="fetchCurrentUser"
          />
        </div>

        <div v-show="activeSection === 'documents'" class="section">
          <DocumentTable 
            :currentUser="currentUser"
            :searchQuery="searchQuery"
            @refresh="fetchCurrentUser"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// *** LOGIC GIỮ NGUYÊN - KHÔNG THAY ĐỔI ***
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import UserTable from '@/components/UserTable.vue'
import DocumentTable from '@/components/DocumentTable.vue'

const router = useRouter()
const activeSection = ref('users')
const searchQuery = ref('')
const currentUser = ref({})

const API_URL = 'http://127.0.0.1:8000'

const fetchCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    currentUser.value = response.data
  } catch (err) {
    console.error('Failed to fetch current user:', err)
    router.push('/login')
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const handleSearch = () => {
  // Implement search logic or emit event to child components
}

onMounted(() => {
  fetchCurrentUser()
})
</script>

<style scoped>
/* Import modern font */


.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: var(--main-bg);
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 260px;
  height: 100vh;
  position: fixed;
  background-color: var(--sidebar-bg);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.logo {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo h2 {
    font-weight: 700;
}

.menu {
  list-style: none;
  padding: 16px 0;
  margin: 0;
  flex-grow: 1;
}

.menu li {
  padding: 12px 24px;
  margin: 4px 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 500;
}

.menu li:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.menu li.active {
  background-color: var(--primary-color);
  color: white;
}

.menu li i {
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.main-content {
  flex: 1;
  margin-left: 260px; /* Same as sidebar width */
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.search-box {
  position: relative;
  width: 350px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 45px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: var(--main-bg);
}

.search-box input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
}

.user-profile {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.user-profile span {
    margin-right: 16px;
}

.btn-logout {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B7280;
  font-size: 1.2rem;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-logout:hover {
    background-color: #F3F4F6;
    color: #111827;
}

.content {
  padding: 32px;
  flex-grow: 1;
}

/* We only need one section style now */
.section {
    padding: 0; /* Let child components handle padding */
}
</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* CSS Variables for easy theming */
:root {
  --sidebar-bg: #111827; /* Darker, modern background */
  --main-bg: #F9FAFB;
  --primary-color: #3B82F6; /* A nice, modern blue */
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --border-color: #E5E7EB;
  --card-bg: #FFFFFF;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}</style>