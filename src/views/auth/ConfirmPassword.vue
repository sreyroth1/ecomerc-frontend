<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <div class="card text-center">
      <div class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Confirm Password</h1>
      <p class="text-gray-600 mb-6">
        This is a secure area of the application. Please confirm your password before continuing.
      </p>

      <form @submit.prevent="handleConfirm" class="max-w-sm mx-auto space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" required class="input-field" placeholder="Enter your password" />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5 flex items-center justify-center">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Confirming...' : 'Confirm Password' }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authApi } from '@/api'

const router = useRouter()
const route = useRoute()

const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleConfirm() {
  loading.value = true
  error.value = ''
  try {
    const res = await authApi.confirmPassword(password.value)
    const redirect = (route.query.redirect as string) || '/profile'
    router.push(redirect)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Incorrect password.'
  } finally {
    loading.value = false
  }
}
</script>
