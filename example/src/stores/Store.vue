<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import { createStore } from '../stores/store'

export default defineComponent({
  name: 'Store',
  setup() {
    const store = createStore()

    store
      .on(({ modules }) => modules.authStore.userId)
      .filter((it) => it !== '')
      .trigger((it) => (userId, _, cleanUp) => cleanUp(it.todoStore.subscribe(userId)))

    store
      .on(({ getters }) => getters)
      .watch((newer, older) => console.log('getters', 'before:', older, 'after:', newer))

    provide('Store', store)
  },
})
</script>
