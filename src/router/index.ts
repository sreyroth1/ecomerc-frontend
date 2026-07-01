import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/common/AppLayout.vue'
import AdminLayout from '@/components/common/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ========== Public ==========
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue'),
        },
        {
          path: 'products/:id',
          name: 'product-detail',
          component: () => import('@/views/ProductDetail.vue'),
        },
      ],
    },

    // ========== Guest ==========
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/Register.vue'),
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPassword.vue'),
      meta: { guest: true },
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPassword.vue'),
      meta: { guest: true },
    },

    // ========== Authenticated ==========
    {
      path: '/',
      component: AppLayout,
      meta: { auth: true },
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/customer/Profile.vue'),
        },
        {
          path: 'verify-email',
          name: 'verify-email',
          component: () => import('@/views/auth/VerifyEmail.vue'),
        },
        {
          path: 'confirm-password',
          name: 'confirm-password',
          component: () => import('@/views/auth/ConfirmPassword.vue'),
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/customer/Cart.vue'),
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('@/views/customer/Checkout.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/customer/Orders.vue'),
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: () => import('@/views/customer/OrderDetail.vue'),
        },
        {
          path: 'wishlist',
          name: 'wishlist',
          component: () => import('@/views/customer/Wishlist.vue'),
        },
      ],
    },

    // ========== Admin ==========
    {
      path: '/admin',
      component: AdminLayout,
      meta: { auth: true, admin: true },
      children: [
        {
          path: '',
          redirect: { name: 'admin-dashboard' },
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/Products.vue'),
        },
        {
          path: 'products/create',
          name: 'admin-products-create',
          component: () => import('@/views/admin/ProductForm.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'admin-products-edit',
          component: () => import('@/views/admin/ProductForm.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/admin/Categories.vue'),
        },
        {
          path: 'categories/create',
          name: 'admin-categories-create',
          component: () => import('@/views/admin/CategoryForm.vue'),
        },
        {
          path: 'categories/:id/edit',
          name: 'admin-categories-edit',
          component: () => import('@/views/admin/CategoryForm.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/Orders.vue'),
        },
        {
          path: 'orders/:id',
          name: 'admin-orders-detail',
          component: () => import('@/views/admin/OrderDetail.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/Users.vue'),
        },
        {
          path: 'users/:id',
          name: 'admin-users-detail',
          component: () => import('@/views/admin/UserDetail.vue'),
        },
      ],
    },
  ],
})

// Navigation guards
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  // Auth required but not logged in
  if (to.meta.auth && !auth.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Guest only but logged in
  if (to.meta.guest && auth.isAuthenticated) {
    return next({ name: 'home' })
  }

  // Admin required but not admin
  if (to.meta.admin && !auth.isAdmin) {
    return next({ name: 'home' })
  }

  next()
})

export default router
