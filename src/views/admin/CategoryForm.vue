<template>
  <div class="max-w-xl">
    <router-link to="/admin/categories" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Categories
    </router-link>

    <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ isEdit ? 'Edit Category' : 'Add Category' }}</h1>

    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" required class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="input-field" />
        </div>

        <div class="flex items-center space-x-3 pt-2">
          <button type="submit" :disabled="submitting" class="btn-primary">
            {{ submitting ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category') }}
          </button>
          <router-link to="/admin/categories" class="btn-secondary">Cancel</router-link>
        </div>

        <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg p-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminApi } from '@/api'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  description: '',
})

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  try {
    if (isEdit.value) {
      await adminApi.updateCategory(Number(route.params.id), form)
    } else {
      await adminApi.storeCategory(form)
    }
    router.push('/admin/categories')
  } catch (err: any) {
    const msgs = err.response?.data?.errors
    error.value = msgs ? Object.values(msgs).flat().join(', ') : 'Failed to save category.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (isEdit.value && route.params.id) {
    try {
      const categories = await (await import('@/api')).categoryApi.list()
      const cat = categories.find((c) => c.id === Number(route.params.id))
      if (cat) {
        form.name = cat.name
        form.description = cat.description || ''
      }
    } catch (err) {
      console.error('Failed to load category:', err)
    }
  }
})
</script>
