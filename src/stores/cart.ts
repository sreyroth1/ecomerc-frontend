import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cartApi } from '@/api'
import type { CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  async function fetchCart() {
    items.value = await cartApi.index()
  }

  async function addToCart(productId: number, quantity: number) {
    await cartApi.add(productId, quantity)
    await fetchCart()
  }

  async function updateItem(id: number, quantity: number) {
    const res = await cartApi.update(id, quantity)
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx !== -1) {
      items.value[idx] = res.item
    }
  }

  async function removeItem(id: number) {
    await cartApi.remove(id)
    items.value = items.value.filter((i) => i.id !== id)
  }

  const totalAmount = () => items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = () => items.value.reduce((sum, item) => sum + item.quantity, 0)

  return { items, fetchCart, addToCart, updateItem, removeItem, totalAmount, itemCount }
})
