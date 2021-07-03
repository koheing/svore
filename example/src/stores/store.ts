import { defineStore } from 'svore'
import { createAuthStore } from './auth.store'
import { createCounterStore } from './counter.store'
import { createTodoStore } from './todo.store'

export const createStore = () => defineStore({
  counterStore: createCounterStore(),
  todoStore: createTodoStore(),
  authStore: createAuthStore(),
}, (modules) => ({
  userIdAndTodos: [modules.authStore.userId.value, modules.todoStore.todos.value],
  signedIn: modules.authStore.userId.value === ''
}))

export type Store = ReturnType<typeof createStore>
export type Modules = Store['modules']
