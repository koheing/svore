import { reactive, computed } from 'vue'

export type CounterStore = ReturnType<typeof createCounterStore>
export const createCounterStore = () => {
  const state = reactive({ value: 0 })

  const count = computed(() => state.value)

  const increment = () => {
    state.value++
  }

  const decrement = () => {
    state.value--
  }

  return {
    count,
    increment,
    decrement,
  }
}
