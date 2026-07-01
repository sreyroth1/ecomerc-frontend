import { defineStore } from 'pinia'
import { ref } from 'vue'
import { wishlistApi } from '@/api'
import type { WishlistItem } from '@/types'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])

  async function fetchWishlist() {
    items.value = await wishlistApi.index()
  }

  async function addToWishlist(productId: number) {
    await wishlistApi.add(productId)
    await fetchWishlist()
  }

  async function removeFromWishlist(productId: number) {
    await wishlistApi.remove(productId)
    items.value = items.value.filter((i) => i.id !== productId)
  }

  function isWishlisted(productId: number) {
    return items.value.some((i) => i.id === productId)
  }

  return { items, fetchWishlist, addToWishlist, removeFromWishlist, isWishlisted }
})
