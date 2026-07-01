<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

    <div v-if="cart.items.length === 0" class="text-center py-20">
      <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
      <router-link to="/" class="btn-primary">Continue Shopping</router-link>
    </div>

    <template v-else>
      <div class="space-y-4">
        <div v-for="item in cart.items" :key="item.id" class="card flex items-center gap-4">
          <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img v-if="item.product.image" :src="productImage(item.product.image)" :alt="item.product.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <router-link :to="`/products/${item.product.id}`" class="font-semibold text-gray-900 hover:text-indigo-600 truncate block">
              {{ item.product.name }}
            </router-link>
            <p class="text-sm text-gray-500">${{ Number(item.product.price).toFixed(2) }} each</p>
          </div>
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button @click="decrease(item)" class="px-3 py-1.5 hover:bg-gray-100 transition-colors">-</button>
            <span class="px-3 py-1.5 font-medium">{{ item.quantity }}</span>
            <button @click="increase(item)" class="px-3 py-1.5 hover:bg-gray-100 transition-colors">+</button>
          </div>
          <div class="text-right min-w-[5rem]">
            <p class="font-bold text-gray-900">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
            <button @click="remove(item.id)" class="text-sm text-red-600 hover:text-red-700 mt-1">Remove</button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="card mt-6">
        <div class="flex items-center justify-between text-lg">
          <span class="font-semibold text-gray-900">Total</span>
          <span class="font-bold text-indigo-600 text-2xl">${{ cart.totalAmount().toFixed(2) }}</span>
        </div>
        <router-link to="/checkout" class="btn-primary w-full mt-4 block text-center py-3 text-lg">
          Proceed to Checkout
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { CartItem } from '@/types'

const cart = useCartStore()

function productImage(image: string) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/storage/${image}`
}

async function increase(item: CartItem) {
  await cart.updateItem(item.id, item.quantity + 1)
}

async function decrease(item: CartItem) {
  if (item.quantity <= 1) {
    await cart.removeItem(item.id)
  } else {
    await cart.updateItem(item.id, item.quantity - 1)
  }
}

async function remove(id: number) {
  await cart.removeItem(id)
}

onMounted(() => cart.fetchCart())
</script>
