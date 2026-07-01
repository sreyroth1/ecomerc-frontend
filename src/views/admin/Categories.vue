<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
      <router-link to="/admin/categories/create" class="btn-primary">
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Category
      </router-link>
    </div>

    <div v-if="loading" class="card animate-pulse">
      <div class="h-48 bg-gray-200 rounded" />
    </div>

    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-200">
              <th class="pb-3 font-medium">ID</th>
              <th class="pb-3 font-medium">Name</th>
              <th class="pb-3 font-medium">Description</th>
              <th class="pb-3 font-medium">Products Count</th>
              <th class="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-gray-500">{{ cat.id }}</td>
              <td class="py-3 font-medium text-gray-900">{{ cat.name }}</td>
              <td class="py-3 text-gray-600 max-w-xs truncate">{{ cat.description || '—' }}</td>
              <td class="py-3">{{ cat.products_count ?? '—' }}</td>
              <td class="py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <router-link :to="`/admin/categories/${cat.id}/edit`" class="text-indigo-600 hover:text-indigo-800 font-medium">
                    Edit
                  </router-link>
                  <button @click="confirmDelete(cat)" class="text-red-600 hover:text-red-800 font-medium">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination" class="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <p class="text-sm text-gray-500">
          Showing {{ pagination.from }}–{{ pagination.to }} of {{ pagination.total }}
        </p>
        <div class="flex space-x-2">
          <button
            :disabled="!pagination.prev_page_url"
            @click="loadPage(currentPage - 1)"
            class="btn-secondary btn-sm"
          >Previous</button>
          <button
            :disabled="!pagination.next_page_url"
            @click="loadPage(currentPage + 1)"
            class="btn-secondary btn-sm"
          >Next</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="deleteTarget = null">
      <div class="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Category</h3>
        <p class="text-gray-600 text-sm">Are you sure you want to delete "{{ deleteTarget.name }}"? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="deleteTarget = null" class="btn-secondary">Cancel</button>
          <button @click="handleDelete" :disabled="deleting" class="btn-danger">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'
import type { Category } from '@/types'

const categories = ref<(Category & { products_count?: number })[]>([])
const loading = ref(true)
const pagination = ref<{ from: number; to: number; total: number; prev_page_url: string | null; next_page_url: string | null } | null>(null)
const currentPage = ref(1)

const deleteTarget = ref<Category | null>(null)
const deleting = ref(false)

async function loadPage(page: number) {
  loading.value = true
  try {
    const res = await adminApi.categories(page)
    categories.value = res.data
    pagination.value = {
      from: res.from || 0,
      to: res.to || 0,
      total: res.total,
      prev_page_url: res.current_page > 1 ? 'yes' : null,
      next_page_url: res.current_page < res.last_page ? 'yes' : null,
    }
    currentPage.value = page
  } catch (err) {
    console.error('Failed to load categories:', err)
  } finally {
    loading.value = false
  }
}

function confirmDelete(cat: Category) {
  deleteTarget.value = cat
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await adminApi.deleteCategory(deleteTarget.value.id)
    deleteTarget.value = null
    await loadPage(currentPage.value)
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete category.')
  } finally {
    deleting.value = false
  }
}

onMounted(() => loadPage(1))
</script>
