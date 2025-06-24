<template>
  <div class="document-table-container card">
    <div class="card-header">
      <h3>Quản lý Tài liệu</h3>
    </div>

    <div v-if="loading" class="state-info">
      <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
    </div>
    
    <div v-if="error" class="state-info error">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>

    <div v-if="!loading && !error && documents.length === 0" class="state-info empty-state">
      <i class="fas fa-folder-open"></i>
      <p>Không có tài liệu nào để hiển thị</p>
    </div>

    <div v-if="!loading && !error && documents.length > 0" class="table-responsive">
      <table class="document-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Ngày tạo</th>
            <th class="text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documentsWithAuthors" :key="doc.id">
            <td>#{{ doc.id }}</td>
            <td class="doc-title">{{ doc.title }}</td>
            <td>{{ doc.creator_name }}</td>
            <td>{{ formatDate(doc.created_at) }}</td>
            <td class="action-cell">
              <button 
                class="btn-icon btn-info" 
                @click="viewDocument(doc)"
                title="Xem chi tiết"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button 
                class="btn-icon btn-danger" 
                @click="deleteDocument(doc.id)"
                v-if="canEditDocument(doc)"
                title="Xóa"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="modal-fade">
      <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
        <div class="modal-content detail-modal">
          <div class="modal-header">
            <h3>Chi tiết Tài liệu</h3>
            <button class="close-btn" @click="closeDetailModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="document-detail">
              <div class="detail-item">
                <label>ID</label>
                <span>#{{ currentDocumentDetail.id }}</span>
              </div>
              <div class="detail-item">
                <label>Tiêu đề</label>
                <span>{{ currentDocumentDetail.title }}</span>
              </div>
              <div class="detail-item">
                <label>Tác giả</label>
                <span>{{ currentDocumentDetail.creator_name }}</span>
              </div>
              <div class="detail-item">
                <label>Ngày tạo</label>
                <span>{{ formatDate(currentDocumentDetail.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Props, emits, và các ref cơ bản
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
const filteredDocuments = computed(() => {
  if (!props.searchQuery) return documentsWithAuthors.value
  const query = props.searchQuery.toLowerCase()
  return documentsWithAuthors.value.filter(doc => 
    doc.title.toLowerCase().includes(query) || 
    doc.creator_name.toLowerCase().includes(query)
)})
const emit = defineEmits(['refresh'])
const API_URL = 'http://127.0.0.1:8000'
const documents = ref([])
const users = ref([])
const loading = ref(true)
const error = ref(null)
const showDetailModal = ref(false)
const currentDocumentDetail = ref({})

// Computed property để kết hợp thông tin tác giả
const documentsWithAuthors = computed(() => {
  return documents.value.map(doc => ({
    ...doc,
    creator_name: getUserName(doc.created_by)
  }))
})

// Helper functions
const canEditDocument = (doc) => {
  return props.currentUser?.role === 'admin' || props.currentUser?.id === doc.created_by
}

const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định'
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'Không xác định'
}

// API functions
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    users.value = response.data
  } catch (err) {
    console.error('Error fetching users:', err)
  }
}

const fetchDocuments = async () => {
  try {
    loading.value = true
    error.value = null
    await fetchUsers()
    const response = await axios.get(`${API_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    documents.value = response.data
  } catch (err) {
    console.error('Error fetching documents:', err)
    error.value = err.response?.data?.detail || err.message || 'Không thể tải danh sách tài liệu'
  } finally {
    loading.value = false
  }
}

const viewDocument = (doc) => {
  currentDocumentDetail.value = {
    ...doc,
    creator_name: getUserName(doc.created_by)
  }
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
}

const deleteDocument = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này? Thao tác này không thể hoàn tác.')) return
  
  try {
    await axios.delete(`${API__URL}/documents/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    documents.value = documents.value.filter(doc => doc.id !== id);
    emit('refresh')
  } catch (err) {
    console.error('Error deleting document:', err)
    alert(err.response?.data?.detail || 'Không thể xóa tài liệu. Vui lòng thử lại.')
  }
}



// Initialize
onMounted(async () => {
  await fetchDocuments()
})
</script>

<style scoped>
/* ✨ APPLIED: Áp dụng theme và layout nhất quán */

.card {
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
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

.table-responsive { overflow-x: auto; }
.document-table { width: 100%; border-collapse: collapse; }

.document-table th, .document-table td {
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.document-table thead th {
  background-color: #F9FAFB;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6B7280;
  letter-spacing: 0.05em;
}

.document-table tbody tr:last-child td { border-bottom: none; }
.document-table tbody tr:hover { background-color: #F9FAFB; }

.doc-title {
  font-weight: 500;
  color: #111827;
}

.action-cell {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
.text-right { text-align: right; }

.btn-icon {
  background: transparent; border: none; cursor: pointer; padding: 8px;
  border-radius: 50%; font-size: 0.9rem;
  width: 36px; height: 36px;
  display: inline-flex; justify-content: center; align-items: center;
  transition: all 0.2s ease;
}
.btn-icon.btn-info { color: var(--info-color); }
.btn-icon.btn-info:hover { background-color: #F0F9FF; color: #0284C7; }

.btn-icon.btn-danger { color: #EF4444; }
.btn-icon.btn-danger:hover { background-color: var(--danger-bg); color: var(--danger-text); }


/* States */
.state-info {
  padding: 60px 24px;
  text-align: center;
  color: #6B7280;
}
.state-info i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
  color: #9CA3AF;
}
.state-info.error { color: var(--danger-text); }
.state-info.error i { color: var(--danger-text); }
.empty-state p { font-size: 1.125rem; margin: 0; }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}

.modal-content {
  background: white; border-radius: 12px; width: 600px;
  max-width: 95%; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  display: flex; flex-direction: column;
}

.modal-header {
  padding: 16px 24px; border-bottom: 1px solid var(--border-color);
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 {
  font-size: 1.25rem; font-weight: 700; margin: 0;
  background-image: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.close-btn {
  background: none; border: none; font-size: 1.75rem; line-height: 1;
  color: #9CA3AF; cursor: pointer;
}

.modal-body { padding: 24px; }
.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--border-color);
  display: flex; justify-content: flex-end; gap: 12px;
  background-color: #F9FAFB;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.document-detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-item label {
  font-size: 0.875rem;
  color: #6B7280;
  font-weight: 500;
}
.detail-item span {
  font-size: 1rem;
  color: #111827;
  word-break: break-word;
}

.btn {
  padding: 10px 16px; border-radius: 8px; cursor: pointer; border: none;
  font-weight: 600;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.2s ease-in-out;
}
.btn-primary {
  color: white;
  background-image: var(--primary-gradient);
  box-shadow: 0 4px 15px -5px color-mix(in srgb, var(--accent-color) 50%, transparent);
}
.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px -5px color-mix(in srgb, var(--accent-color) 60%, transparent);
}
.btn-download {
  width: 100%;
  justify-content: center;
  padding: 12px;
  font-size: 1rem;
}

/* Animation */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-active .modal-content, .modal-fade-leave-active .modal-content {
  transition: all 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-content, .modal-fade-leave-to .modal-content {
  transform: translateY(-20px) scale(0.95);
}
</style>
<style>
:root {
  --primary-color: #4F46E5;
  --accent-color: #7C3AED;
  --info-color: #0EA5E9; /* Sky blue for view button */
  --primary-gradient: linear-gradient(to right, var(--primary-color), var(--accent-color));
  --border-color: #E5E7EB;
  --card-bg: #FFFFFF;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --danger-bg: #FEE2E2;
  --danger-text: #991B1B;
}</style>