<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Modal -->
        <div
          ref="modalRef"
          class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <!-- Close button -->
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="grid md:grid-cols-2">
            <!-- Image -->
            <div class="aspect-square bg-gray-50">
              <img
                v-if="product.image"
                :src="modalImage"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>

            <!-- Details -->
            <div class="p-6 flex flex-col">
              <!-- Category -->
              <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full inline-block w-fit">
                {{ product.category?.name }}
              </span>

              <!-- Name -->
              <h2 class="text-xl font-bold text-gray-900 mt-3">{{ product.name }}</h2>

              <!-- Rating -->
              <div class="flex items-center space-x-1 mt-2">
                <template v-for="i in 5" :key="i">
                  <svg
                    class="w-4 h-4"
                    :class="i <= Math.round(product.reviews_avg_rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </template>
                <span class="text-xs text-gray-400 ml-1">
                  <template v-if="product.reviews_count && product.reviews_count > 0">
                    {{ Number(product.reviews_avg_rating).toFixed(1) }} ({{ product.reviews_count }})
                  </template>
                  <template v-else>No reviews</template>
                </span>
              </div>

              <!-- Price -->
              <p class="text-2xl font-bold text-indigo-600 mt-3">${{ Number(product.price).toFixed(2) }}</p>

              <!-- Stock -->
              <p class="text-sm mt-1">
                <span class="text-gray-400">Stock: </span>
                <span
                  class="font-medium"
                  :class="product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'"
                >
                  {{ product.stock > 0 ? product.stock + ' available' : 'Out of stock' }}
                </span>
              </p>

              <!-- Description -->
              <p class="text-sm text-gray-600 mt-4 leading-relaxed flex-1">
                {{ product.description }}
              </p>

              <!-- Actions -->
              <div class="mt-6 space-y-3">
                <!-- Quantity + Add to Cart -->
                <div v-if="auth.isAuthenticated && product.stock > 0" class="flex items-center space-x-3">
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button
                      @click="qty = Math.max(1, qty - 1)"
                      class="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
                    >−</button>
                    <span class="px-3 py-1.5 font-medium min-w-[2.5rem] text-center text-sm">{{ qty }}</span>
                    <button
                      @click="qty = Math.min(product.stock, qty + 1)"
                      class="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
                    >+</button>
                  </div>
                  <button
                    @click="addToCart"
                    :disabled="addingToCart"
                    class="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
                  >
                    <svg v-if="addingToCart" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    <span>{{ addingToCart ? 'Adding...' : 'Add to Cart' }}</span>
                  </button>
                </div>

                <!-- Login prompt -->
                <p v-if="!auth.isAuthenticated" class="text-sm text-gray-500 text-center">
                  <router-link to="/login" class="text-indigo-600 font-medium">Login</router-link> to add to cart
                </p>

                <!-- View full detail -->
                <router-link
                  :to="`/products/${product.id}`"
                  class="block text-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                  @click="$emit('close')"
                >
                  View full details →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  visible: boolean
  product: Product
}>()

const emit = defineEmits<{
  close: []
}>()

const auth = useAuthStore()
const cartStore = useCartStore()

const qty = ref(1)
const addingToCart = ref(false)

const modalImage = computed(() => {
  if (!props.product.image) return ''
  if (props.product.image.startsWith('http')) return props.product.image
  return `/storage/${props.product.image}`
})

async function addToCart() {
  addingToCart.value = true
  try {
    await cartStore.addToCart(props.product.id, qty.value)
  } catch (err) {
    console.error('Add to cart failed:', err)
  } finally {
    addingToCart.value = false
  }
}
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.25s ease-out;
}
.modal-leave-active {
  transition: all 0.2s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
