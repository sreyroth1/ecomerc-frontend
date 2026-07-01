// ============== Models ==============

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'customer'
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  category_id: number
  category?: Category
  wishlists_count?: number
  reviews_avg_rating?: number
  reviews_count?: number
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product: Product
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: number
  user_id: number
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  user?: User
  items?: OrderItem[]
  created_at?: string
  updated_at?: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

export interface Review {
  id: number
  user_id: number
  product_id: number
  rating: number
  comment?: string
  user?: { id: number; name: string }
  created_at?: string
  updated_at?: string
}

export interface WishlistItem {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  category_id: number
  category?: Category
  pivot: {
    user_id: number
    product_id: number
    created_at: string
    updated_at: string
  }
}

// ============== API Responses ==============

export interface LoginResponse {
  message: string
  user: User
  token: string
}

export interface RegisterResponse {
  message: string
  user: User
  token: string
}

export interface AdminDashboard {
  total_users: number
  total_products: number
  total_orders: number
  total_revenue: number
  recent_orders: Order[]
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  links: { url: string | null; label: string; active: boolean }[]
}

export interface MessageResponse {
  message: string
}

export interface AuthUser extends User {
  // Additional fields from backend response
}
