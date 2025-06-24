<template>
  <div class="docs-container">
    <div class="main-container">
      <!-- Header with file name and menu -->
       <div class="sticky-toolbars-container">
      <div class="docs-header">
        <div class="header-left">
          <div class="logo">
            <span class="material-icons">description</span>
            <span>Docs</span>
          </div>
          <div class="file-name-container">
            <input v-model="fileName" class="file-name-input" placeholder="Nhập tên tài liệu" @blur="saveFileName" />
            <span class="file-type"></span>
          </div>
        </div>

        <div class="header-right">
          <div class="toolbar-section border-left">
          
            <div v-if="showSaveSuccessMessage" class="save-success-message">
              <span class="material-icons">check_circle</span>
              <span>Đã lưu</span>
            </div>
            <button class="toolbar-button" @click="speakText" :title="isSpeaking ? 'Dừng phát' : 'Phát âm thanh (Tiếng Việt)'">
  <span v-if="isSpeaking" class="material-icons stop-icon">stop_circle</span>
  <span v-else class="material-icons">record_voice_over</span>
</button>
 <button @click="toggleRecording" class="toolbar-button" :title="isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm(Chuyển đổi giọng nói thành văn bản)'">
        <span v-if="isRecording" class="material-icons stop-icon" style="color: red;">mic</span>
        <span v-else class="material-icons">mic_none</span>
    </button>
          <button class="toolbar-button" @click="openHistoryModal" title="Lịch sử">
            <span class="material-icons">history</span>
            
          </button>
         </div>
          <button class="chat-toggle-button" @click="toggleChatSidebar" title="Trợ lý tài liệu">
            <span class="material-icons">chat</span>
            <span>Trợ lý</span>
          </button>
          <button class="header-button" @click="toggleFullscreen"
            :title="isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'">
            <span class="material-icons">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
          </button>
          <div class="user-avatar">
            <span class="material-icons">account_circle</span>
          </div>
        </div>
      </div>

      <!-- Main toolbar -->
      <div class="main-toolbar">
        <div class="toolbar-section">
          <button class="toolbar-button" @click="newDocument" title="Mới (Ctrl+N)">
            <span class="material-icons">note_add</span>
            <span class="tooltip"></span>
          </button>
          <button class="toolbar-button" @click="triggerFileInput" title="Mở (Ctrl+O)">
            <span class="material-icons">folder_open</span>
            <span class="tooltip"></span>
          </button>
          <button class="toolbar-button" @click="showSaveModal = true" title="Lưu (Ctrl+S)">
            <span class="material-icons">save</span>
            <span class="tooltip"></span>
          </button>

          <!-- Modal -->
          <div v-if="showSaveModal" class="modal-overlay" @click.self="showSaveModal = false">
            <div class="modal-content">
              <h3>Chọn định dạng để lưu</h3>
              <select v-model="selectedFormat">
                <option value="docx">DOCX</option>
                <option value="pdf">PDF</option>
                <option value="html">HTML</option>
              </select>
              <div class="modal-actions">
                <button @click="saveDocument(selectedFormat)">Lưu</button>
                <button @click="showSaveModal = false">Hủy</button>
              </div>
            </div>
          </div>
          <button class="toolbar-button" @click="printDocument" title="In (Ctrl+P)">
            <span class="material-icons">print</span>
            <span class="tooltip"></span>
          </button>
          <input type="file" ref="fileInput" @change="importFile" accept=".txt,.doc,.docx,.pdf"
            style="display: none;" />
        </div>

        <div class="toolbar-section border-left">
          <button @click="undoAction" class="toolbar-button" :disabled="!canUndo" title="Hoàn tác (Ctrl+Z)">
            <span class="material-icons">undo</span>
          </button>
          <button @click="redoAction" class="toolbar-button" :disabled="!canRedo" title="Làm lại (Ctrl+Y)">
            <span class="material-icons">redo</span>
          </button>
        </div>

        <div class="toolbar-section border-left">
          <button @click="copyText" class="toolbar-button" title="Sao chép (Ctrl+C)">
            <span class="material-icons">content_copy</span>
          </button>
          <button @click="cutText" class="toolbar-button" title="Cắt (Ctrl+X)">
            <span class="material-icons">content_cut</span>
          </button>
          <button @click="pasteText" class="toolbar-button" title="Dán (Ctrl+V)">
            <span class="material-icons">content_paste</span>
          </button>
          <button class="summary-button" @click="openSummaryModal">
            <svg xmlns="http://www.w3.org/2000/svg" class="summary-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <span>Tóm Tắt</span>
          </button>
        </div>
      </div>

      <!-- Format toolbar -->
      <div class="format-toolbar">
        <div class="toolbar-section">
          <select @change="applyFont($event.target.value)" class="font-select">
            <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
          </select>

          <select @change="applyFontSize($event.target.value)" class="font-size-select">
            <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>

        <div class="toolbar-section border-left">
          <button @click="applyBold" :class="{ 'active': isBold }" class="toolbar-button" title="Đậm (Ctrl+B)">
            <span class="material-icons">format_bold</span>
          </button>
          <button @click="applyItalic" :class="{ 'active': isItalic }" class="toolbar-button" title="Nghiêng (Ctrl+I)">
            <span class="material-icons">format_italic</span>
          </button>
          <button @click="applyUnderline" :class="{ 'active': isUnderline }" class="toolbar-button"
            title="Gạch chân (Ctrl+U)">
            <span class="material-icons">format_underlined</span>
          </button>
          <button @click="applyStrikethrough" :class="{ 'active': isStrikethrough }" class="toolbar-button"
            title="Gạch ngang">
            <span class="material-icons">format_strikethrough</span>
          </button>
        </div>

        <div class="toolbar-section border-left">
          <div class="color-picker-wrapper">
            <button class="toolbar-button" title="Màu chữ">
              <span class="material-icons">format_color_text</span>
              <div class="current-color" :style="{ backgroundColor: textColor }"></div>
            </button>
            <input type="color" v-model="textColor" @input="applyTextColor" class="color-picker">
          </div>

          <div class="color-picker-wrapper">
            <button class="toolbar-button" title="Màu nền">
              <span class="material-icons">format_color_fill</span>
              <div class="current-color" :style="{ backgroundColor: highlightColor }"></div>
            </button>
            <input type="color" v-model="highlightColor" @input="applyHighlightColor" class="color-picker">
          </div>
        </div>

        <div class="toolbar-section border-left">
          <button @click="applyAlignment('left')" :class="{ 'active': textAlign === 'left' }" class="toolbar-button"
            title="Căn trái">
            <span class="material-icons">format_align_left</span>
          </button>
          <button @click="applyAlignment('center')" :class="{ 'active': textAlign === 'center' }" class="toolbar-button"
            title="Căn giữa">
            <span class="material-icons">format_align_center</span>
          </button>
          <button @click="applyAlignment('right')" :class="{ 'active': textAlign === 'right' }" class="toolbar-button"
            title="Căn phải">
            <span class="material-icons">format_align_right</span>
          </button>
          <button @click="applyAlignment('justify')" :class="{ 'active': textAlign === 'justify' }"
            class="toolbar-button" title="Căn đều">
            <span class="material-icons">format_align_justify</span>
          </button>
        </div>

        <div class="toolbar-section border-left">
          <button @click="applyBulletList" :class="{ 'active': isBulletList }" class="toolbar-button"
            title="Danh sách dấu chấm">
            <span class="material-icons">format_list_bulleted</span>
          </button>
          <button @click="applyNumberedList" :class="{ 'active': isNumberedList }" class="toolbar-button"
            title="Danh sách số">
            <span class="material-icons">format_list_numbered</span>
          </button>
        </div>

        <div class="toolbar-section border-left">
          <button @click="increaseIndent" class="toolbar-button" title="Tăng thụt lề">
            <span class="material-icons">format_indent_increase</span>
          </button>
          <button @click="decreaseIndent" class="toolbar-button" title="Giảm thụt lề">
            <span class="material-icons">format_indent_decrease</span>
          </button>
        </div>

        <div class="toolbar-section border-left">
          <button @click="clearFormatting" class="toolbar-button" title="Xóa định dạng">
            <span class="material-icons">format_clear</span>
          </button>
        </div>
      </div>
</div>
      <!-- Editor area -->
     <div class="editor-wrapper">
  <div ref="pageRef" class="page relative"> <div ref="editor" class="docs-editor" contenteditable="true" spellcheck="false" @input="handleInput"
      @keydown="handleEditorKeydown" @keydown.ctrl.b.prevent="applyBold" @keydown.ctrl.i.prevent="applyItalic"
      @keydown.ctrl.u.prevent="applyUnderline" @keydown.ctrl.z.prevent="undoAction"
      @keydown.ctrl.y.prevent="redoAction" @keydown.ctrl.shift.z.prevent="redoAction" @keyup="updateCaretPosition"
      @mouseup="updateCaretPosition"></div>
      
    <div
      v-if="ghostWord"
      class="ghost-text"
      :style="[ghostPosition, ghostStyle]" 
    >
      {{ ghostWord }}
    </div>
  </div>
</div>
       


      <!-- Status bar -->
      <div class="status-bar">
        <div class="status-item">
          <span class="material-icons">description</span>
        
        </div>
        <div class="status-item">
          <span>{{ wordCount }} từ</span>
        </div>
        <div class="status-item">
          <span>{{ characterCount }} ký tự</span>
        </div>
      </div>

      <!-- Share dialog -->
      <div v-if="showShareDialog" class="dialog-overlay">
        <div class="share-dialog">
          <div class="dialog-header">
            <h3>Chia sẻ tài liệu</h3>
            <button @click="showShareDialog = false" class="close-button">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="dialog-content">
            <div class="share-link">
              <input type="text" :value="shareableLink" readonly ref="shareLinkInput" class="link-input" />
              <button @click="copyShareLink" class="copy-button">
                <span class="material-icons">content_copy</span>
                <span>Sao chép</span>
              </button>
            </div>
            <div class="share-options">
              <label>
                <input type="checkbox" v-model="shareWithEdit"> Cho phép chỉnh sửa
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="modal-fade">
  <div v-if="showTranscriptionModal" class="modal-overlay" @click.self="showTranscriptionModal = false">
    <div class="modal-content">

      <div class="modal-header">
        <h3>Văn bản đã nhận dạng</h3>
        <button @click="showTranscriptionModal = false" class="close-button" title="Đóng">
          &times; </button>
      </div>

      <div class="modal-body">
        <div v-if="isTranscribing" class="loading-container">
          <div class="spinner"></div>
          <p>Đang xử lý âm thanh, vui lòng chờ...</p>
        </div>

        <div v-else>
          <textarea v-model="transcribedText" class="transcription-textarea" rows="6" placeholder="Văn bản nhận dạng sẽ xuất hiện ở đây..."></textarea>
          <p class="edit-hint">Bạn có thể chỉnh sửa văn bản ở trên trước khi chèn.</p>
        </div>
      </div>

      <div class="modal-actions">
        <button @click="applyTranscription" :disabled="isTranscribing" class="button-secondary">Chèn vào tài liệu</button>
         <button @click="showTranscriptionModal = false" class="button-primary">Đóng</button>
      </div>

    </div>
  </div>
</transition>
    <!-- Modal lịch sử -->
   <transition name="modal-fade">
  <div v-if="showHistoryModal" class="modal-overlay" @click.self="showHistoryModal = false">
    <div class="modal-content">

      <div class="modal-header">
        <h3>Lịch sử phiên bản</h3>
        <button @click="showHistoryModal = false" class="close-button" title="Đóng">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isHistoryLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Đang tải lịch sử...</p>
        </div>

        <div v-else-if="!documentHistory.length" class="empty-state">
          <span class="material-icons">history_toggle_off</span>
          <p>Không có phiên bản lịch sử nào được tìm thấy.</p>
        </div>

        <div v-else class="history-list">
          <div 
            v-for="(version, index) in documentHistory" 
            :key="version.id"
            class="history-item"
            @click="restoreFromHistory(version.id)"
            title="Khôi phục phiên bản này"
          >
            <div class="history-info">
              <span class="version-name">Phiên bản {{ documentHistory.length - index }}</span>
              <span class="version-date">{{ formatDate(version.edited_at) }}</span>
            </div>
            <span class="material-icons restore-icon">restore</span>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button @click="showHistoryModal = false" class="button-secondary">Đóng</button>
      </div>

    </div>
  </div>
</transition>
    <!-- Modal tóm tắt -->
    <div v-if="showSummaryModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Tóm tắt văn bản</h3>
        <p v-if="isSummarizing">Đang tóm tắt...</p>
        <p v-else-if="summaryResult">{{ summaryResult }}</p>
        <p v-else>Nhấn "Bắt đầu" để tóm tắt văn bản đang soạn.</p>

        <div class="modal-actions">
          <button @click="summarizeText" :disabled="isSummarizing">Bắt đầu</button>
          <button @click="closeSummaryModal">Đóng</button>
        </div>
      </div>
    </div>
    <div class="chat-sidebar" v-if="showChatSidebar">
      <h3 class="text-lg font-bold mb-2">Trợ lý tài liệu</h3>
      <div class="chat-messages">
        <div v-for="(msg, i) in chatMessages" :key="i" class="chat-msg">
          <strong>{{ msg.sender }}:</strong> {{ msg.text }}
        </div>
      </div>
      <div class="chat-input">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Nhập câu hỏi..." />
        <button @click="sendMessage">Gửi</button>
      </div>
    </div>
    <audio ref="audioPlayer" @ended="isSpeaking = false" style="display: none;"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { nextTick } from 'vue';
import axios from 'axios'
import { useRoute } from 'vue-router';
import DOMPurify from 'dompurify';
import mammoth from "mammoth";
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';
import { encodeWav } from '../utils/wav-encoder.js'; 
const router = useRouter();
const getEditorContent = () => {
  const editor = document.querySelector('.docs-editor');
  return editor?.innerHTML || '';
};

const sendContentToBackend = async (htmlContent) => {
  const response = await fetch('https://docsbrain.id.vn/create-doc-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: htmlContent })
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return await response.json(); // { message, session_id }
};



const isLoading = ref(false);
const showChatSidebar = ref(false); // Control hiển thị sidebar
const chatMessages = ref([]); // Lưu tin nhắn chat
const userInput = ref(''); // Nội dung input chat
const sessionId = ref(null); // Gán sau khi tạo AI
const toggleChatSidebar = async () => {
  if (showChatSidebar.value) {
    showChatSidebar.value = false;
    return;
  }
  const htmlContent = getEditorContent();
  const response = await sendContentToBackend(htmlContent);
  sessionId.value = response.session_id;
  showChatSidebar.value = true;
};

const askAI = async (question) => {
  const form = new URLSearchParams();
  form.append("question", question);
  form.append("session_id", sessionId.value);

  const res = await fetch("https://docsbrain.id.vn/chat-ai", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  return data;
};
const sendMessage = async () => {
  const message = userInput.value.trim();
  if (!message || isLoading.value) return;

  // Hiển thị tin nhắn người dùng
  chatMessages.value.push({
    sender: 'Bạn',
    text: message
  });
  // Xoá input
  userInput.value = '';
  // Hiển thị "đang trả lời..."
  isLoading.value = true;
  chatMessages.value.push({
    sender: 'Trợ lý',
    text: 'Đang trả lời...'
  });
  await nextTick(); // để scroll xuống dòng cuối
  scrollToBottom();
  try {
    const response = await askAI(message);
    // Xoá dòng "Đang trả lời..."
    chatMessages.value.pop();

    // Hiển thị câu trả lời
    chatMessages.value.push({
      sender: 'Trợ lý',
      text: response.answer || 'Không có phản hồi từ AI'
    });
    // Hiển thị nguồn tham khảo nếu có
    if (response.sources?.length) {
      chatMessages.value.push({
        sender: 'Trợ lý',
        text: `Nguồn tham khảo:\n- ${response.sources.join('\n- ')}`
      });
    }
  } catch (error) {
    // Xoá dòng "Đang trả lời..."
    chatMessages.value.pop();

    chatMessages.value.push({
      sender: 'Trợ lý',
      text: '❌ Lỗi khi gửi câu hỏi. Vui lòng thử lại.'
    });
    console.error("Lỗi AI:", error);
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};
// Scroll đến dòng cuối mỗi khi có tin nhắn
const scrollToBottom = () => {
  const el = document.querySelector('.chat-messages');
  if (el) el.scrollTop = el.scrollHeight;
};


// Font list
const fonts = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Roboto',
  'Open Sans',
  'Calibri',
  'Georgia',
  'Comic Sans MS',
  'Tahoma',
  'Helvetica'
]

// Font sizes
const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
// Main state
const editor = ref(null)
const ghostWord = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const selectedIndex = ref(0)
const ghostPosition = ref({ top: 0, left: 0, maxWidth: 'auto' })
const ghostStyle = ref({});
const  isGenerating= ref(false)
const pageRef = ref(null);
const fileInput = ref(null)
const fileName = ref('Tài liệu không tên')
const isFullscreen = ref(false)
const showShareDialog = ref(false)
const shareableLink = ref('')
const shareWithEdit = ref(false)
const lastSaved = ref('Chưa lưu')
const currentLine = ref(1)
const currentColumn = ref(1)
const showSummaryModal = ref(false);
const isSummarizing = ref(false);
const summaryResult = ref('');
// Format state tracking
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const isStrikethrough = ref(false)
const textColor = ref('#000000')
const highlightColor = ref('#FFFFFF')
const textAlign = ref('left')
const isBulletList = ref(false)
const isNumberedList = ref(false)
const selectedFont = ref('Arial')
const fontSize = ref(12)
const showSaveModal = ref(false);
const selectedFormat = ref('docx');
const documentId = ref(null);
const isNewDocument = ref(false);
const showHistoryModal = ref(false);
const documentHistory = ref([]);
// Undo/redo history
const history = ref([])
const historyIndex = ref(-1)
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)
const audioPlayer = ref(null);
const isSpeaking = ref(false);
const speechError = ref('');
const showSaveSuccessMessage = ref(false);
const isRecording = ref(false);
const showTranscriptionModal = ref(false);
const isTranscribing = ref(false);
const transcribedText = ref('');
let savedRange = null;

// Biến để lưu trữ các đối tượng ghi âm
let mediaRecorder = null;
let audioChunks = [];
const toggleRecording = () => {
    if (isRecording.value) {
        stopRecording();
    } else {
        startRecording();
    }
};

// Bắt đầu quá trình ghi âm
const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        isRecording.value = true;
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });
        mediaRecorder.addEventListener('stop', processAudioAfterRecording);
    } catch (error) {
        console.error("Lỗi khi yêu cầu quyền truy cập micro:", error);
        alert("Không thể truy cập micro. Vui lòng cấp quyền trong cài đặt trình duyệt.");
    }
};

// Dừng quá trình ghi âm
const stopRecording = () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        isRecording.value = false;
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
};

// Xử lý audio sau khi đã dừng ghi
const processAudioAfterRecording = async () => {
    showTranscriptionModal.value = true;
    isTranscribing.value = true;
    transcribedText.value = '';

    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const wavBlob = await convertBlobToWav(audioBlob);
    await sendAudioToBackend(wavBlob);
};

// THAY ĐỔI 2: Cập nhật hàm này để dùng hàm encodeWav cục bộ
const convertBlobToWav = async (audioBlob) => {
    try {
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Gọi thẳng hàm mã hóa của chúng ta
        const wavBlob = encodeWav(audioBuffer);
        return wavBlob;

    } catch (error) {
        console.error("Lỗi khi chuyển đổi sang WAV:", error);
        alert("Không thể chuyển đổi file ghi âm sang định dạng WAV. Vui lòng thử lại.");
        throw error;
    }
};


// Hàm gửi file audio đến API backend (giữ nguyên)
const sendAudioToBackend = async (wavBlob) => {
    if (!wavBlob) return;

    const formData = new FormData();
    formData.append('file', wavBlob, 'recording.wav');

    try {
        const response = await axios.post('https://docsbrain.id.vn/transcribe/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        transcribedText.value = response.data.transcription;
    } catch (error) {
        console.error("Lỗi khi gửi file audio:", error);
        transcribedText.value = "Đã xảy ra lỗi khi phiên âm. Vui lòng thử lại.";
    } finally {
        isTranscribing.value = false;
    }
};

// Hàm chèn văn bản từ popup vào trình soạn thảo (giữ nguyên)
const applyTranscription = () => {
    editor.value.focus(); 

    // Kiểm tra xem chúng ta đã lưu vị trí con trỏ trước đó chưa
    if (savedRange) {
        // Khôi phục lại vùng chọn đã lưu
        const selection = window.getSelection();
        selection.removeAllRanges(); // Xóa mọi vùng chọn hiện tại (nếu có)
        selection.addRange(savedRange); // Thêm lại vùng chọn đã lưu
    }
    if (transcribedText.value) {
        insertTextAtCursor(transcribedText.value);
        saveContent();
    }
    showTranscriptionModal.value = false;
};

const saveOrUpdateDocument = async () => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    
    if (!editor.value) return;

    // Lấy documentId từ localStorage nếu có
    const currentDocId = documentId.value || localStorage.getItem('current_document_id');
    const isNew = !currentDocId; // Xác định có phải tạo mới không
    // Tạo file từ nội dung editor
    const content = editor.value.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const file = new File([blob], `${fileName.value}.html`, { type: 'text/html' });

    const formData = new FormData();
    formData.append('title', fileName.value);
    formData.append('user_id', userId);
    formData.append('file', file);
    
    // Sử dụng currentDocId thay vì documentId.value
    if (!isNew && currentDocId) {
      formData.append('document_id', currentDocId);
    }

    const response = await axios.post('https://docsbrain.id.vn/documents/save', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
if (response.status === 200) {
      showSaveSuccessMessage.value = true;
      setTimeout(() => {
        showSaveSuccessMessage.value = false;
      }, 2000); // Ẩn thông báo sau 2 giây
    }
    // Sau khi lưu thành công
    if (isNew) {
      documentId.value = response.data.id;
      localStorage.setItem('current_document_id', response.data.id); // Lưu ID vào localStorage
    }

    updateLastSaved();
  } catch (error) {
    console.error('Lỗi khi lưu:', error.response?.data || error);
  }
};

const updateCaretPosition = () => {
    if (!editor.value) return;

    // LƯU LẠI VỊ TRÍ CON TRỎ (PHẦN QUAN TRỌNG)
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        // Chỉ lưu lại vị trí nếu nó thực sự nằm bên trong editor
        if (editor.value.contains(selection.anchorNode)) {
            savedRange = selection.getRangeAt(0);
        }
    }

    // --- Phần code cũ của bạn để tính dòng/cột có thể giữ nguyên ở dưới ---
    const range = selection.getRangeAt(0);
    if (!editor.value.contains(range.commonAncestorContainer)) return;

    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editor.value);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const text = preCaretRange.toString();

    const lines = text.split('\n');
    currentLine.value = lines.length;
    currentColumn.value = lines[lines.length - 1].length + 1;
};
const speakText = async () => {
  if (!editor.value) {
    console.error("Lỗi: Không tìm thấy editor ref.");
    return;
  }
  
  const textToSpeak = editor.value.innerText.trim();
  if (!textToSpeak) {
    alert('Không có văn bản để phát âm thanh.');
    return;
  }

  console.log("--- BẮT ĐẦU QUÁ TRÌNH PHÁT ÂM THANH ---");
  console.log("Văn bản cần phát:", textToSpeak);

  if (isSpeaking.value && audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
    isSpeaking.value = false;
    console.log("Đã dừng âm thanh đang phát.");
    return;
  }

  isSpeaking.value = true;
  speechError.value = '';

  try {
    const formData = new FormData();
    formData.append('text', textToSpeak);
    formData.append('lang', 'vi');

    console.log("Đang gửi yêu cầu đến API /text-to-speech...");
    // Đảm bảo bạn dùng axios và cấu hình responseType: 'blob'
    const response = await axios.post('https://docsbrain.id.vn/text-to-speech', formData, {
      responseType: 'blob' // CỰC KỲ QUAN TRỌNG!
    });
    console.log("Đã nhận được phản hồi từ API. Status:", response.status);

    if (response.status === 200 && response.data) {
      const audioBlob = response.data;
      console.log("Dữ liệu nhận được là một blob:", audioBlob);
      console.log(`Kích thước Blob: ${audioBlob.size} bytes, Loại: ${audioBlob.type}`);

      if (audioBlob.size === 0) {
          throw new Error("API đã trả về một file âm thanh rỗng.");
      }

      const audioURL = URL.createObjectURL(audioBlob);
      console.log("Đã tạo URL cho audio blob:", audioURL);
      
      console.log("Đối tượng audio player:", audioPlayer.value);
      if (audioPlayer.value) {
        audioPlayer.value.src = audioURL;
        console.log("Đang gọi audioPlayer.play()...");
        
        const playPromise = audioPlayer.value.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            console.log("✅ Âm thanh đã bắt đầu phát thành công!");
          }).catch(error => {
            console.error("❌ Lỗi khi gọi .play():", error);
            alert("Lỗi khi phát âm thanh. Có thể trình duyệt đã chặn tự động phát. Vui lòng click vào trang và thử lại.");
            isSpeaking.value = false; // Reset trạng thái khi có lỗi play
          });
        }
      } else {
        throw new Error("Không tìm thấy thẻ <audio> để phát.");
      }
    } else {
      throw new Error(`Server trả về status code không hợp lệ: ${response.status}`);
    }

  } catch (error) {
    speechError.value = `Lỗi: ${error.message}`;
    console.error('❌ ĐÃ XẢY RA LỖI TRONG HÀM speakText:', error);
    alert('Không thể tạo hoặc phát file âm thanh. Vui lòng kiểm tra Console (F12) để xem chi tiết lỗi.');
    isSpeaking.value = false;
  }
  // Không đặt `isSpeaking.value = false` ở đây, nó sẽ được xử lý bởi sự kiện @ended hoặc trong khối catch
};

// Hàm load document history
const loadDocumentHistory = async () => {
  if (!documentId.value) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`https://docsbrain.id.vn/documents/${documentId.value}/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    documentHistory.value = response.data;
    showHistoryModal.value = true;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử:', error);
    alert('Không thể tải lịch sử tài liệu');
  }
};

// Hàm restore từ history
const restoreFromHistory = async (historyId) => {
  try {
    const token = localStorage.getItem('token');
    
    // Lấy nội dung từ history
    const response = await axios.get(
      `https://docsbrain.id.vn/documents/history/content/${historyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Hiển thị nội dung lên editor
    if (editor.value && response.data.content) {
      editor.value.innerHTML = response.data.content;
      
      // Cập nhật thời gian lưu cuối
      lastSaved.value = new Date().toLocaleString();
      
      showHistoryModal.value = false;
    }
    
  } catch (error) {
    console.error('Lỗi khi khôi phục:', error);
    alert(error.response?.data?.detail || 'Lỗi khi tải bản lịch sử');
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
const openHistoryModal = () => {
  if (documentId.value) {
    loadDocumentHistory();
  } else {
    alert('Vui lòng lưu tài liệu trước khi xem lịch sử');
  }
};
const openSummaryModal = () => {
  showSummaryModal.value = true;
  summaryResult.value = '';
};

const closeSummaryModal = () => {
  showSummaryModal.value = false;
};

const summarizeText = async () => {
  const editor = document.querySelector('[contenteditable]');
  const article = editor?.innerText || '';
  if (!article.trim()) {
    summaryResult.value = 'Không có nội dung để tóm tắt.';
    return;
  }

  isSummarizing.value = true;
  try {
    const response = await fetch('https://docsbrain.id.vn/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article: article,
      }),
    });

    const result = await response.json();
    summaryResult.value = result.summary || 'Không thể tóm tắt nội dung.';
  } catch (err) {
    summaryResult.value = 'Lỗi khi gọi API.';
    console.error(err);
  } finally {
    isSummarizing.value = false;
  }
};
const fetchSuggestion = async (prompt) => {

 

  try {

    const response = await fetch('https://docsbrain.id.vn/generate', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        prompt: prompt,

        min_new_tokens: 5,  

        max_new_tokens: 50,

      }),

    });



    if (!response.ok) {

      throw new Error('Lỗi từ API');

    }



    const data = await response.json();

    return data.generated_text; // Trả về phần văn bản được sinh ra

  } catch (error) {

    console.error("Lỗi khi gọi API gợi ý:", error);

    return ''; // Trả về chuỗi rỗng nếu có lỗi

  }

};

const insertTextAtCursor = (text) => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return

  const range = selection.getRangeAt(0)
  const textNode = document.createTextNode(text)
  range.insertNode(textNode)

  // Move cursor after inserted text
  range.setStartAfter(textNode)
  range.setEndAfter(textNode)
  selection.removeAllRanges()
  selection.addRange(range)
}


const handleEditorKeydown = async (e) => {
  const keysThatMightAffectGhost = ['Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  if (ghostWord.value && e.key !== 'Tab' && !e.ctrlKey) {
    if (!keysThatMightAffectGhost.includes(e.key) && e.key.length === 1) { // Gõ ký tự thường
      ghostWord.value = '';
    } else if (keysThatMightAffectGhost.includes(e.key)) { // Nhấn các phím điều hướng/xóa
      ghostWord.value = '';
    }
  }
  // 1. Xóa ghostWord khi Backspace
  if (e.key === 'Backspace') {
    ghostWord.value = ''
    return
  }

  // 2. Khi suggestion đang mở
  if (showSuggestions.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % suggestions.value.length
      ghostWord.value = suggestions.value[selectedIndex.value]?.word || ''
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex.value =
        (selectedIndex.value - 1 + suggestions.value.length) % suggestions.value.length
      ghostWord.value = suggestions.value[selectedIndex.value]?.word || ''
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const selected = suggestions.value[selectedIndex.value]
      if (selected) {
        insertTextAtCursor(selected.word + ' ')
        ghostWord.value = ''
        suggestions.value = []
        showSuggestions.value = false
      }
      return
    }
  }

  // 3. Gợi ý khi nhấn Ctrl + Space (dựa trên toàn bộ văn bản)
  if (e.ctrlKey && e.code === 'Space') {
    e.preventDefault();
    if (isGenerating.value) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0 && pageRef.value && editor.value) {
        // --- BẮT ĐẦU: LOGIC LẤY PROMPT ĐÃ CẬP NHẬT ---

        const cursorRange = selection.getRangeAt(0);
        const rangeBeforeCursor = document.createRange();
        rangeBeforeCursor.selectNodeContents(editor.value);
        rangeBeforeCursor.setEnd(cursorRange.startContainer, cursorRange.startOffset);
        const textBeforeCursor = rangeBeforeCursor.toString();

        let currentPrompt = '';
        const DẤU_KẾT_THÚC_CÂU = ['.', '?', '!'];
        
        // Lấy văn bản trước con trỏ và xóa các khoảng trắng ở cuối
        const trimmedText = textBeforeCursor.trimEnd();

        // KIỂM TRA: Con trỏ có đang ở cuối một câu không?
        if (DẤU_KẾT_THÚC_CÂU.some(char => trimmedText.endsWith(char))) {
            // TRƯỜNG HỢP 1: Con trỏ ở cuối câu. Ta sẽ lấy cả câu đó làm prompt.
            
            // Tạm thời bỏ đi dấu câu cuối cùng để tìm dấu câu đứng trước nó
            const textWithoutFinalPunctuation = trimmedText.slice(0, -1);

            // Tìm vị trí dấu kết thúc câu của câu "trước nữa"
            const lastDot = textWithoutFinalPunctuation.lastIndexOf('.');
            const lastQuestion = textWithoutFinalPunctuation.lastIndexOf('?');
            const lastExclamation = textWithoutFinalPunctuation.lastIndexOf('!');
            const previousSentenceEndIndex = Math.max(lastDot, lastQuestion, lastExclamation);

            // Prompt chính là phần văn bản từ sau câu "trước nữa"
            currentPrompt = textWithoutFinalPunctuation.substring(previousSentenceEndIndex + 1).trimStart();

        } else {
            // TRƯỜNG HỢP 2: Con trỏ đang ở giữa câu (logic cũ)
            const lastDot = textBeforeCursor.lastIndexOf('.');
            const lastQuestion = textBeforeCursor.lastIndexOf('?');
            const lastExclamation = textBeforeCursor.lastIndexOf('!');
            const lastPunctuationIndex = Math.max(lastDot, lastQuestion, lastExclamation);

            currentPrompt = textBeforeCursor.substring(lastPunctuationIndex + 1).trimStart();
        }

        if (!currentPrompt) return;

        // --- KẾT THÚC: LOGIC LẤY PROMPT ĐÃ CẬP NHẬT ---


        // --- PHẦN BÊN DƯỚI GIỮ NGUYÊN ---

        // --- BẮT ĐẦU PHƯƠNG PHÁP MARKER SPAN CHO TỌA ĐỘ (Giữ nguyên) ---
        let range = cursorRange.cloneRange(); 
        range.collapse(true);

        const tempSpan = document.createElement('span');
        tempSpan.innerHTML = '&#8203;';
        
        let tempRangeForInsert = range.cloneRange();
        tempRangeForInsert.insertNode(tempSpan);

        const calculatedTop = tempSpan.offsetTop;
        const calculatedLeftForTextIndent = tempSpan.offsetLeft;
        
        tempSpan.parentNode.removeChild(tempSpan);
        // --- KẾT THÚC PHƯƠNG PHÁP MARKER SPAN ---

        // Lấy style từ phần tử chứa con trỏ (Giữ nguyên)
        let styledElement = range.startContainer;
        if (styledElement.nodeType === Node.TEXT_NODE) {
            styledElement = styledElement.parentElement;
        }
        if (!(styledElement instanceof HTMLElement)) {
            styledElement = editor.value;
        }
        const computedStyle = window.getComputedStyle(styledElement);
        
        const calculatedMaxWidth = pageRef.value.clientWidth - 10;

        ghostPosition.value = {
            top: `${calculatedTop}px`,
            left: `0px`,
            maxWidth: `${calculatedMaxWidth > 0 ? calculatedMaxWidth : 0}px`,
        };

        ghostStyle.value = {
            fontFamily: computedStyle.fontFamily,
            fontSize: computedStyle.fontSize,
            lineHeight: computedStyle.lineHeight,
            fontWeight: computedStyle.fontWeight,
            fontStyle: computedStyle.fontStyle,
            textIndent: `${calculatedLeftForTextIndent}px`,
        };
        
        const suggestion = await fetchSuggestion(currentPrompt);
        if (suggestion) {
            ghostWord.value = suggestion;
        }
    }
    return;
}

  // 4. Gợi ý khi nhấn phím cách (ẩn dropdown)
  if (e.key === ' ') {
    const content = getEditorContent(); // bạn phải có hàm này để lấy nội dung editor
    const response = await sendContentToBackend(content); // ✅ gọi đúng cú pháp
    return;
  }

  // 5. Nhấn Tab để chèn ghostWord
  if (e.key === 'Tab') {
    if (ghostWord.value) {
      e.preventDefault()
      insertTextAtCursor(ghostWord.value + ' ')
      ghostWord.value = ''
      suggestions.value = []
      showSuggestions.value = false
    }
  }
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    await saveOrUpdateDocument();
  }
}


const selectSuggestion = (word) => {
  insertTextAtCursor(word + ' ')
  ghostWord.value = ''
  showSuggestions.value = false
}
const handleClickOutside = (event) => {
  const suggestionEl = document.querySelector('.suggestion-box')

  if (suggestionEl && !suggestionEl.contains(event.target)) {
    showSuggestions.value = false
    ghostWord.value = ''
  }
}

// Statistics calculations
const wordCount = computed(() => {
  if (!editor.value) return 0
  const text = editor.value.innerText || ''
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
})

const characterCount = computed(() => {
  if (!editor.value) return 0
  return editor.value.innerText.length
})

const pageCount = computed(() => {
  // Estimate pages based on character count (approx. 2000 chars/page)
  return Math.ceil(characterCount.value / 2000) || 1
})

// Update selection state to reflect current formatting
const updateSelectionState = () => {
  if (!editor.value) return

  // Update cursor position
  updateCursorPosition()

  // Get current selection
  const selection = window.getSelection()
  if (!selection.rangeCount) return

  // Check if selection is within editor
  const range = selection.getRangeAt(0)
  if (!editor.value.contains(range.commonAncestorContainer)) return

  // Check formatting
  document.queryCommandState ? updateFormattingState() : setTimeout(updateFormattingState, 0)
}

const updateFormattingState = () => {
  isBold.value = document.queryCommandState('bold')
  isItalic.value = document.queryCommandState('italic')
  isUnderline.value = document.queryCommandState('underline')
  isStrikethrough.value = document.queryCommandState('strikethrough')
  textAlign.value =
    document.queryCommandState('justifyCenter') ? 'center' :
      document.queryCommandState('justifyRight') ? 'right' :
        document.queryCommandState('justifyFull') ? 'justify' : 'left'
  isBulletList.value = document.queryCommandState('insertUnorderedList')
  isNumberedList.value = document.queryCommandState('insertOrderedList')

  // Get color values (more complex)
  const color = document.queryCommandValue('foreColor')
  if (color) {
    // Convert RGB format to hex
    if (color.startsWith('rgb')) {
      const rgb = color.match(/\d+/g)
      if (rgb && rgb.length === 3) {
        textColor.value = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))
      }
    } else {
      textColor.value = color
    }
  }

  // Get background color
  const bgColor = document.queryCommandValue('hiliteColor')
  if (bgColor && bgColor !== 'transparent') {
    if (bgColor.startsWith('rgb')) {
      const rgb = bgColor.match(/\d+/g)
      if (rgb && rgb.length === 3) {
        highlightColor.value = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))
      }
    } else {
      highlightColor.value = bgColor
    }
  }

  // Get font family
  const fontFamily = document.queryCommandValue('fontName')
  if (fontFamily) {
    // Font name may come with quotes
    selectedFont.value = fontFamily.replace(/["']/g, '')
  }

  // Getting font size is more complex and often browser-dependent
  // Simplistic approach:
  const size = document.queryCommandValue('fontSize')
  if (size) {
    // Size might be a number 1-7 in some browsers
    if (size >= 1 && size <= 7) {
      // Convert HTML size to pt
      const ptSizes = [8, 10, 12, 14, 18, 24, 36]
      fontSize.value = ptSizes[size - 1]
    } else {
      // If already in pt or px
      const match = size.match(/\d+/)
      if (match) {
        fontSize.value = parseInt(match[0])
      }
    }
  }
}

// Helper function to convert RGB to hex
const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}

// Update cursor position
const updateCursorPosition = () => {
  if (!editor.value) return

  const selection = window.getSelection()
  if (!selection.rangeCount) return

  const range = selection.getRangeAt(0)
  if (!editor.value.contains(range.commonAncestorContainer)) return

  // Get text up to cursor
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(editor.value)
  preCaretRange.setEnd(range.endContainer, range.endOffset)
  const text = preCaretRange.toString()

  // Calculate line and column
  const lines = text.split('\n')
  currentLine.value = lines.length
  currentColumn.value = lines[lines.length - 1].length + 1
}

// Format functions that operate on selected text only
const applyBold = () => {
  document.execCommand('bold', false)
  saveContent()
  updateSelectionState()
}

const applyItalic = () => {
  document.execCommand('italic', false)
  saveContent()
  updateSelectionState()
}

const applyUnderline = () => {
  document.execCommand('underline', false)
  saveContent()
  updateSelectionState()
}

const applyStrikethrough = () => {
  document.execCommand('strikethrough', false)
  saveContent()
  updateSelectionState()
}

const applyFont = (fontFamily) => {
  document.execCommand('fontName', false, fontFamily)
  selectedFont.value = fontFamily
  saveContent()
}

const applyFontSize = (size) => {
  // Convert pt size to HTML size (1-7)
  const htmlSize =
    size <= 9 ? 1 :
      size <= 10 ? 2 :
        size <= 12 ? 3 :
          size <= 14 ? 4 :
            size <= 18 ? 5 :
              size <= 24 ? 6 : 7

  // Use pt size directly using styleWithCSS
  document.execCommand('styleWithCSS', false, true)
  document.execCommand('fontSize', false, htmlSize)

  // Find all font elements and set proper pt size
  const selection = window.getSelection()
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0)
    if (editor.value.contains(range.commonAncestorContainer)) {
      // Select all new font elements with the HTML size
      const fontElements = editor.value.querySelectorAll(`font[size="${htmlSize}"]`)
      for (const el of fontElements) {
        el.style.fontSize = `${size}pt`
      }
    }
  }

  fontSize.value = size
  document.execCommand('styleWithCSS', false, false)
  saveContent()
}

const applyTextColor = () => {
  document.execCommand('styleWithCSS', false, true)
  document.execCommand('foreColor', false, textColor.value)
  document.execCommand('styleWithCSS', false, false)
  saveContent()
}

const applyHighlightColor = () => {
  document.execCommand('styleWithCSS', false, true)
  document.execCommand('hiliteColor', false, highlightColor.value)
  document.execCommand('styleWithCSS', false, false)
  saveContent()
}

const applyAlignment = (align) => {
  const command = 'justify' + align.charAt(0).toUpperCase() + align.slice(1)
  document.execCommand(command, false)
  textAlign.value = align
  saveContent()
}

const applyBulletList = () => {
  document.execCommand('insertUnorderedList', false)
  isBulletList.value = !isBulletList.value
  if (isBulletList.value) isNumberedList.value = false
  saveContent()
  updateSelectionState()
}

const applyNumberedList = () => {
  document.execCommand('insertOrderedList', false)
  isNumberedList.value = !isNumberedList.value
  if (isNumberedList.value) isBulletList.value = false
  saveContent()
  updateSelectionState()
}

const increaseIndent = () => {
  document.execCommand('indent', false)
  saveContent()
}

const decreaseIndent = () => {
  document.execCommand('outdent', false)
  saveContent()
}

const clearFormatting = () => {
  document.execCommand('removeFormat', false)
  updateSelectionState()
  saveContent()
}

// Handle input to track history
const handleInput = () => {
  if (!editor.value) return

  // If not at the end of history, remove changes ahead
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }

  // Add to history
  history.value.push(editor.value.innerHTML)
  historyIndex.value = history.value.length - 1

  saveContent()
  updateSelectionState()
}

// File handling
const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}

const importFile = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    fileName.value = file.name.replace(/\.[^/.]+$/, ""); // Cập nhật tên file

    // Xử lý file DOCX
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        if (editor.value) {
          editor.value.innerHTML = result.value; // Dùng innerHTML để giữ lại định dạng
          saveContent();
        }
      };
      reader.readAsArrayBuffer(file);
    } 
    // Xử lý file TEXT thuần túy
    else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (editor.value) {
          // Với file text, ta dùng innerText để tránh lỗi HTML injection
          editor.value.innerText = e.target.result;
          saveContent();
        }
      };
      reader.readAsText(file);
    }
    
    updateLastSaved();
  } catch (error) {
    console.error('Lỗi khi mở file:', error);
    alert('Không thể mở file này. Vui lòng thử lại.');
  }
};
// New document
const newDocument = () => {
  if (editor.value && editor.value.innerHTML && !confirm('Bạn có muốn tạo tài liệu mới không? Mọi thay đổi chưa lưu sẽ bị mất.')) {
    return
  }

  if (editor.value) {
    editor.value.innerHTML = ''
    fileName.value = 'Tài liệu không tên'
    history.value = ['']
    historyIndex.value = 0
    updateLastSaved()
  }
}

// Save document
const saveDocument = async (format = 'html') => {
  if (!editor.value) return;

  try {
    const content = editor.value.innerHTML;
    const textContent = editor.value.innerText;

    if (format === 'docx') {
      // Tạo document Word
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: textContent,
                  bold: isBold.value,
                  italics: isItalic.value,
                  size: fontSize.value * 2, // docx uses half-points
                }),
              ],
            }),
          ],
        }],
      });

      // Tạo Blob và download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.value}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } else if (format === 'pdf') {
      const element = editor.value;
      const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // Lề trên, trái, dưới, phải (inch)
        filename:     `${fileName.value}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Gọi hàm để tạo và tự động tải file PDF
      html2pdf().from(element).set(opt).save();
      updateLastSaved();
    } else {
      // Lưu HTML (như cũ)
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${fileName.value}</title>
          <style>
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.value}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    updateLastSaved();
  } catch (error) {
    console.error('Error saving document:', error);
    alert('Có lỗi xảy ra khi lưu tài liệu. Vui lòng thử lại.');
  }
};

const showSaveDialog = () => {
  // Hiển thị dialog cho người dùng chọn định dạng
  const format = prompt('Chọn định dạng lưu (html, docx, pdf):', 'docx');
  if (format && ['html', 'docx', 'pdf'].includes(format.toLowerCase())) {
    saveDocument(format.toLowerCase());
  }
};

// Print document
const printDocument = () => {
  if (!editor.value) return

  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${fileName.value}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20mm; }
      </style>
    </head>
    <body>
      ${editor.value.innerHTML}
    </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}

// Undo/Redo
const undoAction = () => {
  if (canUndo.value && editor.value) {
    historyIndex.value--
    editor.value.innerHTML = history.value[historyIndex.value]
    updateSelectionState()
  }
}

const redoAction = () => {
  if (canRedo.value && editor.value) {
    historyIndex.value++
    editor.value.innerHTML = history.value[historyIndex.value]
    updateSelectionState()
  }
}

// Copy/Cut/Paste
const copyText = () => {
  document.execCommand('copy')
}

const cutText = () => {
  document.execCommand('cut')
  saveContent()
}

const pasteText = () => {
  document.execCommand('paste')
  saveContent()
}

// Fullscreen
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// Share
const shareDocument = () => {
  if (!editor.value) return

  // This is a simplified example - in a real app, you'd use a backend service
  const encodedContent = btoa(editor.value.innerHTML) // Base64 encode
  shareableLink.value = `${window.location.origin}${window.location.pathname}?doc=${encodeURIComponent(fileName.value)}&content=${encodedContent}`
  showShareDialog.value = true
}

const copyShareLink = () => {
  navigator.clipboard.writeText(shareableLink.value)
  alert('Đã sao chép đường dẫn chia sẻ!')
}

// Save data to localStorage
const saveContent = () => {
  if (editor.value) {
    localStorage.setItem('documentContent', editor.value.innerHTML)
    updateLastSaved()
  }
}

const saveFileName = () => {
  localStorage.setItem('documentFileName', fileName.value)

}

const updateLastSaved = () => {
  const now = new Date()
  lastSaved.value = `Đã lưu ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
}
const loadDocumentContent = () => {
  try {
    // Lấy nội dung từ localStorage
    const documentContent = localStorage.getItem('current_document_content');
    const documentTitle = localStorage.getItem('current_document_title'); // Thêm dòng này
    
    // Xử lý tiêu đề (nếu có)
    if (documentTitle) {
      // Giả sử có một phần tử HTML để hiển thị tiêu đề (vd: <h1 id="document-title"></h1>)
      const titleElement = document.getElementById('document-title');
      if (titleElement) {
        titleElement.textContent = documentTitle;
      }
    }

    // Xử lý nội dung (giữ nguyên phần cũ)
    if (documentContent) {
      let content;
      
      try {
        content = JSON.parse(documentContent);
        if (Array.isArray(content)) {
          content = content.join('<br><br>');
        }
      } catch (e) {
        console.error('Lỗi khi parse JSON:', e);
        content = documentContent;
      }
      
      if (editor.value) {
        editor.value.innerHTML = content;
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải nội dung từ localStorage:', error);
  }
};
window.addEventListener('popstate', function(event) {
    // Xóa documentContent khỏi localStorage
    localStorage.removeItem('documentContent');
    console.log('Đã xóa documentContent khi quay lại trang trước');
});
const route = useRoute();
// Restore data from localStorage when loading the page
onMounted(() => {
    const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  loadDocumentContent();
  const savedDocId = localStorage.getItem('current_document_id');
  if (savedDocId) {
    documentId.value = savedDocId;
    isNewDocument.value = false;
  }
  // Enable rich text editing
  document.execCommand('styleWithCSS', false, true)
  document.addEventListener('click', handleClickOutside)

  const savedContent = localStorage.getItem('documentContent')
  const savedFileName = localStorage.getItem('documentFileName')

  if (savedContent && editor.value) editor.value.innerHTML = savedContent
  if (savedFileName) fileName.value = savedFileName

  // Initialize history
  if (editor.value) {
    history.value = [editor.value.innerHTML || '']
    historyIndex.value = 0
  }

  // Update save time
  updateLastSaved()

  // Add event listener for fullscreen
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })

  // Focus on editor when mounted
  if (editor.value) {
    editor.value.focus()
  }
})


</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500&display=swap');
</style>
