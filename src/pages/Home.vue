<template>
  <div class="document-home">
    <header class="app-header">
      <div class="header-content">
        <div class="app-branding">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"></path>
          </svg>
          <h1 class="app-title">Tài liệu của tôi</h1>
        </div>
        <div class="user-actions">
          <button @click="logout" class="logout-btn" title="Đăng xuất">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>

    <main class="document-main">
      <div class="action-bar">
        <button @click="createNewDoc" class="create-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          Tạo tài liệu mới
        </button>

        <div class="filter-controls">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"></path>
            </svg>
            <input type="text" v-model="searchQuery" placeholder="Tìm theo tên tài liệu..." class="search-input">
          </div>
         
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải danh sách tài liệu...</p>
      </div>
      
      <div v-else-if="!documents.length" class="empty-state"> <svg class="empty-illustration" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
                <path d="M56 18v34a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6h17" stroke="#aab1b9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
                <g transform="translate(36 2)" stroke="#c5c9d1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="11"></circle>
                <path d="m26 26-8.22-8.22"></path>
                </g>
            </g>
        </svg>
        <h3>Không có tài liệu nào</h3>
        <p>Bắt đầu bằng cách tạo một tài liệu mới.</p>
        <button @click="createNewDoc" class="create-btn empty-action-btn">
           <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          Tạo mới
        </button>
      </div>
      <div v-else-if="displayedDocuments.length === 0 && searchQuery" class="empty-state"> <svg class="empty-illustration" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
                <path d="M56 18v34a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6h17" stroke="#aab1b9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
                <g transform="translate(36 2)" stroke="#c5c9d1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="11"></circle>
                <path d="m26 26-8.22-8.22"></path>
                </g>
            </g>
        </svg>
        <h3>Không tìm thấy tài liệu</h3>
        <p>Không có tài liệu nào khớp với từ khóa "<strong>{{ searchQuery }}</strong>".</p>
      </div>

      <div v-else class="documents-grid">
        <div 
          v-for="doc in displayedDocuments" 
          :key="doc.id" 
          class="document-card"
        >
          <div class="card-thumbnail" @click="openDocument(doc.id)">
            <svg class="doc-icon-large" viewBox="0 0 24 24" fill="currentColor">
               <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm3 10H8v-2h8v2zm0-4H8v-2h8v2zm-3-4H8V9h5v2z"></path>
            </svg>
          </div>
          <div class="card-content" @click="openDocument(doc.id)">
            <h3 class="card-title" :title="doc.title || 'Tài liệu không tên'">{{ doc.title || 'Tài liệu không tên' }}</h3>
            <div class="card-meta">
              <span>Tạo: {{ formatDate(doc.created_at) }}</span>
              <span>Sửa cuối: {{ formatDate(doc.updated_at || (doc.history && doc.history.length > 0 ? doc.history[0].edited_at : doc.created_at)) }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button @click.stop="promptDeleteDocument(doc)" class="action-btn delete-btn" title="Xóa tài liệu">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
          </div>
          <div v-if="loadingDocumentId === doc.id" class="document-loading-overlay">
            <div class="spinner-small"></div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal confirm-delete-modal">
        <div class="modal-header">
          <h4>Xác nhận xóa</h4>
           <button @click="showDeleteConfirm = false" class="close-modal-btn" :disabled="isDeleting">&times;</button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa tài liệu "<strong>{{ documentToDelete?.title || 'Tài liệu này' }}</strong>"?<br>Hành động này không thể hoàn tác.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteConfirm = false" class="btn btn-secondary" :disabled="isDeleting">Hủy</button>
          <button @click="deleteDocumentConfirmed" class="btn btn-danger" :disabled="isDeleting">
            {{ isDeleting ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showHistoryModal" class="modal-overlay" @click.self="closeHistoryModal">
        <div class="modal history-modal">
            <div class="modal-header">
                <h4>Lịch sử chỉnh sửa: {{ currentDocForHistory?.title || 'Tài liệu' }}</h4>
                <button @click="closeHistoryModal" class="close-modal-btn" :disabled="isLoadingHistory || isRestoring">&times;</button>
            </div>
            <div class="modal-body">
                <div v-if="isLoadingHistory" class="loading-state small">
                    <div class="spinner"></div> <p>Đang tải lịch sử...</p>
                </div>
                <ul v-else-if="documentHistory.length > 0" class="history-list">
                    <li v-for="(version, index) in documentHistory" :key="version.id" class="history-item">
                        <div class="history-item-info">
                            <span class="history-version-name">Phiên bản {{ documentHistory.length - index }}</span>
                            <span class="history-edited-by">Sửa bởi: {{ version.editor_username || 'Không rõ' }}</span>
                            <span class="history-date">Vào lúc: {{ formatDate(version.edited_at) }}</span>
                        </div>
                        <button 
                            @click="restoreFromHistory(version.id, currentDocForHistory.id)" 
                            class="btn btn-small btn-primary"
                            title="Khôi phục về phiên bản này"
                            :disabled="isRestoring || (isRestoring && restoringHistoryId === version.id)">
                            {{ isRestoring && restoringHistoryId === version.id ? 'Đang khôi phục...' : 'Khôi phục' }}
                        </button>
                    </li>
                </ul>
                <p v-else class="empty-history-message">Chưa có lịch sử nào cho tài liệu này.</p>
            </div>
            <div class="modal-footer">
                 <button @click="closeHistoryModal" class="btn btn-secondary" :disabled="isLoadingHistory || isRestoring">Đóng</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const documents = ref([]); // Danh sách gốc từ API, không sắp xếp ở đây
const loading = ref(true);
const loadingDocumentId = ref(null);

// Refs cho chức năng xóa
const showDeleteConfirm = ref(false);
const documentToDelete = ref(null);
const isDeleting = ref(false);

// Refs cho chức năng lịch sử
const showHistoryModal = ref(false);
const documentHistory = ref([]);
const currentDocForHistory = ref(null);
const isLoadingHistory = ref(false);
const isRestoring = ref(false);
const restoringHistoryId = ref(null);

// --- STATE CHO TÌM KIẾM VÀ SẮP XẾP ---
const searchQuery = ref('');
const sortCriteria = ref(''); // Sẽ được khởi tạo bên dưới
const sortOrder = ref('');   // Sẽ được khởi tạo bên dưới
const currentSortOption = ref('updated_at_desc'); // Giá trị mặc định cho dropdown

// Khởi tạo sortCriteria và sortOrder dựa trên currentSortOption mặc định
const [initialCriteria, initialOrder] = currentSortOption.value.split('_');
sortCriteria.value = initialCriteria;
sortOrder.value = initialOrder;

// Watcher để cập nhật sortCriteria và sortOrder khi currentSortOption thay đổi từ dropdown
watch(currentSortOption, (newValue) => {
  const [criteria, order] = newValue.split('_');
  sortCriteria.value = criteria;
  sortOrder.value = order;
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Bạn có thể thêm logic parse phức tạp hơn ở đây nếu cần
    return 'Ngày không hợp lệ';
  }
  return date.toLocaleString('vi-VN', options);
}

// --- COMPUTED PROPERTY ĐỂ LỌC VÀ SẮP XẾP TÀI LIỆU HIỂN THỊ ---
const displayedDocuments = computed(() => {
  let docsToDisplay = [...documents.value];

  // 1. Áp dụng bộ lọc tìm kiếm (không phân biệt hoa thường)
  if (searchQuery.value.trim() !== '') {
    const lowerSearchQuery = searchQuery.value.toLowerCase().trim();
    docsToDisplay = docsToDisplay.filter(doc =>
      doc.title && doc.title.toLowerCase().includes(lowerSearchQuery)
    );
  }

  // 2. Áp dụng sắp xếp
  if (sortCriteria.value) {
    docsToDisplay.sort((a, b) => {
      let valA, valB;
      const field = sortCriteria.value;

      if (field === 'title') {
        valA = a.title?.toLowerCase() || '';
        valB = b.title?.toLowerCase() || '';
      } else if (field === 'created_at' || field === 'updated_at') {
        let dateStringA, dateStringB;

        // Logic lấy chuỗi ngày tháng, ưu tiên trường đang sort, sau đó là created_at, cuối cùng là ngày mặc định
        if (field === 'updated_at') {
          dateStringA = a.updated_at || a.created_at || '1970-01-01T00:00:00Z';
          dateStringB = b.updated_at || b.created_at || '1970-01-01T00:00:00Z';
        } else { // field === 'created_at'
          dateStringA = a.created_at || '1970-01-01T00:00:00Z';
          dateStringB = b.created_at || '1970-01-01T00:00:00Z';
        }
        
        const dateA = new Date(dateStringA);
        const dateB = new Date(dateStringB);

        const aIsInvalid = isNaN(dateA.getTime());
        const bIsInvalid = isNaN(dateB.getTime());

        if (aIsInvalid && bIsInvalid) { valA = 0; valB = 0; }
        else if (aIsInvalid) { valA = sortOrder.value === 'asc' ? Infinity : -Infinity; valB = dateB; }
        else if (bIsInvalid) { valA = dateA; valB = sortOrder.value === 'asc' ? Infinity : -Infinity; }
        else {
            valA = dateA;
            valB = dateB;
        }
        
      } else {
        return 0; // Không sắp xếp nếu tiêu chí không xác định
      }

      // So sánh giá trị
      if (valA < valB) {
        return sortOrder.value === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder.value === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  return docsToDisplay;
});

const fetchUserDocuments = async () => {
  loading.value = true;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id'); 
  
  if (!token || !userId) {
    console.warn('Token hoặc User ID không tồn tại, đang điều hướng tới trang đăng nhập.');
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get(`https://docsbrain.id.vn/documents/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    documents.value = response.data; // Gán dữ liệu gốc, không sắp xếp ở đây
  } catch (error) {
    console.error('Error fetching documents:', error.response?.data || error.message);
    documents.value = []; 
    if (error.response?.status !== 404) {
        alert('Có lỗi xảy ra khi tải danh sách tài liệu của bạn.');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUserDocuments);

const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    ['current_document_id', 'current_document_title', 'current_document_content', 'current_document_format', 'documentContent', 'documentFileName']
        .forEach(item => localStorage.removeItem(item));
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

const createNewDoc = () => {
  ['current_document_id', 'current_document_title', 'current_document_content', 'current_document_format', 'documentContent', 'documentFileName']
      .forEach(item => localStorage.removeItem(item));
  router.push(`/editor/new`);
}

const openDocument = async (docId) => {
  loadingDocumentId.value = docId;
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    loadingDocumentId.value = null;
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get(`https://docsbrain.id.vn/documents/${docId}/content`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { id, title, content, format } = response.data;

    localStorage.setItem('current_document_id', id);
    localStorage.setItem('current_document_title', title);
    localStorage.setItem('current_document_content', content);
    localStorage.setItem('current_document_format', format);

    router.push(`/editor/${docId}`);

  } catch (error) {
    console.error('Lỗi khi mở tài liệu:', error.response?.data || error.message);
    alert(`Không thể mở tài liệu: ${error.response?.data?.detail || 'Lỗi không xác định'}`);
  } finally {
    loadingDocumentId.value = null;
  }
};

const promptDeleteDocument = (doc) => {
  documentToDelete.value = doc;
  showDeleteConfirm.value = true;
}

const deleteDocumentConfirmed = async () => {
  if (!documentToDelete.value) return;
  isDeleting.value = true;
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    router.push('/login');
    return;
  }

  try {
    await axios.delete(`https://docsbrain.id.vn/documents/${documentToDelete.value.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Cập nhật UI: lọc document đã xóa ra khỏi mảng gốc
    documents.value = documents.value.filter(doc => doc.id !== documentToDelete.value.id);
    // Không cần gọi lại fetchUserDocuments nếu chỉ muốn cập nhật UI từ dữ liệu hiện có
  } catch (error) {
    console.error('Lỗi khi xóa tài liệu:', error.response?.data || error.message);
    alert(`Không thể xóa tài liệu: ${error.response?.data?.detail || 'Lỗi không xác định'}`);
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    documentToDelete.value = null;
  }
}

const triggerOpenHistoryModal = async (doc) => {
  currentDocForHistory.value = doc;
  documentHistory.value = []; 
  showHistoryModal.value = true;
  isLoadingHistory.value = true;

  const token = localStorage.getItem('token');
  if (!doc.id || !token) {
      console.warn("Thiếu thông tin để tải lịch sử cho doc id:", doc.id);
      isLoadingHistory.value = false;
      return;
  }
  try {
      const response = await axios.get(`https://docsbrain.id.vn/documents/${doc.id}/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      // API nên trả về lịch sử đã sắp xếp, hoặc sắp xếp ở đây
      documentHistory.value = response.data.sort((a,b) => new Date(b.edited_at) - new Date(a.edited_at));
  } catch (error) {
      console.error('Lỗi tải lịch sử:', error.response?.data || error.message);
      if (error.response?.status !== 404) { // Không báo lỗi nếu 404 (chưa có version)
          alert("Lỗi khi tải lịch sử tài liệu.");
      }
  } finally {
      isLoadingHistory.value = false;
  }
};

const closeHistoryModal = () => {
    showHistoryModal.value = false;
    currentDocForHistory.value = null;
    documentHistory.value = [];
};

const restoreFromHistory = async (historyId, mainDocumentId) => {
    if (!mainDocumentId || !historyId) {
        alert("Thiếu thông tin để khôi phục.");
        return;
    }
    const confirmRestore = confirm("Khôi phục phiên bản này sẽ cập nhật nội dung hiện tại của tài liệu. Nội dung hiện tại SẼ ĐƯỢC LƯU thành một bản lịch sử mới trước khi khôi phục. Bạn có chắc chắn?");
    if (!confirmRestore) return;

    isRestoring.value = true;
    restoringHistoryId.value = historyId;
    const token = localStorage.getItem('token');
    try {
        await axios.post(`https://docsbrain.id.vn/documents/restore/${historyId}`, 
            { document_id: mainDocumentId }, 
            { headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Đã khôi phục tài liệu. Danh sách sẽ được làm mới.");
        closeHistoryModal();
        await fetchUserDocuments(); // Tải lại danh sách để cập nhật 'updated_at' và có thể cả nội dung
    } catch (error) {
        console.error("Lỗi khi khôi phục tài liệu:", error.response?.data || error.message);
        alert(`Không thể khôi phục tài liệu: ${error.response?.data?.detail || 'Lỗi không xác định'}`);
    } finally {
        isRestoring.value = false;
        restoringHistoryId.value = null;
    }
};
</script>
<style scoped>
/* General Styles */


.document-home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-light);
  font-family: var(--font-family-main);
  color: var(--text-primary);
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor; 
}


/* Header */
.app-header {
  background-color: var(--background-white);
  padding: 0 24px;
  border-bottom: 1px solid var(--border-color);
  height: 64px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100; ;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.app-branding {
  display: flex;
  align-items: center;
  gap: 12px; 
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: var(--primary-color);
}

.app-title {
  font-size: 1.375rem; 
  font-weight: 500;
  color: var(--primary-color);
  font-family: var(--font-family-headings);
  margin: 0;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-greeting {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-right: 8px; 
}

.logout-btn {
  display: inline-flex; 
  align-items: center;
  gap: 8px;
  background-color: transparent; 
  color: var(--text-secondary);
  border: 1px solid transparent; 
  padding: 8px 12px; 
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.logout-btn:hover {
  background-color: var(--action-hover-bg);
  color: var(--text-primary);
}
.logout-btn .icon {
  width: 18px;
  height: 18px;
}

/* Main Content Area */
.document-main {
  flex-grow: 1;
  padding: 24px 32px; 
  overflow-y: auto;
}

.action-bar {
  margin-bottom: 32px; 
  display: flex;
  justify-content: space-between; /* Đẩy create-btn và filter-controls ra hai bên */
  align-items: center;
  flex-wrap: wrap; /* Cho phép xuống dòng trên màn hình nhỏ */
  gap: 16px; /* Khoảng cách giữa các cụm control */
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px; 
  flex-wrap: wrap; 
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
  pointer-events: none; 
}

.search-input {
  padding: 9px 12px 9px 40px; 
  border: 1px solid var(--border-color);
  border-radius: 20px; 
  font-size: 0.9rem;
  color: var(--text-secondary);
  background-color: var(--background-white);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 220px; 
}
.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.25); /* Hiệu ứng focus rõ hơn */
}

.sort-select {
  padding: 9px 12px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-primary);
  background-color: var(--background-white);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 180px; 
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235f6368'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); /* Custom dropdown arrow */
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.sort-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.25);
}


.create-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 24px; 
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 20px; 
  cursor: pointer;
  display: inline-flex; 
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
  transition: box-shadow 0.28s cubic-bezier(0.4,0,0.2,1), background-color 0.2s ease;
}
.create-btn:hover {
  box-shadow: 0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149);
  background-color: var(--primary-color-dark);
}
.create-btn .icon { 
  width: 18px;
  height: 18px;
}

/* Loading State */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 40px; 
}
.loading-state.small { 
    padding: 20px;
    margin-top: 0;
    font-size: 0.9rem;
}
.loading-state.small .spinner {
    width: 24px;
    height: 24px;
    margin-bottom: 8px;
}

.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  width: 40px; 
  height: 40px;
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 0.8s linear infinite; 
  margin-bottom: 20px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-illustration {
    width: 120px; 
    height: 120px;
    margin-bottom: 24px;
    opacity: 0.6;
}
.empty-state h3 {
  font-size: 1.6rem;
  font-weight: 500;
  font-family: var(--font-family-headings);
  margin-bottom: 12px;
  color: var(--text-secondary);
}
.empty-state p {
  margin-bottom: 24px;
  font-size: 1rem;
  max-width: 400px;
}
.empty-action-btn { 
  font-size: 0.95rem;
  padding: 10px 22px;
}


/* Documents Grid */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
  gap: 24px; 
}

.document-card {
  background-color: var(--background-white);
  border: 1px solid var(--border-color);
  border-radius: 12px; 
  transition: box-shadow 0.25s ease-in-out; /* Bỏ transform để tránh giật khi hover */
  display: flex;
  flex-direction: column;
  overflow: hidden; 
}
.document-card:hover {
  box-shadow: 0 6px 12px rgba(60,64,67,0.15), 0 1px 3px rgba(60,64,67,0.1); 
}

.card-thumbnail {
    height: 150px; 
    background-color: #e8f0fe; /* Màu nền nhẹ cho thumbnail */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease;
}
.document-card:hover .card-thumbnail {
    background-color: #d2e3fc; /* Đậm hơn khi hover card */
}

.doc-icon-large {
    width: 56px; 
    height: 56px;
    color: var(--primary-color);
    opacity: 0.9;
}

.card-content {
  padding: 16px;
  cursor: pointer;
  flex-grow: 1;
}

.card-title {
  font-size: 1rem; 
  font-weight: 500;
  font-family: var(--font-family-headings);
  color: var(--primary-color);
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}
.document-card:hover .card-title { 
    color: var(--primary-color);
}

.card-meta {
  font-size: 0.8rem; 
  color: var(--text-secondary);
  display: flex;
  flex-direction: column; 
  gap: 6px; 
}
.card-meta span { 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Card Actions */
.card-actions {
  display: flex;
  justify-content: center; 
  padding: 8px 8px; 
  border-top: 1px solid var(--border-color);
  background-color: transparent; 
  gap: 4px; 
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px; 
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.action-btn:hover {
  background-color: var(--action-hover-bg);
}
.action-btn .icon {
  width: 20px; 
  height: 20px;
}
.action-btn.delete-btn:hover {
  color: var(--danger-color);
}


/* Document loading overlay inside card */
.document-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85); 
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px; 
  z-index: 5; 
}
.spinner-small {
  border: 3px solid rgba(0,0,0,0.1);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 0.8s linear infinite;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(32,33,36,0.6); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050; 
  padding: 16px; 
}

.modal { 
  background-color: var(--background-white);
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06); 
  width: 100%; 
  max-width: 450px; 
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px; 
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h4 {
  margin: 0;
  font-size: 1.25rem; 
  font-weight: 500;
  font-family: var(--font-family-headings);
  color: var(--text-primary);
}
.close-modal-btn {
  background: none;
  border: none;
  font-size: 1.6rem; 
  line-height: 1;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0; 
  opacity: 0.7;
}
.close-modal-btn:hover {
    opacity: 1;
}


.modal-body {
  padding: 24px;
  line-height: 1.6;
  color: var(--text-secondary);
  font-size: 0.95rem; 
  text-align: left; 
}
.confirm-delete-modal .modal-body { 
    text-align: center;
}
.confirm-delete-modal .modal-body strong {
  color: var(--danger-color);
  font-weight: 500;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: var(--background-white); 
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.btn {
  padding: 9px 20px; 
  border: 1px solid transparent;
  border-radius: 4px; 
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  min-width: 80px; 
}

.btn-primary { 
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}
.btn-primary:hover {
    background-color: var(--primary-color-dark);
    border-color: var(--primary-color-dark);
}
.btn-primary:disabled:hover { background-color: var(--primary-color); border-color: var(--primary-color); }


.btn-secondary { 
  background-color: transparent;
  color: var(--primary-color); 
  border: 1px solid var(--border-color); 
}
.btn-secondary:hover {
  background-color: var(--action-hover-bg); 
  border-color: #c6c6c6; 
}
.btn-secondary:disabled:hover { background-color: transparent; border-color: var(--border-color); }


.btn-danger {
  background-color: var(--danger-color);
  color: white;
  border-color: var(--danger-color);
}
.btn-danger:hover {
  background-color: var(--danger-color-dark);
  border-color: var(--danger-color-dark);
}
.btn-danger:disabled:hover { background-color: var(--danger-color); border-color: var(--danger-color); }


.btn:disabled {
  opacity: 0.65; 
  cursor: not-allowed;
}


.btn-small {
    padding: 6px 12px;
    font-size: 0.8rem;
}

/* History Modal Specifics */
.history-modal {
    max-width: 550px; 
}
.history-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 350px; 
    overflow-y: auto;
}
.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px; 
    border-bottom: 1px solid #e8eaed; 
    transition: background-color 0.2s ease;
}
.history-item:last-child {
    border-bottom: none;
}
.history-item:hover {
    background-color: #f1f3f4; 
}

.history-item-info {
    display: flex;
    flex-direction: column;
    gap: 4px; 
    font-size: 0.9rem;
    flex-grow: 1; 
    margin-right: 16px; 
}
.history-version-name {
    font-weight: 500;
    color: var(--text-primary);
}
.history-edited-by, .history-date {
    font-size: 0.8rem;
    color: var(--text-tertiary);
}
.empty-history-message {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
}

/* Responsive adjustments for action-bar */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch; 
  }
  .filter-controls {
    width: 100%;
    flex-direction: column; /* Xếp chồng lên nhau trên mobile */
    gap: 12px; /* Giảm gap trên mobile */
  }
  .search-input-wrapper, .search-input {
    width: 100%; 
    min-width: unset;
  }
  .sort-select {
    width: 100%; 
    min-width: unset;
  }
}

</style>

<style>
 :root {
  --primary-color: #1a73e8; /* Google Blue */
  --primary-color-dark: #1765cc;
  --text-primary: #202124; /* Google Text Black */
  --text-secondary: #5f6368; /* Google Text Gray */
  --text-tertiary: #80868b;
  --border-color: #dadce0;
  --background-light: #f1f3f4; 
  --background-white: #ffffff;
  --danger-color: #d93025; /* Google Red */
  --danger-color-dark: #c53929;
  --action-hover-bg: rgba(60, 64, 67, 0.08); 
  --font-family-main: 'Roboto', 'Google Sans', Arial, sans-serif;
  --font-family-headings: 'Google Sans', 'Roboto', Arial, sans-serif;
}

</style>