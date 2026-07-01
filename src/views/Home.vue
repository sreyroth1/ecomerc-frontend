<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">Discover Amazing Products</h1>
          <p class="text-lg text-indigo-200 mb-8">Browse our curated collection of high-quality products at unbeatable prices.</p>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="(cat, index) in categories"
              :key="cat.id"
              @click="activeCategory = activeCategory === cat.id ? null : cat.id"
              class="px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all"
              :class="[
                activeCategory === cat.id ? 'bg-white text-indigo-700 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20',
                index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'
              ]"
              :style="{ animationDelay: `${index * 0.08}s` }"
            >
              {{ cat.name }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Search Bar -->
      <div class="relative mb-8">
        <div class="relative max-w-xl">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products by name, description, or category..."
            class="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Search stats -->
        <p v-if="searchQuery" class="text-xs text-gray-400 mt-2">
          {{ filteredProducts.length }} result{{ filteredProducts.length !== 1 ? 's' : '' }} for "{{ searchQuery }}"
        </p>
      </div>

      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'All Products' }}
          </h2>
          <!-- Clear filter badge -->
          <button
            v-if="activeCategory || searchQuery"
            @click="activeCategory = null; searchQuery = ''"
            class="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear filters</span>
          </button>
        </div>
        <span class="text-sm text-gray-500">{{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200" />
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-4 bg-gray-200 rounded w-1/2" />
            <div class="h-6 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-500 text-lg">No products found</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in filteredProducts" :key="product.id">
          <ProductCard :product="product" @quick-view="openQuickView" />
        </div>
      </div>
    </section>

    <!-- Quick View Modal -->
    <QuickViewModal
      :visible="quickViewVisible"
      :product="quickViewProduct!"
      @close="closeQuickView"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productApi, categoryApi } from '@/api'
import type { Product, Category } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import ProductCard from '@/components/products/ProductCard.vue'
import QuickViewModal from '@/components/common/QuickViewModal.vue'

const auth = useAuthStore()
const wishlistStore = useWishlistStore()
const route = useRoute()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const activeCategory = ref<number | null>(null)
const searchQuery = ref('')

// Quick view modal state
const quickViewProduct = ref<Product | null>(null)
const quickViewVisible = ref(false)

function openQuickView(product: Product) {
  quickViewProduct.value = product
  quickViewVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeQuickView() {
  quickViewVisible.value = false
  document.body.style.overflow = ''
  setTimeout(() => {
    quickViewProduct.value = null
  }, 200)
}

const filteredProducts = computed(() => {
  let result = products.value

  // Category filter
  if (activeCategory.value) {
    result = result.filter((p) => p.category_id === activeCategory.value)
  }

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q),
    )
  }

  return result
})

async function fetchData() {
  loading.value = true
  try {
    const [prods, cats] = await Promise.all([productApi.list(), categoryApi.list()])
    products.value = prods
    categories.value = cats
    // Load wishlist if authenticated so cards show correct heart state
    if (auth.isAuthenticated) {
      wishlistStore.fetchWishlist()
    }
  } catch (err) {
    console.error('Failed to load data:', err)
  } finally {
    loading.value = false
  }
}

// Fetch on mount
onMounted(fetchData)

// Re-fetch whenever we navigate back to the home page
watch(() => route.path, (path) => {
  if (path === '/') {
    fetchData()
  }
})
</script>
