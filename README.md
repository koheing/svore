# svore

This library makes it easy to manage the stores created by composition-api because you can easily describe the process of linking between stores.  
This store is type safe.  

It is useful if 
- you use realtime-update service such as firestore.  
- make stores decoupled.

## Installation

```sh
npm i svore
```

## Usage

```html
<template>
  <router-view></router-view>
</template>

<script lang="ts">
  import { defineStore } from 'svore'
  import { defineComponent, onUnmounted } from 'vue'
  import { createStore } from './store'

  export default defineComponent({
    name: 'App',
    setup() {
      const store = createStore()

      store
        .on(({ modules }) => modules.userStore.userId)
        .filter((it) => it !== null && it !== '')  // option
        .trigger((modules) => modules.todoStore.subscribe)
        // or
        // .trigger((modules) => (newId, oldId, cleanUp) => {
        //  if (!newId) return
        //  const unsubscribe = modules.todoStore.subscribe(newId)
        //  cleanUp(unsubscribe)
        // })

      store
        .on(({ getters }) => getters.value.userIdAndTodos)
        .watch((newOne, oldOne) => console.log('[INFO]', newOne oldOne))

      onUnmounted(store.modules.unwatchAll)
      provide('key', store)
    }
  })
</script>
```

```html
<template>
  <div>...</div>
</template>

<script lang="ts">
  import { inject } from 'svore'
  import { State, TodoStore } from './store'

  export default defineComponent({
    name: 'Page',
    setup() {
      // inject is in this library
      const store = inject<Action<TodoStore>>('key', 'module', 'todoStore')
      const add = (todo: Todo) => store.add(todo)

      return {
        add,
      }
    },
  })
</script>
```

```ts
import { defineStore } from 'svore'
import { signInWithEmailAndPassword, signOut } from './services/auth.service'
import { add, subscribe } from './services/todo.service'
import { reactive, computed } from 'vue'

export const createStore = () =>
  defineStore(
    {
      userStore: userStore(),
      todoStore: todoStore(),
    },
    (modules) => ({
      userIdAndTodos: [modules.userStore.userId.value, modules.todoStore.todos.value],
    })
  )

export type UserStore = ReturnType<typeof userStore>
export type TodoStore = ReturnType<typeof todoStore>

function userStore() {
  const state = reactive<{ user: User | null }>({
    user: null,
  })

  const userId = computed(() => user?.id ?? '')

  const signIn = async (email: string, password: string) => {
    const user = await signInWithEmailAndPassword(email, password)

    state.user = user
  }

  const so = async () => {
    await signOut()

    state.user = null
  }

  return {
    state,
    userId,
    signIn,
    signOut: so,
  }
}

function todoStore() {
  const state = reactive<{ todos: ToDo[] }>({
    todos: [],
  })

  const todos = computed(() => state.todos)

  const addNewTodo = async (todo: Todo) => {
    await add(todo)
  }

  const subscribeTodos = (userId: UserId) => {
    subscribe(userId, (todo) => (state.todos = [...state.todos, todo]))
  }

  return {
    state,
    todos,
    addNewTodo,
    subscribeTodos,
  }
}
```

## Type Safe

![example](https://user-images.githubusercontent.com/55611095/123497694-e792cd80-d669-11eb-88d5-90bcb10e4034.gif)

## TODO
- [ ] Test
- [ ] Description of merit
- [ ] esm support
