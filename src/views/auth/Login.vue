<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p class="text-gray-500 mt-1">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="input-field"
            :class="{ 'border-red-400 focus:ring-red-500 focus:border-red-500': validationError }"
            placeholder="you@example.com"
            @input="clearError"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <router-link to="/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
              Forgot password?
            </router-link>
          </div>
          <input
            v-model="password"
            type="password"
            required
            class="input-field"
            :class="{ 'border-red-400 focus:ring-red-500 focus:border-red-500': validationError }"
            placeholder="••••••••"
            minlength="1"
            @input="clearError"
          />
        </div>

        <!-- Error message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-red-800">{{ errorTitle }}</p>
            <p class="text-sm text-red-600 mt-0.5">{{ error }}</p>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5 flex items-center justify-center text-base">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        Don't have an account?
        <router-link to="/register" class="text-indigo-600 font-medium hover:text-indigo-500">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const validationError = computed(() => !!error.value)
const errorTitle = computed(() => {
  if (error.value.includes('credentials') || error.value.includes('Invalid')) {
    return 'Invalid Credentials'
  }
  if (error.value.includes('validation')) {
    return 'Validation Error'
  }
  return 'Login Failed'
})

function clearError() {
  error.value = ''
}

async function handleLogin() {
  // Client-side validation
  if (!email.value.trim()) {
    error.value = 'Please enter your email address.'
    return
  }
  if (!password.value) {
    error.value = 'Please enter your password.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (err: any) {
    if (err.response?.status === 422) {
      const msgs = err.response?.data?.errors
      if (msgs) {
        error.value = Object.values(msgs).flat().join('. ')
      } else {
        error.value = err.response?.data?.message || 'Please check your email and password and try again.'
      }
    } else if (err.response?.status === 401) {
      error.value = err.response?.data?.message || 'The email or password you entered is incorrect.'
    } else if (err.response?.status === 429) {
      error.value = 'Too many login attempts. Please wait a moment and try again.'
    } else {
      error.value = err.response?.data?.message || 'Unable to connect to the server. Please check your connection and try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>
