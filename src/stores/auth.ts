import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password)
    user.value = res.user
    token.value = res.token
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    const res = await authApi.register(name, email, password, passwordConfirmation)
    user.value = res.user
    token.value = res.token
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // ignore
    }
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchProfile() {
    const data = await authApi.profile()
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  async function updateProfile(name: string, email: string) {
    const res = await authApi.updateProfile({ name, email })
    user.value = res.user
    localStorage.setItem('user', JSON.stringify(res.user))
  }

  async function changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
    await authApi.changePassword(currentPassword, newPassword, newPasswordConfirmation)
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
  }
})
