<template>
  <div class="user-table-container card">
    <div class="card-header">
      <h3>Quản lý User</h3>
      <button 
        class="btn btn-primary" 
        @click="openModal(null)"
        v-if="currentUser.role === 'admin'"
      >
        <i class="fas fa-plus"></i> Thêm User
      </button>
    </div>

    <div v-if="loading" class="state-info">Đang tải dữ liệu...</div>
    <div v-if="error" class="state-info error">{{ error }}</div>

    <div v-if="!loading && !error" class="table-responsive">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên User</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th class="text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="text-center">Không tìm thấy user nào.</td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>#{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select 
                class="role-select"
                v-model="user.role" 
                @change="updateUserRole(user.id, user.role)"
                :disabled="currentUser.role !== 'admin'"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </td>
            <td>
              <span :class="['status-badge', `status-${user.status}`]">
                {{ user.status === 'active' ? 'Hoạt động' : 'Vô hiệu' }}
              </span>
            </td>
            <td class="action-cell">
              <button 
                class="btn-icon" 
                title="Chỉnh sửa"
                @click="openModal(user)"
                v-if="currentUser.role === 'admin'"
              >
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button 
                class="btn-icon btn-danger" 
                title="Xóa"
                @click="deleteUser(user.id)"
                v-if="currentUser.role === 'admin' && currentUser.id !== user.id"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editingUser ? 'Chỉnh sửa User' : 'Thêm User mới' }}</h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="form-group">
                <label for="name">Tên</label>
                <input id="name" v-model="currentUserData.name" type="text" required>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="currentUserData.email" type="email" required :disabled="editingUser">
              </div>
              
              <div class="form-group" v-if="!editingUser">
                <label for="password">Mật khẩu</label>
                <input id="password" v-model="currentUserData.password" type="password" required>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label for="role">Vai trò</label>
                  <select id="role" v-model="currentUserData.role" required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="status">Trạng thái</label>
                  <select id="status" v-model="currentUserData.status" required>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Vô hiệu</option>
                  </select>
                </div>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
                <button type="submit" class="btn btn-primary">
                  {{ editingUser ? 'Cập nhật' : 'Thêm mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// *** LOGIC GIỮ NGUYÊN - KHÔNG THAY ĐỔI ***
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  },
  searchQuery: { // Thêm prop searchQuery
    type: String,
    default: ''
  }
})

const emit = defineEmits(['refresh'])

const API_URL = 'http://127.0.0.1:8000'
const users = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

const showModal = ref(false)
const editingUser = ref(false)
const currentUserData = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active'
})

const filteredUsers = computed(() => {
  if (!props.searchQuery) return users.value
  const query = props.searchQuery.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
)})

const fetchUsers = async () => {
  try {
    loading.value = true
    error.value = null;
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    users.value = response.data
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to fetch users'
  } finally {
    loading.value = false
  }
}

const openModal = (user) => {
  if (user) {
    currentUserData.value = { ...user, password: '' }
    editingUser.value = true
  } else {
    currentUserData.value = {
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    }
    editingUser.value = false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveUser = async () => {
  try {
    if (editingUser.value) {
      await axios.put(`${API_URL}/users/${currentUserData.value.id}`, currentUserData.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    } else {
      await axios.post(`${API_URL}/register`, currentUserData.value)
    }
    closeModal()
    fetchUsers()
    emit('refresh')
  } catch (err) {
    alert(err.response?.data?.detail || 'Failed to save user')
  }
}

const deleteUser = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa user này?')) return
  try {
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    fetchUsers()
    emit('refresh')
  } catch (err) {
    alert(err.response?.data?.detail || 'Failed to delete user')
  }
}

const updateUserRole = async (userId, newRole) => {
  try {
    await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    // Optionally show a success message
  } catch (err) {
    alert(err.response?.data?.detail || 'Failed to update user role');
    fetchUsers(); // Re-fetch to revert the change in UI
  }
}

onMounted(() => {
    fetchUsers()
})
</script>

<style scoped>
/* Using the same variables from the main dashboard for consistency */

.card {
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden; /* Important for table border radius */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.table-responsive {
    overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th, .user-table td {
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.user-table thead th {
  background-color: #F9FAFB;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6B7280;
  letter-spacing: 0.05em;
}

.user-table tbody tr:last-child td {
    border-bottom: none;
}

.user-table tbody tr:hover {
    background-color: #F9FAFB;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-active {
  background-color: var(--success-bg);
  color: var(--success-text);
}

.status-inactive {
  background-color: var(--danger-bg);
  color: var(--danger-text);
}

.role-select {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    background-color: white;
}

.role-select:disabled {
    background-color: transparent;
    border-color: transparent;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.action-cell {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
    color: #6B7280;
    padding: 40px;
}

/* Buttons */
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}
.btn-primary:hover {
    background-color: #2563EB;
}

.btn-secondary {
    background-color: #F3F4F6;
    color: #374151;
    border: 1px solid var(--border-color);
}
.btn-secondary:hover {
    background-color: #E5E7EB;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #6B7280;
  font-size: 0.9rem;
  width: 36px;
  height: 36px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.btn-icon:hover {
    background-color: #F3F4F6;
    color: #111827;
}
.btn-icon.btn-danger:hover {
    background-color: var(--danger-bg);
    color: var(--danger-text);
}

.state-info {
  padding: 40px;
  text-align: center;
  color: #6B7280;
}
.state-info.error {
  color: var(--danger-text);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(17, 24, 39, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 550px;
  max-width: 95%;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  color: #9CA3AF;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #F9FAFB;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus,
.form-group select:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

/* Modal Animation */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: translateY(-20px) scale(0.95);
}
</style>
<style>
:root {
  --primary-color: #3B82F6;
  --border-color: #E5E7EB;
  --card-bg: #FFFFFF;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --success-bg: #D1FAE5;
  --success-text: #065F46;
  --danger-bg: #FEE2E2;
  --danger-text: #991B1B;
}</style>