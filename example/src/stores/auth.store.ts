import { computed, onMounted, onUnmounted, reactive, toRef, watch } from 'vue'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from '../services/auth.service'
import { FirebaseUser } from '../services/firebase.service'

export type AuthStore = ReturnType<typeof createAuthStore>
export const createAuthStore = () => {
  const state = reactive<{ user: FirebaseUser }>({
    user: null,
  })

  const userId = computed(() => state.user?.uid ?? '')

  let unsubscribe: () => void
  onMounted(() => {
    unsubscribe = onAuthStateChanged((user) => {
      state.user = user
    })
  })

  onUnmounted(() => unsubscribe?.())

  return {
    userId,
    signInWithEmailAndPassword,
    signOut,
  }
}
