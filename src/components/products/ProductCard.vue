<template>
  <div
    ref="cardRef"
    class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
  >
    <!-- Image Container -->
    <div class="relative overflow-hidden bg-gray-50 aspect-[4/3]">
      <!-- Image Link -->
      <router-link :to="`/products/${product.id}`" class="block w-full h-full">
        <img
          v-if="product.image"
          :src="productImage"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </router-link>

      <!-- Wishlist Heart Button -->
      <button
        @click.prevent="handleWishlistClick"
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
        :class="isWishlisted ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50'"
        :title="isWishlisted ? 'Remove from wishlist' : (auth.isAuthenticated ? 'Add to wishlist' : 'Login to wishlist')"
      >
        <svg class="w-5 h-5" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- Quick View Overlay -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          @click.prevent="emit('quickView', props.product)"
          class="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 transform scale-90 group-hover:scale-100"
        >
          <svg class="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Quick View
        </button>
      </div>

      <!-- Stock Overlay Badge -->
      <div class="absolute bottom-3 left-3">
        <span
          v-if="product.stock <= 0"
          class="px-2.5 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-sm"
        >
          Out of Stock
        </span>
        <span
          v-else-if="product.stock <= 5"
          class="px-2.5 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold shadow-sm"
        >
          Only {{ product.stock }} left
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1">
      <!-- Product Name -->
      <router-link :to="`/products/${product.id}`" class="block">
        <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {{ product.name }}
        </h3>
      </router-link>

      <!-- Star Rating -->
      <div class="mt-2 flex items-center space-x-1">
        <template v-for="i in 5" :key="i">
          <svg
            class="w-4 h-4"
            :class="i <= Math.round(product.reviews_avg_rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </template>
        <span class="text-xs text-gray-400 ml-1">
          <template v-if="product.reviews_count && product.reviews_count > 0">
            {{ Number(product.reviews_avg_rating).toFixed(1) }} ({{ product.reviews_count }})
          </template>
          <template v-else>
            No reviews
          </template>
        </span>
      </div>

      <!-- Price & Rating Row -->
      <div class="flex items-end justify-between mt-4">
        <div>
          <span class="text-2xl font-bold text-indigo-600">${{ Number(product.price).toFixed(2) }}</span>
          <div class="flex items-center space-x-1 mt-0.5">
            <span class="text-xs text-gray-400">Stock:</span>
            <span
              class="text-xs font-medium"
              :class="product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'"
            >
              {{ product.stock > 0 ? product.stock : 'Out of stock' }}
            </span>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <button
          v-if="auth.isAuthenticated && product.stock > 0"
          @click.prevent="addToCart"
          :disabled="addingToCart"
          class="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg v-if="addingToCart" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span>{{ addingToCart ? 'Adding...' : 'Add to Cart' }}</span>
        </button>
      </div>

      <!-- Login to buy prompt -->
      <p v-if="!auth.isAuthenticated" class="mt-4 text-xs text-center text-gray-400">
        <router-link to="/login" class="text-indigo-500 hover:text-indigo-600 font-medium">Login</router-link>
        &nbsp;to add to cart
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const props = defineProps<{ product: Product }>()

const emit = defineEmits<{
  quickView: [product: Product]
}>()

const { elementRef: cardRef, isVisible } = useScrollAnimation()

const router = useRouter()
const auth = useAuthStore()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const addingToCart = ref(false)

const productImage = computed(() => {
  if (!props.product.image) return ''
  if (props.product.image.startsWith('http')) return props.product.image
  return `/storage/${props.product.image}`
})

const isWishlisted = computed(() => wishlistStore.isWishlisted(props.product.id))

function handleWishlistClick() {
  if (auth.isAuthenticated) {
    toggleWishlist()
  } else {
    router.push('/login')
  }
}

async function toggleWishlist() {
  try {
    if (isWishlisted.value) {
      await wishlistStore.removeFromWishlist(props.product.id)
    } else {
      await wishlistStore.addToWishlist(props.product.id)
    }
  } catch (err) {
    console.error('Wishlist toggle failed:', err)
  }
}

async function addToCart() {
  addingToCart.value = true
  try {
    await cartStore.addToCart(props.product.id, 1)
  } catch (err) {
    console.error('Add to cart failed:', err)
  } finally {
    addingToCart.value = false
  }
}
</script>
