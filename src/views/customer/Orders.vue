<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="card animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-3" />
        <div class="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-20">
      <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-gray-500 text-lg mb-4">No orders yet</p>
      <router-link to="/" class="btn-primary">Start Shopping</router-link>
    </div>

    <div v-else class="space-y-4">
      <router-link
        v-for="order in orders"
        :key="order.id"
        :to="`/orders/${order.id}`"
        class="card block hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-900">Order #{{ order.id }}</p>
            <p class="text-sm text-gray-500">{{ new Date(order.created_at!).toLocaleDateString() }}</p>
          </div>
          <div class="text-right">
            <span class="font-bold text-indigo-600">${{ Number(order.total_amount).toFixed(2) }}</span>
            <p :class="statusClass(order.status)" class="mt-1">{{ order.status }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderApi } from '@/api'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const loading = ref(true)

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'badge-pending',
    processing: 'badge-processing',
    shipped: 'badge-shipped',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  }
  return map[status] || 'badge-pending'
}

onMounted(async () => {
  try {
    orders.value = await orderApi.list()
  } catch (err) {
    console.error('Failed to load orders:', err)
  } finally {
    loading.value = false
  }
})
</script>
