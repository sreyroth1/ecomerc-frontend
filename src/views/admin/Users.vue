<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Users</h1>

    <div v-if="loading" class="card animate-pulse">
      <div class="h-48 bg-gray-200 rounded" />
    </div>

    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-200">
              <th class="pb-3 font-medium">ID</th>
              <th class="pb-3 font-medium">Name</th>
              <th class="pb-3 font-medium">Email</th>
              <th class="pb-3 font-medium">Role</th>
              <th class="pb-3 font-medium">Joined</th>
              <th class="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-gray-500">{{ user.id }}</td>
              <td class="py-3 font-medium text-gray-900">{{ user.name }}</td>
              <td class="py-3 text-gray-600">{{ user.email }}</td>
              <td class="py-3">
                <span :class="user.role === 'admin' ? 'badge bg-purple-100 text-purple-800' : 'badge bg-blue-100 text-blue-800'">
                  {{ user.role }}
                </span>
              </td>
              <td class="py-3 text-gray-500">{{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}</td>
              <td class="py-3 text-right">
                <router-link :to="`/admin/users/${user.id}`" class="text-indigo-600 hover:text-indigo-800 font-medium">
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
import type { User } from '@/types'

const users = ref<User[]>([])
const loading = ref(true)
const pagination = ref<{ from: number; to: number; total: number; prev_page_url: string | null; next_page_url: string | null } | null>(null)
const currentPage = ref(1)

async function loadPage(page: number) {
  loading.value = true
  try {
    const res = await adminApi.users(page)
    users.value = res.data
    pagination.value = {
      from: res.from || 0,
      to: res.to || 0,
      total: res.total,
      prev_page_url: res.current_page > 1 ? 'yes' : null,
      next_page_url: res.current_page < res.last_page ? 'yes' : null,
    }
    currentPage.value = page
  } catch (err) {
    console.error('Failed to load users:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadPage(1))
</script>
