<template>
  <div class="max-w-4xl">
    <router-link to="/admin/orders" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Orders
    </router-link>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3" />
      <div class="h-4 bg-gray-200 rounded w-1/2" />
      <div class="h-48 bg-gray-200 rounded" />
    </div>

    <template v-else-if="order">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Order #{{ order.id }}</h1>
          <p class="text-sm text-gray-500">{{ new Date(order.created_at!).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <span :class="statusBadge">{{ order.status }}</span>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="card mb-6">
        <h2 class="font-semibold text-lg mb-4">Customer</h2>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500">Name</p>
            <p class="font-medium text-gray-900">{{ order.user?.name }}</p>
          </div>
          <div>
            <p class="text-gray-500">Email</p>
            <p class="font-medium text-gray-900">{{ order.user?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="card mb-6">
        <h2 class="font-semibold text-lg mb-4">Order Items</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-200">
              <th class="pb-3 font-medium">Product</th>
              <th class="pb-3 font-medium">Price</th>
              <th class="pb-3 font-medium">Qty</th>
              <th class="pb-3 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id" class="border-b border-gray-100">
              <td class="py-3 font-medium text-gray-900">{{ item.product?.name || `Product #${item.product_id}` }}</td>
              <td class="py-3 text-gray-600">${{ Number(item.price).toFixed(2) }}</td>
              <td class="py-3 text-gray-600">{{ item.quantity }}</td>
              <td class="py-3 text-right font-medium">${{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total & Status Update -->
      <div class="grid sm:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="font-semibold text-lg mb-4">Total</h2>
          <p class="text-3xl font-bold text-indigo-600">${{ Number(order.total_amount).toFixed(2) }}</p>
        </div>

        <div class="card">
          <h2 class="font-semibold text-lg mb-4">Update Status</h2>
          <div class="flex space-x-2">
            <select v-model="newStatus" class="input-field">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button @click="updateStatus" :disabled="updating || newStatus === order.status" class="btn-primary btn-sm whitespace-nowrap">
              {{ updating ? '...' : 'Update' }}
            </button>
          </div>
          <p v-if="statusMsg" class="mt-2 text-sm" :class="statusMsgType === 'success' ? 'text-green-600' : 'text-red-600'">
            {{ statusMsg }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { adminApi } from '@/api'
import type { Order } from '@/types'

const route = useRoute()
const order = ref<Order | null>(null)
const loading = ref(true)

const newStatus = ref('')
const updating = ref(false)
const statusMsg = ref('')
const statusMsgType = ref<'success' | 'error'>('success')

const statusBadge = computed(() => {
  const map: Record<string, string> = {
    pending: 'badge-pending text-lg px-4 py-1.5',
    processing: 'badge-processing text-lg px-4 py-1.5',
    shipped: 'badge-shipped text-lg px-4 py-1.5',
    delivered: 'badge-delivered text-lg px-4 py-1.5',
    cancelled: 'badge-cancelled text-lg px-4 py-1.5',
  }
  return map[order.value?.status || ''] || 'badge-pending text-lg px-4 py-1.5'
})

async function updateStatus() {
  if (!order.value) return
  updating.value = true
  statusMsg.value = ''
  try {
    const res = await adminApi.updateOrderStatus(order.value.id, newStatus.value)
    order.value = res.order
    statusMsg.value = res.message
    statusMsgType.value = 'success'
  } catch (err: any) {
    statusMsg.value = err.response?.data?.message || 'Failed to update status.'
    statusMsgType.value = 'error'
  } finally {
    updating.value = false
  }
}

onMounted(async () => {
  try {
    order.value = await adminApi.showOrder(Number(route.params.id))
    newStatus.value = order.value.status
  } catch (err) {
    console.error('Failed to load order:', err)
  } finally {
    loading.value = false
  }
})
</script>
