<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-gray-900 text-white flex-shrink-0">
      <div class="p-4 border-b border-gray-800">
        <router-link to="/admin/dashboard" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">E</span>
          </div>
          <span class="text-lg font-bold">ShopHub Admin</span>
        </router-link>
      </div>

      <!-- Mobile toggle -->
      <button @click="sidebarOpen = !sidebarOpen" class="md:hidden w-full p-4 text-left border-b border-gray-800 flex items-center justify-between">
        <span class="font-medium">Menu</span>
        <svg class="w-5 h-5" :class="{ 'rotate-180': sidebarOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Navigation -->
      <nav :class="{ 'hidden': !sidebarOpen }" class="md:block p-4 space-y-1">
        <router-link
          to="/admin/dashboard"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
          active-class="!bg-indigo-600 !text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </router-link>

        <div class="pt-4 pb-1">
          <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</p>
        </div>
        <router-link
          to="/admin/products"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
          active-class="!bg-indigo-600 !text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Products</span>
        </router-link>
        <router-link
          to="/admin/categories"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
          active-class="!bg-indigo-600 !text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>Categories</span>
        </router-link>

        <div class="pt-4 pb-1">
          <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</p>
        </div>
        <router-link
          to="/admin/orders"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
          active-class="!bg-indigo-600 !text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Orders</span>
        </router-link>

        <div class="pt-4 pb-1">
          <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</p>
        </div>
        <router-link
          to="/admin/users"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
          active-class="!bg-indigo-600 !text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span>Users</span>
        </router-link>

        <div class="pt-4">
          <hr class="border-gray-800 mb-2" />
        </div>
        <router-link to="/" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Store</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h2>
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-sm text-indigo-600 hover:text-indigo-700">
            View Store
          </router-link>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">{{ auth.user?.name.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="hidden sm:inline">{{ auth.user?.name }}</span>
          </div>
          <button @click="handleLogout" class="text-gray-400 hover:text-red-600 transition-colors" title="Logout">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 bg-gray-50 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  const name = route.name?.toString() || ''
  return name
    .replace('admin-', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
})

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>
