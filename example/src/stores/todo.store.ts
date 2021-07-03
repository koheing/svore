import { reactive, computed } from 'vue'
import { subscribeTodos } from '../services/todo.service'

export type TodoStore = ReturnType<typeof createTodoStore>
export const createTodoStore = () => {
  const state = reactive<{ todos: any[], unsubscribe: (() => void) | null  }>({
    todos: [],
    unsubscribe: null,
  })

  const todos = computed(() => state.todos)

  const subscribe = (userId: string) => {
    state.unsubscribe = subscribeTodos(userId, ({ type, data }) => {
      switch (type) {
        case 'added': {
          state.todos = [...state.todos, data]
          break
        }
        case 'modified': {
          const index = state.todos.findIndex((it) => it.id === data.id)
          if (index === -1) break
          state.todos.splice(index, 1, data)
          break
        }
        case 'removed': {
          const index = state.todos.findIndex((it) => it.id === data.id)
          if (index === -1) break
          state.todos.splice(index, 1)
          break
        }
      }
    })
    return reset
  }

  const reset = () => {
    state.unsubscribe?.()
    state.todos = []
  }

  return {
    todos,
    subscribe,
    reset
  }
}