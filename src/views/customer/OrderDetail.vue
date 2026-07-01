<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <router-link to="/orders" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Orders
    </router-link>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3" />
      <div class="h-4 bg-gray-200 rounded w-1/2" />
      <div class="h-32 bg-gray-200 rounded" />
    </div>

    <template v-else-if="order">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Order #{{ order.id }}</h1>
          <p class="text-sm text-gray-500">{{ new Date(order.created_at!).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </div>
        <span :class="statusClass">{{ order.status }}</span>
      </div>

      <div class="card mb-6">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-gray-500 border-b border-gray-200">
              <th class="pb-3 font-medium">Product</th>
              <th class="pb-3 font-medium">Price</th>
              <th class="pb-3 font-medium">Qty</th>
              <th class="pb-3 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id" class="border-b border-gray-100">
              <td class="py-3">
                <span class="font-medium text-gray-900">{{ item.product?.name || `Product #${item.product_id}` }}</span>
              </td>
              <td class="py-3 text-gray-600">${{ Number(item.price).toFixed(2) }}</td>
              <td class="py-3 text-gray-600">{{ item.quantity }}</td>
              <td class="py-3 text-right font-medium">${{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span class="text-indigo-600">${{ Number(order.total_amount).toFixed(2) }}</span>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <p class="text-gray-500">Order not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { orderApi } from '@/api'
import type { Order } from '@/types'

const route = useRoute()
const order = ref<Order | null>(null)
const loading = ref(true)

const statusClass = computed(() => {
  const map: Record<string, string> = {
    pending: 'badge-pending text-lg px-4 py-1.5',
    processing: 'badge-processing text-lg px-4 py-1.5',
    shipped: 'badge-shipped text-lg px-4 py-1.5',
    delivered: 'badge-delivered text-lg px-4 py-1.5',
    cancelled: 'badge-cancelled text-lg px-4 py-1.5',
  }
  return map[order.value?.status || ''] || 'badge-pending text-lg px-4 py-1.5'
})

onMounted(async () => {
  try {
    order.value = await orderApi.show(Number(route.params.id))
  } catch (err) {
    console.error('Failed to load order:', err)
  } finally {
    loading.value = false
  }
})
</script>
