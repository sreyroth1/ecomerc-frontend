<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

    <div v-if="cart.items.length === 0" class="text-center py-20">
      <p class="text-gray-500 text-lg mb-4">Your cart is empty.</p>
      <router-link to="/" class="btn-primary">Go Shopping</router-link>
    </div>

    <template v-else>
      <div class="card mb-6">
        <h2 class="font-semibold text-lg mb-4">Order Summary</h2>
        <div class="space-y-3">
          <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm">
            <span class="text-gray-600">{{ item.product.name }} × {{ item.quantity }}</span>
            <span class="font-medium">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <hr class="my-4" />
        <div class="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span class="text-indigo-600">${{ cart.totalAmount().toFixed(2) }}</span>
        </div>
      </div>

      <div class="card mb-6">
        <h2 class="font-semibold text-lg mb-4">Shipping Information</h2>
        <div class="text-sm text-gray-600">
          <p><strong>Name:</strong> {{ auth.user?.name }}</p>
          <p><strong>Email:</strong> {{ auth.user?.email }}</p>
        </div>
      </div>

      <button @click="placeOrder" :disabled="loading" class="btn-primary w-full py-3 text-lg flex items-center justify-center">
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ loading ? 'Processing...' : `Place Order - $${cart.totalAmount().toFixed(2)}` }}
      </button>

      <p v-if="error" class="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3 text-center">{{ error }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { checkoutApi } from '@/api'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const loading = ref(false)
const error = ref('')

async function placeOrder() {
  loading.value = true
  error.value = ''
  try {
    const res = await checkoutApi.checkout()
    await cart.fetchCart()
    router.push(`/orders/${res.order.id}`)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Checkout failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => cart.fetchCart())
</script>
