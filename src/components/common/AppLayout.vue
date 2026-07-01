<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">E</span>
            </div>
            <span class="text-xl font-bold text-gray-900">ShopHub</span>
          </router-link>

          <!-- Nav Links -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link to="/" class="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Home</router-link>

            <!-- Cart Icon (auth) -->
            <router-link v-if="auth.isAuthenticated" to="/cart" class="relative text-gray-600 hover:text-indigo-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span v-if="cart.itemCount() > 0" class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {{ cart.itemCount() }}
              </span>
            </router-link>

            <!-- Wishlist with badge -->
            <router-link v-if="auth.isAuthenticated" to="/wishlist" class="relative text-gray-600 hover:text-indigo-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span v-if="wishlist.items.length > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {{ wishlist.items.length }}
              </span>
            </router-link>

            <!-- Auth dropdown -->
            <template v-if="auth.isAuthenticated">
              <div class="relative" v-click-outside="() => dropdownOpen = false">
                <button @click="dropdownOpen = !dropdownOpen" class="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold text-sm">{{ auth.user?.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <span class="font-medium">{{ auth.user?.name }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <router-link to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600" @click="dropdownOpen = false">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    My Profile
                  </router-link>
                  <router-link to="/orders" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600" @click="dropdownOpen = false">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    My Orders
                  </router-link>
                  <hr class="my-2 border-gray-100" />
                  <router-link v-if="auth.isAdmin" to="/admin/dashboard" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600" @click="dropdownOpen = false">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Admin Panel
                  </router-link>
                  <hr class="my-2 border-gray-100" />
                  <button @click="handleLogout" class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              </div>
            </template>

            <template v-else>
              <router-link to="/login" class="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Login</router-link>
              <router-link to="/register" class="btn-primary">Register</router-link>
            </template>
          </div>

          <!-- Mobile menu button -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
        <router-link to="/" class="block text-gray-600 font-medium" @click="mobileOpen = false">Home</router-link>
        <template v-if="auth.isAuthenticated">
          <router-link to="/cart" class="block text-gray-600 font-medium" @click="mobileOpen = false">Cart ({{ cart.itemCount() }})</router-link>
          <router-link to="/wishlist" class="block text-gray-600 font-medium" @click="mobileOpen = false">Wishlist ({{ wishlist.items.length }})</router-link>
          <router-link to="/orders" class="block text-gray-600 font-medium" @click="mobileOpen = false">My Orders</router-link>
          <router-link to="/profile" class="block text-gray-600 font-medium" @click="mobileOpen = false">Profile</router-link>
          <router-link v-if="auth.isAdmin" to="/admin/dashboard" class="block text-indigo-600 font-medium" @click="mobileOpen = false">Admin Panel</router-link>
          <button @click="handleLogout" class="block text-red-600 font-medium w-full text-left">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="block text-gray-600 font-medium" @click="mobileOpen = false">Login</router-link>
          <router-link to="/register" class="block text-indigo-600 font-medium" @click="mobileOpen = false">Register</router-link>
        </template>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="border-t border-gray-800 pt-6 text-center text-sm">
          &copy; {{ new Date().getFullYear() }} ShopHub. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const router = useRouter()

const dropdownOpen = ref(false)
const mobileOpen = ref(false)

// Close dropdown on click outside
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

async function handleLogout() {
  await auth.logout()
  dropdownOpen.value = false
  mobileOpen.value = false
  router.push('/')
}

onMounted(() => {
  if (auth.isAuthenticated) {
    cart.fetchCart()
    wishlist.fetchWishlist()
  }
})
</script>

<style>
/* Page transition animations */
.page-enter-active {
  transition: all 0.3s ease-out;
}
.page-leave-active {
  transition: all 0.2s ease-in;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
