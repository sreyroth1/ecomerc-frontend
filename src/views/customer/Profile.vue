<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

    <!-- Profile Info -->
    <div class="card mb-6">
      <h2 class="font-semibold text-lg mb-4">Profile Information</h2>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="profileForm.name" type="text" required class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="profileForm.email" type="email" required class="input-field" />
        </div>
        <button type="submit" :disabled="profileLoading" class="btn-primary">
          {{ profileLoading ? 'Saving...' : 'Save Changes' }}
        </button>
        <p v-if="profileSuccess" class="text-sm text-green-600">{{ profileSuccess }}</p>
        <p v-if="profileError" class="text-sm text-red-600">{{ profileError }}</p>
      </form>
    </div>

    <!-- Change Password -->
    <div class="card">
      <h2 class="font-semibold text-lg mb-4">Change Password</h2>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input v-model="passwordForm.current" type="password" required class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input v-model="passwordForm.newPass" type="password" required class="input-field" minlength="8" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input v-model="passwordForm.confirm" type="password" required class="input-field" />
        </div>
        <button type="submit" :disabled="passwordLoading" class="btn-primary">
          {{ passwordLoading ? 'Updating...' : 'Update Password' }}
        </button>
        <p v-if="passwordSuccess" class="text-sm text-green-600">{{ passwordSuccess }}</p>
        <p v-if="passwordError" class="text-sm text-red-600">{{ passwordError }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const profileForm = reactive({ name: '', email: '' })
const profileLoading = ref(false)
const profileSuccess = ref('')
const profileError = ref('')

const passwordForm = reactive({ current: '', newPass: '', confirm: '' })
const passwordLoading = ref(false)
const passwordSuccess = ref('')
const passwordError = ref('')

onMounted(() => {
  if (auth.user) {
    profileForm.name = auth.user.name
    profileForm.email = auth.user.email
  }
})

async function updateProfile() {
  profileLoading.value = true
  profileSuccess.value = ''
  profileError.value = ''
  try {
    await auth.updateProfile(profileForm.name, profileForm.email)
    profileSuccess.value = 'Profile updated successfully.'
  } catch (err: any) {
    const msgs = err.response?.data?.errors
    profileError.value = msgs ? Object.values(msgs).flat().join(', ') : 'Failed to update profile.'
  } finally {
    profileLoading.value = false
  }
}

async function changePassword() {
  if (passwordForm.newPass !== passwordForm.confirm) {
    passwordError.value = 'Passwords do not match.'
    return
  }
  passwordLoading.value = true
  passwordSuccess.value = ''
  passwordError.value = ''
  try {
    await auth.changePassword(passwordForm.current, passwordForm.newPass, passwordForm.confirm)
    passwordSuccess.value = 'Password changed successfully.'
    passwordForm.current = ''
    passwordForm.newPass = ''
    passwordForm.confirm = ''
  } catch (err: any) {
    passwordError.value = err.response?.data?.message || 'Failed to change password.'
  } finally {
    passwordLoading.value = false
  }
}
</script>
