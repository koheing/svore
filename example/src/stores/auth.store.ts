import { computed, onMounted, onUnmounted, reactive, toRef, watch } from 'vue'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from '../services/auth.service'
import { FirebaseUser } from '../services/firebase.service'

export type AuthStore = ReturnType<typeof createAuthStore>
export const createAuthStore = () => {
  const state = reactive<{ user: FirebaseUser; unsubscribe?: () => void }>({
    user: null,
  })

  const userId = computed(() => state.user?.uid ?? '')

  onMounted(() => {
    state.unsubscribe = onAuthStateChanged((user) => {
      state.user = user
    })
  })

  onUnmounted(() => {
    state.unsubscribe?.()
    state.unsubscribe = undefined
    state.user = null
  })

  return {
    userId,
    signInWithEmailAndPassword,
    signOut,
  }
}
