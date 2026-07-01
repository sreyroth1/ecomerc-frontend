<template>
  <div class="max-w-2xl">
    <router-link to="/admin/users" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Users
    </router-link>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3" />
      <div class="h-32 bg-gray-200 rounded" />
    </div>

    <template v-else-if="user">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">User Details</h1>

      <div class="card">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <span class="text-2xl font-bold text-indigo-600">{{ user.name.charAt(0).toUpperCase() }}</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ user.name }}</h2>
            <span :class="user.role === 'admin' ? 'badge bg-purple-100 text-purple-800' : 'badge bg-blue-100 text-blue-800'">
              {{ user.role }}
            </span>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p class="text-gray-500 mb-1">User ID</p>
            <p class="font-medium text-gray-900">{{ user.id }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Email</p>
            <p class="font-medium text-gray-900">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Role</p>
            <p class="font-medium text-gray-900 capitalize">{{ user.role }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Member Since</p>
            <p class="font-medium text-gray-900">{{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}</p>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <p class="text-gray-500">User not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { adminApi } from '@/api'
import type { User } from '@/types'

const route = useRoute()
const user = ref<User | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    user.value = await adminApi.showUser(Number(route.params.id))
  } catch (err) {
    console.error('Failed to load user:', err)
  } finally {
    loading.value = false
  }
})
</script>
