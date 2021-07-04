<template>
  <h1>SignIn</h1>
  <div class="form">
    <input v-model="email" placeholder="email" />
    <input v-model="password" placeholder="password" />
    <button :disabled="invalid" @click="signIn">Sign In</button>
  </div>
</template>

<script lang="ts">
import { inject } from 'svore'
import { computed, defineComponent, onUnmounted, reactive, toRefs, watch } from 'vue'
import { AuthStore } from '../stores/auth.store'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'SignIn',
  setup() {
    const store = inject<AuthStore>('Store', 'module', 'authStore') as AuthStore
    const router = useRouter()
    const unwatch = watch(store.userId, (userId) => {
      if (userId === '') return
      router.push('/todos')
    })

    const state = reactive({
      password: '',
      email: '',
    })

    const invalid = computed(() => state.password === '' || state.email === '')

    const signIn = async () => {
      await store.signInWithEmailAndPassword(state.email, state.password)
    }

    onUnmounted(() => unwatch)

    return {
      ...toRefs(state),
      invalid,
      signIn,
    }
  },
})
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

input {
  margin: 1rem 0;
}
</style>
