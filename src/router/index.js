import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/Login.vue'
import HomePage from '../pages/Home.vue'
import EditorPage from '../pages/EditorPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import AdminDashboard from '../components/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/home', component: HomePage },
  { path: '/editor/:id', component: EditorPage },
  
  // Route cho admin dashboard
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { 
      requiresAuth: true, 
      requiredRole: 'admin' // Chỉ role admin mới được truy cập
    }
  },
  
  // Route catch all (404) - nên đặt cuối cùng
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')
  
  // Kiểm tra route có yêu cầu auth không
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Chưa đăng nhập -> về login
      next('/login')
    } else if (to.meta.requiredRole && userRole !== to.meta.requiredRole) {
      // Đã login nhưng không có quyền -> về login
      // Có thể clear token ở đây nếu muốn
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      next('/login')
    } else {
      // Có quyền truy cập
      next()
    }
  } else {
    // Route không yêu cầu auth
    next()
  }
})

export default router