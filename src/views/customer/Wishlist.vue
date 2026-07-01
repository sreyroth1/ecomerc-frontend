<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

    <div v-if="wishlist.items.length === 0" class="text-center py-20">
      <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <p class="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
      <router-link to="/" class="btn-primary">Browse Products</router-link>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="item in wishlist.items" :key="item.id" class="card relative group">
        <button
          @click="remove(item.id)"
          class="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors z-10"
          title="Remove from wishlist"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <router-link :to="`/products/${item.id}`">
          <div class="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden">
            <img v-if="item.image" :src="productImage(item.image)" :alt="item.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h3 class="font-semibold text-gray-900 truncate">{{ item.name }}</h3>
          <p class="text-indigo-600 font-bold mt-1">${{ Number(item.price).toFixed(2) }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'

const wishlist = useWishlistStore()

function productImage(image: string) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/storage/${image}`
}

async function remove(productId: number) {
  await wishlist.removeFromWishlist(productId)
}

onMounted(() => wishlist.fetchWishlist())
</script>
