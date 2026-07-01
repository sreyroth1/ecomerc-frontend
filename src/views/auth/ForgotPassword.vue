<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p class="text-gray-500 mt-1">No worries. Enter your email and we'll send you a reset link.</p>
      </div>

      <form @submit.prevent="handleForgotPassword" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required class="input-field" placeholder="you@example.com" />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5 flex items-center justify-center">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div v-if="success" class="mt-4 text-sm text-green-700 bg-green-50 rounded-lg p-3 text-center">
        {{ success }}
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3 text-center">{{ error }}</p>

      <p class="mt-6 text-center text-sm text-gray-500">
        Remember your password?
        <router-link to="/login" class="text-indigo-600 font-medium hover:text-indigo-500">Back to Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authApi } from '@/api'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleForgotPassword() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await authApi.forgotPassword(email.value)
    success.value = res.message
  } catch (err: any) {
    error.value = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Failed to send reset link.'
  } finally {
    loading.value = false
  }
}
</script>
