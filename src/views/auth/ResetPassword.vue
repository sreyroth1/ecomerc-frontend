<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p class="text-gray-500 mt-1">Enter your new password below.</p>
      </div>

      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required class="input-field" placeholder="you@example.com" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input v-model="password" type="password" required class="input-field" placeholder="Min. 8 characters" minlength="8" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input v-model="passwordConfirmation" type="password" required class="input-field" placeholder="Repeat password" />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5 flex items-center justify-center">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div v-if="success" class="mt-4 text-sm text-green-700 bg-green-50 rounded-lg p-3 text-center">
        {{ success }}
        <router-link to="/login" class="block mt-2 text-indigo-600 font-medium hover:text-indigo-500">Go to Login</router-link>
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '@/api'

const route = useRoute()

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

onMounted(() => {
  // Pre-fill email from query params if available
  if (route.query.email) {
    email.value = route.query.email as string
  }
})

async function handleResetPassword() {
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await authApi.resetPassword(
      email.value,
      password.value,
      passwordConfirmation.value,
      route.params.token as string,
    )
    success.value = res.message
  } catch (err: any) {
    const msgs = err.response?.data?.errors
    error.value = msgs ? Object.values(msgs).flat().join(', ') : (err.response?.data?.message || 'Failed to reset password.')
  } finally {
    loading.value = false
  }
}
</script>
