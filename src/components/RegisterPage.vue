<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="logo-icon">
            <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.176 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.546 3.75 3.75 0 013.255 3.718z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1>Tạo tài khoản mới</h1>
      </div>

      <form @submit.prevent="register" class="register-form">
        <div class="form-group">
          <label for="name">Họ và tên</label>
          <div class="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="input-icon">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
            </svg>
            <input
              type="text"
              id="name"
              v-model="name"
              placeholder="Nguyễn Văn A"
              required
              autocomplete="name"
            />
          </div>
        </div>

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
              autocomplete="email"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
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
              autocomplete="new-password"
            />
          </div>
          <div class="password-hint">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="hint-icon">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
            </svg>
            <span>Mật khẩu phải có ít nhất 8 ký tự</span>
          </div>
        </div>

        <button type="submit" class="register-button">
          <span>Tạo tài khoản</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="button-icon">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clip-rule="evenodd" />
          </svg>
        </button>
      </form>

      <div class="divider">
        <span class="divider-line"></span>
        <span class="divider-text">hoặc</span>
        <span class="divider-line"></span>
      </div>

      <div class="login-link">
        Đã có tài khoản? <router-link to="/login">Đăng nhập ngay</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    const response = await api.post('https://docsbrain.id.vn/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    router.push('/login')
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
/* Base styles */


/* Container */
.register-container {
  min-height: 80vh;
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
.register-card {
  width: 90%;
  max-width: 440px;
  padding: 1.2rem;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.register-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* Header */
.register-header {
  text-align: center;
  margin-bottom: 0.25rem;
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

.register-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.register-header p {
  color: var(--text-light);
  font-size: 0.875rem;
}

/* Form */
.register-form {
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

/* Password hint */
.password-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 0.25rem;
}

.hint-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--text-light);
}

/* Register Button */
.register-button {
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

.register-button:hover {
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
  margin: 1rem 0;
  color: var(--text-light);
  font-size: 0.75rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: var(--gray);
}

/* Social Register */
.social-register {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
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

/* Login Link */
.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-light);
}

.login-link a {
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
}

.login-link a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }
  
  .register-header h1 {
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