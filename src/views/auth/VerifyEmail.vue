<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <div class="card text-center">
      <!-- Success from email link redirect -->
      <template v-if="status === 'verified'">
        <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
        <p class="text-gray-600 mb-6">Your email has been successfully verified. You can now access all features.</p>
        <router-link to="/" class="btn-primary inline-block">Go to Home</router-link>
      </template>

      <!-- Already verified -->
      <template v-else-if="status === 'already-verified'">
        <div class="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Already Verified</h1>
        <p class="text-gray-600 mb-6">Your email was already verified. No further action needed.</p>
        <router-link to="/" class="btn-primary inline-block">Go to Home</router-link>
      </template>

      <!-- Normal verify notice -->
      <template v-else>
        <div class="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
        <p class="text-gray-600 mb-2">
          Thanks for signing up! Before getting started, could you verify your email address by clicking the link we just emailed to you?
        </p>
        <p class="text-sm text-gray-500 mb-6">
          If you didn't receive the email, we will gladly send you another.
        </p>

        <div v-if="verificationSent" class="text-sm text-green-700 bg-green-50 rounded-lg p-3 mb-6">
          A new verification link has been sent to your email address.
        </div>

        <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-6">{{ error }}</p>

        <button
          @click="resend"
          :disabled="sending"
          class="btn-primary flex items-center justify-center mx-auto"
        >
          <svg v-if="sending" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ sending ? 'Sending...' : 'Resend Verification Email' }}
        </button>

        <div class="mt-6 flex items-center justify-center space-x-4 text-sm">
          <router-link to="/profile" class="text-indigo-600 hover:text-indigo-500 font-medium">Edit Profile</router-link>
          <span class="text-gray-300">|</span>
          <button @click="logout" class="text-red-600 hover:text-red-500 font-medium">Logout</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api'

const route = useRoute()
const auth = useAuthStore()
const router = useRouter()

const sending = ref(false)
const verificationSent = ref(false)
const error = ref('')

// Handle status from email verification redirect
const status = computed(() => route.query.status as string | undefined)

async function resend() {
  sending.value = true
  verificationSent.value = false
  error.value = ''
  try {
    await authApi.resendVerification()
    verificationSent.value = true
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to resend verification.'
  } finally {
    sending.value = false
  }
}

async function logout() {
  await auth.logout()
  router.push('/')
}
</script>
