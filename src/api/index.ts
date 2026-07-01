import axios from 'axios'
import type {
  LoginResponse,
  RegisterResponse,
  User,
  Category,
  Product,
  CartItem,
  Order,
  Review,
  WishlistItem,
  AdminDashboard,
  PaginatedResponse,
  MessageResponse,
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
  },
})

// Attach auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401 (only when user was already authenticated)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

// ==================== Auth ====================

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/login', { email, password }).then((r) => r.data),

  register: (name: string, email: string, password: string, passwordConfirmation: string) =>
    api
      .post<RegisterResponse>('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      .then((r) => r.data),

  logout: () => api.post<MessageResponse>('/logout').then((r) => r.data),

  profile: () => api.get<User>('/profile').then((r) => r.data),

  updateProfile: (data: { name: string; email: string }) =>
    api
      .put<{ message: string; user: User }>('/profile', data)
      .then((r) => r.data),

  changePassword: (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
  ) =>
    api
      .put<MessageResponse>('/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      })
      .then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post<MessageResponse>('/forgot-password', { email }).then((r) => r.data),

  resetPassword: (
    email: string,
    password: string,
    passwordConfirmation: string,
    token: string,
  ) =>
    api
      .post<MessageResponse>('/reset-password', {
        email,
        password,
        password_confirmation: passwordConfirmation,
        token,
      })
      .then((r) => r.data),

  resendVerification: () =>
    api.post<MessageResponse>('/email/verification-notification').then((r) => r.data),

  confirmPassword: (password: string) =>
    api
      .post<MessageResponse & { password_confirmed_at: number }>('/confirm-password', { password })
      .then((r) => r.data),
}

// ==================== Products ====================

export const productApi = {
  list: () => api.get<Product[]>('/products').then((r) => r.data),

  show: (id: number) => api.get<Product>(`/products/${id}`).then((r) => r.data),

  reviews: (productId: number) =>
    api.get<Review[]>(`/products/${productId}/reviews`).then((r) => r.data),
}

// ==================== Categories ====================

export const categoryApi = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data),
}

// ==================== Cart ====================

export const cartApi = {
  index: () => api.get<CartItem[]>('/cart').then((r) => r.data),

  add: (productId: number, quantity: number) =>
    api.post<MessageResponse & { item: CartItem }>('/cart', { product_id: productId, quantity }).then((r) => r.data),

  update: (id: number, quantity: number) =>
    api.put<MessageResponse & { item: CartItem }>(`/cart/${id}`, { quantity }).then((r) => r.data),

  remove: (id: number) => api.delete<MessageResponse>(`/cart/${id}`).then((r) => r.data),
}

// ==================== Checkout ====================

export const checkoutApi = {
  checkout: () => api.post<MessageResponse & { order: Order }>('/checkout').then((r) => r.data),
}

// ==================== Orders ====================

export const orderApi = {
  list: () => api.get<Order[]>('/orders').then((r) => r.data),

  show: (id: number) => api.get<Order>(`/orders/${id}`).then((r) => r.data),
}

// ==================== Reviews ====================

export const reviewApi = {
  store: (productId: number, rating: number, comment?: string) =>
    api
      .post<MessageResponse & { review: Review }>('/reviews', {
        product_id: productId,
        rating,
        comment,
      })
      .then((r) => r.data),
}

// ==================== Wishlist ====================

export const wishlistApi = {
  index: () => api.get<WishlistItem[]>('/wishlist').then((r) => r.data),

  add: (productId: number) =>
    api.post<MessageResponse>('/wishlist', { product_id: productId }).then((r) => r.data),

  remove: (productId: number) =>
    api.delete<MessageResponse>(`/wishlist/${productId}`).then((r) => r.data),
}

// ==================== Admin ====================

export const adminApi = {
  // Dashboard
  dashboard: () => api.get<AdminDashboard>('/admin/dashboard').then((r) => r.data),

  // Products
  products: (page = 1) =>
    api.get<PaginatedResponse<Product>>(`/admin/products?page=${page}`).then((r) => r.data),

  storeProduct: (formData: FormData) =>
    api.post<MessageResponse & { product: Product }>('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  updateProduct: (id: number, formData: FormData) =>
    api
      .put<MessageResponse & { product: Product }>(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  deleteProduct: (id: number) =>
    api.delete<MessageResponse>(`/admin/products/${id}`).then((r) => r.data),

  // Categories
  categories: (page = 1) =>
    api.get<PaginatedResponse<Category>>(`/admin/categories?page=${page}`).then((r) => r.data),

  storeCategory: (data: { name: string; description?: string }) =>
    api.post<MessageResponse & { category: Category }>('/admin/categories', data).then((r) => r.data),

  updateCategory: (id: number, data: { name: string; description?: string }) =>
    api
      .put<MessageResponse & { category: Category }>(`/admin/categories/${id}`, data)
      .then((r) => r.data),

  deleteCategory: (id: number) =>
    api.delete<MessageResponse>(`/admin/categories/${id}`).then((r) => r.data),

  // Orders
  orders: (page = 1) =>
    api.get<PaginatedResponse<Order>>(`/admin/orders?page=${page}`).then((r) => r.data),

  showOrder: (id: number) =>
    api.get<Order>(`/admin/orders/${id}`).then((r) => r.data),

  updateOrderStatus: (id: number, status: string) =>
    api
      .put<MessageResponse & { order: Order }>(`/admin/orders/${id}/status`, { status })
      .then((r) => r.data),

  // Users
  users: (page = 1) =>
    api.get<PaginatedResponse<User>>(`/admin/users?page=${page}`).then((r) => r.data),

  showUser: (id: number) => api.get<User>(`/admin/users/${id}`).then((r) => r.data),
}
