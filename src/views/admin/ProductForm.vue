<template>
  <div class="max-w-2xl">
    <router-link to="/admin/products" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Products
    </router-link>

    <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ isEdit ? 'Edit Product' : 'Add Product' }}</h1>

    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" required class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" rows="4" required class="input-field" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input v-model="form.price" type="number" step="0.01" min="0" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input v-model="form.stock" type="number" min="0" required class="input-field" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="form.category_id" required class="input-field">
            <option value="" disabled>Select a category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input type="file" @change="onFileChange" accept="image/jpeg,image/png,image/jpg,image/gif" class="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          <p v-if="form.image_preview" class="mt-2 text-sm text-gray-500">Current: {{ form.image_preview }}</p>
        </div>

        <div class="flex items-center space-x-3 pt-2">
          <button type="submit" :disabled="submitting" class="btn-primary">
            {{ submitting ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}
          </button>
          <router-link to="/admin/products" class="btn-secondary">Cancel</router-link>
        </div>

        <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg p-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminApi, categoryApi } from '@/api'
import type { Category } from '@/types'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const categories = ref<Category[]>([])
const submitting = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  image: null as File | null,
  image_preview: '',
})

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.image = target.files[0]
  }
}

async function handleSubmit() {
  submitting.value = true
  error.value = ''

  const fd = new FormData()
  fd.append('name', form.name)
  fd.append('description', form.description)
  fd.append('price', form.price)
  fd.append('stock', form.stock)
  fd.append('category_id', form.category_id)
  if (form.image) {
    fd.append('image', form.image)
  }

  try {
    if (isEdit.value) {
      fd.append('_method', 'PUT')
      await adminApi.updateProduct(Number(route.params.id), fd)
    } else {
      await adminApi.storeProduct(fd)
    }
    router.push('/admin/products')
  } catch (err: any) {
    const msgs = err.response?.data?.errors
    error.value = msgs ? Object.values(msgs).flat().join(', ') : 'Failed to save product.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    categories.value = await categoryApi.list()
    if (isEdit.value && route.params.id) {
      const { productApi } = await import('@/api')
      const product = await productApi.show(Number(route.params.id))
      form.name = product.name
      form.description = product.description || ''
      form.price = String(product.price)
      form.stock = String(product.stock)
      form.category_id = String(product.category_id)
      form.image_preview = product.image || ''
    }
  } catch (err) {
    console.error('Failed to load form data:', err)
  }
})
</script>
