<template>
  <div>
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="n in 4" :key="n" class="card animate-pulse h-28" />
    </div>

    <template v-else-if="data">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ data.total_users }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Products</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ data.total_products }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Orders</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ data.total_orders }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Revenue</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">${{ Number(data.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card mt-6">
        <h2 class="font-semibold text-lg mb-4">Recent Orders</h2>
        <div v-if="data.recent_orders.length === 0" class="text-gray-500 text-sm py-4 text-center">No orders yet.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 border-b border-gray-200">
                <th class="pb-3 font-medium">Order #</th>
                <th class="pb-3 font-medium">Customer</th>
                <th class="pb-3 font-medium">Amount</th>
                <th class="pb-3 font-medium">Status</th>
                <th class="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in data.recent_orders" :key="order.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-3">
                  <router-link :to="`/admin/orders/${order.id}`" class="text-indigo-600 font-medium hover:text-indigo-800">#{{ order.id }}</router-link>
                </td>
                <td class="py-3 text-gray-700">{{ order.user?.name }}</td>
                <td class="py-3 font-medium">${{ Number(order.total_amount).toFixed(2) }}</td>
                <td class="py-3"><span :class="statusBadge(order.status)">{{ order.status }}</span></td>
                <td class="py-3 text-gray-500">{{ new Date(order.created_at!).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'
import type { AdminDashboard } from '@/types'

const data = ref<AdminDashboard | null>(null)
const loading = ref(true)

function statusBadge(status: string) {
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
    data.value = await adminApi.dashboard()
  } catch (err) {
    console.error('Failed to load dashboard:', err)
  } finally {
    loading.value = false
  }
})
</script>
