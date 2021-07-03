<template>
  <div>Todos</div>

  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { inject, State, Action } from 'svore'
import { defineComponent } from 'vue'
import { TodoStore } from '../stores/todo.store'
export default defineComponent({
  name: 'Todos',
  setup() {
    const store = inject<State<TodoStore>>('Store', 'module', 'todoStore') as State<TodoStore>

    return {
      todos: store.todos
    }
  }
})
</script>
