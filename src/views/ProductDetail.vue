<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <!-- Back -->
    <router-link to="/" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Products
    </router-link>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="h-8 bg-gray-200 rounded w-1/3" />
      <div class="h-64 bg-gray-200 rounded-xl" />
      <div class="h-4 bg-gray-200 rounded w-3/4" />
      <div class="h-4 bg-gray-200 rounded w-1/2" />
    </div>

    <template v-else-if="product">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Image -->
        <div class="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
          <img v-if="product.image" :src="productDetailImage" :alt="product.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <!-- Details -->
        <div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">{{ product.category?.name }}</span>
              <h1 class="text-2xl font-bold text-gray-900 mt-2">{{ product.name }}</h1>
            </div>
            <!-- Wishlist -->
            <button
              v-if="auth.isAuthenticated"
              @click="toggleWishlist"
              class="p-2 rounded-full transition-colors"
              :class="isInWishlist ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-400 hover:bg-gray-100'"
            >
              <svg class="w-6 h-6" :fill="isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <p class="text-3xl font-bold text-indigo-600 mt-4">${{ Number(product.price).toFixed(2) }}</p>
          <p class="text-sm text-gray-500 mt-1">
            Stock: <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">{{ product.stock > 0 ? product.stock + ' available' : 'Out of stock' }}</span>
          </p>

          <p class="text-gray-600 mt-4 leading-relaxed">{{ product.description }}</p>

          <!-- Add to cart -->
          <div v-if="auth.isAuthenticated && product.stock > 0" class="mt-6 flex items-center space-x-4">
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button @click="qty = Math.max(1, qty - 1)" class="px-3 py-2 hover:bg-gray-100 transition-colors">-</button>
              <span class="px-4 py-2 font-medium min-w-[3rem] text-center">{{ qty }}</span>
              <button @click="qty = Math.min(product.stock, qty + 1)" class="px-3 py-2 hover:bg-gray-100 transition-colors">+</button>
            </div>
            <button @click="addToCart" :disabled="cartLoading" class="btn-primary py-2.5 flex-1 flex items-center justify-center">
              <svg v-if="cartLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ cartLoading ? 'Adding...' : 'Add to Cart' }}
            </button>
          </div>

          <p v-if="!auth.isAuthenticated" class="mt-4 text-sm text-gray-500">
            <router-link to="/login" class="text-indigo-600 font-medium">Login</router-link> to add items to your cart.
          </p>
        </div>
      </div>

      <!-- Reviews -->
      <section class="mt-12">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Reviews</h2>

        <!-- Write review -->
        <div v-if="auth.isAuthenticated" class="card mb-6">
          <h3 class="font-semibold mb-4">Write a Review</h3>
          <form @submit.prevent="submitReview" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div class="flex space-x-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="newRating = star"
                  class="text-2xl transition-colors"
                  :class="star <= newRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'"
                >
                  ★
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea v-model="newComment" rows="3" class="input-field" placeholder="Share your thoughts..." maxlength="1000" />
            </div>
            <button type="submit" :disabled="reviewLoading || !newRating" class="btn-primary">
              {{ reviewLoading ? 'Submitting...' : 'Submit Review' }}
            </button>
          </form>
          <p v-if="reviewError" class="mt-2 text-sm text-red-600">{{ reviewError }}</p>
          <p v-if="reviewSuccess" class="mt-2 text-sm text-green-600">{{ reviewSuccess }}</p>
        </div>

        <!-- Reviews list -->
        <div class="space-y-4">
          <div v-for="review in reviews" :key="review.id" class="card">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600">{{ review.user?.name.charAt(0).toUpperCase() }}</span>
                </div>
                <span class="font-medium text-gray-900">{{ review.user?.name }}</span>
              </div>
              <div class="flex text-yellow-400">
                <span v-for="star in 5" :key="star" :class="star <= review.rating ? '' : 'text-gray-300'">★</span>
              </div>
            </div>
            <p v-if="review.comment" class="text-gray-600">{{ review.comment }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ review.created_at ? new Date(review.created_at).toLocaleDateString() : '' }}</p>
          </div>
          <p v-if="reviews.length === 0" class="text-gray-500 text-center py-8">No reviews yet.</p>
        </div>
      </section>
    </template>

    <!-- Not found -->
    <div v-else class="text-center py-20">
      <p class="text-gray-500 text-lg">Product not found.</p>
      <router-link to="/" class="text-indigo-600 font-medium mt-2 inline-block">Go back to shop</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi, reviewApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import type { Product, Review } from '@/types'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const product = ref<Product | null>(null)
const productDetailImage = computed(() => {
  if (!product.value?.image) return ''
  if (product.value.image.startsWith('http')) return product.value.image
  return `/storage/${product.value.image}`
})
const reviews = ref<Review[]>([])
const loading = ref(true)
const qty = ref(1)
const cartLoading = ref(false)

// Review form
const newRating = ref(0)
const newComment = ref('')
const reviewLoading = ref(false)
const reviewError = ref('')
const reviewSuccess = ref('')

const isInWishlist = ref(false)

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const [prodData, revData] = await Promise.all([
      productApi.show(id),
      productApi.reviews(id),
    ])
    product.value = prodData
    reviews.value = revData
    if (auth.isAuthenticated) {
      await wishlistStore.fetchWishlist()
      isInWishlist.value = wishlistStore.isWishlisted(id)
    }
  } catch (err: any) {
    console.error('Failed to load product:', err)
  } finally {
    loading.value = false
  }
})

async function toggleWishlist() {
  if (!product.value) return
  try {
    if (isInWishlist.value) {
      await wishlistStore.removeFromWishlist(product.value.id)
    } else {
      await wishlistStore.addToWishlist(product.value.id)
    }
    isInWishlist.value = !isInWishlist.value
  } catch (err: any) {
    console.error('Wishlist toggle failed:', err)
  }
}

async function addToCart() {
  if (!product.value) return
  cartLoading.value = true
  try {
    await cartStore.addToCart(product.value.id, qty.value)
  } catch (err: any) {
    console.error('Add to cart failed:', err)
  } finally {
    cartLoading.value = false
  }
}

async function submitReview() {
  if (!product.value) return
  reviewLoading.value = true
  reviewError.value = ''
  reviewSuccess.value = ''
  try {
    const res = await reviewApi.store(product.value.id, newRating.value, newComment.value)
    reviews.value.unshift(res.review)
    router.push('/')
  } catch (err: any) {
    reviewError.value = err.response?.data?.message || 'Failed to submit review.'
  } finally {
    reviewLoading.value = false
  }
}
</script>
