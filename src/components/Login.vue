<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="logo-icon">
            <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.176 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.546 3.75 3.75 0 013.255 3.718z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1>Chào mừng trở lại</h1>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="input-icon">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="input-icon">
              <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
            </svg>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <div v-if="errorMessage" class="error-message">
 {{ errorMessage }}
</div>
        <button type="submit" class="login-button">
          <span>Đăng nhập</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="button-icon">
            <path fill-rule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </form>

      <div class="divider">
        <span class="divider-line"></span>
        <span class="divider-text">hoặc</span>
        <span class="divider-line"></span>
      </div>


      <div class="register-link">
        Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const email = ref('');
const password = ref('');
const router = useRouter();
const errorMessage = ref('');
watch([email, password], () => {
 errorMessage.value = '';
});
const login = async () => {
  try {
    errorMessage.value = '';
    const params = new URLSearchParams();
    params.append('username', email.value);
    params.append('password', password.value);

    const response = await api.post('/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
if (response.data.status === 'inactive') {
      // Đặt thông báo lỗi
 errorMessage.value = 'Tài khoản của bạn đã không còn hoạt động.';
   
return; // Dừng hàm tại đây, không chuyển trang
 }
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user_id', response.data.user_id);
    localStorage.setItem('role', response.data.role);
    
    if (response.data.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/home');
    }
  } catch (error) {
    errorMessage.value = 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.';
  }
};
</script>

<style scoped>
/* Base styles */
.error-message {
 color: #c53030; /* Màu chữ đỏ sậm */
 background-color: #fed7d7; /* Màu nền đỏ nhạt */
 border: 1px solid #c53030; /* Viền đỏ */
 border-radius: 8px; /* Bo góc */
 padding: 12px 15px;
 margin-bottom: 20px; /* Khoảng cách với nút đăng nhập */
 font-size: 14px;
 text-align: center;
 font-weight: 500;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Container */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--background);
  background-image: 
    radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.1) 0px, transparent 50%);
}

/* Card */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.login-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: var(--primary);
}

.logo-icon {
  width: 28px;
  height: 28px;
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--text-light);
  font-size: 0.875rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}

.label-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  font-size: 0.75rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.forgot-password:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1rem;
  height: 1rem;
  color: var(--text-light);
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 1px solid var(--gray-dark);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  color: var(--text);
  transition: var(--transition);
  background-color: var(--white);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

/* Login Button */
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 0.5rem;
}

.login-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.button-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: var(--text-light);
  font-size: 0.75rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: var(--gray);
}

/* Social Login */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--gray);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  background-color: var(--white);
}

.social-button:hover {
  background-color: var(--gray);
}

.social-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.social-button.google {
  color: #db4437;
}

.social-button.facebook {
  color: #1877f2;
}

/* Register Link */
.register-link {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-light);
}

.register-link a {
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
}

.register-link a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .login-header h1 {
    font-size: 1.25rem;
  }
}
</style>
<style>:root {
  --primary: #4361ee;
  --primary-dark: #3a56d4;
  --secondary: #3f37c9;
  --text: #2b2d42;
  --text-light: #8d99ae;
  --background: #f8f9fa;
  --white: #ffffff;
  --gray: #e9ecef;
  --gray-dark: #ced4da;
  --danger: #ef233c;
  --success: #4cc9f0;
  --border-radius: 12px;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}</style>