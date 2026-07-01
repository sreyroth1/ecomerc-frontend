<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

    <div v-if="loading" class="card animate-pulse">
      <div class="h-48 bg-gray-200 rounded" />
    </div>

    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-200">
              <th class="pb-3 font-medium">Order #</th>
              <th class="pb-3 font-medium">Customer</th>
              <th class="pb-3 font-medium">Amount</th>
              <th class="pb-3 font-medium">Status</th>
              <th class="pb-3 font-medium">Date</th>
              <th class="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 font-medium text-gray-900">#{{ order.id }}</td>
              <td class="py-3">
                <div>
                  <p class="font-medium text-gray-900">{{ order.user?.name }}</p>
                  <p class="text-gray-500 text-xs">{{ order.user?.email }}</p>
                </div>
              </td>
              <td class="py-3 font-medium">${{ Number(order.total_amount).toFixed(2) }}</td>
              <td class="py-3"><span :class="statusBadge(order.status)">{{ order.status }}</span></td>
              <td class="py-3 text-gray-500">{{ new Date(order.created_at!).toLocaleDateString() }}</td>
              <td class="py-3 text-right">
                <router-link :to="`/admin/orders/${order.id}`" class="text-indigo-600 hover:text-indigo-800 font-medium">
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination" class="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <p class="text-sm text-gray-500">
          Showing {{ pagination.from }}–{{ pagination.to }} of {{ pagination.total }}
        </p>
        <div class="flex space-x-2">
          <button
            :disabled="!pagination.prev_page_url"
            @click="loadPage(currentPage - 1)"
            class="btn-secondary btn-sm"
          >Previous</button>
          <button
            :disabled="!pagination.next_page_url"
            @click="loadPage(currentPage + 1)"
            class="btn-secondary btn-sm"
          >Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const loading = ref(true)
const pagination = ref<{ from: number; to: number; total: number; prev_page_url: string | null; next_page_url: string | null } | null>(null)
const currentPage = ref(1)

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

async function loadPage(page: number) {
  loading.value = true
  try {
    const res = await adminApi.orders(page)
    orders.value = res.data
    pagination.value = {
      from: res.from || 0,
      to: res.to || 0,
      total: res.total,
      prev_page_url: res.current_page > 1 ? 'yes' : null,
      next_page_url: res.current_page < res.last_page ? 'yes' : null,
    }
    currentPage.value = page
  } catch (err) {
    console.error('Failed to load orders:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadPage(1))
</script>
