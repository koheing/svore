import {
  watch as w,
  WatchCallback,
  WatchOptions,
  inject as inj,
  reactive,
  computed,
  ComputedRef,
} from 'vue'
import { Module, Unref } from './type'
import { copy } from './util'

/**
 * Define store
 * @param modules Record<string, `store created with composition api`>
 * @param getters (modules: T) => Record<string, unknown>. Do not include anything like ComputedRef in the return value, please.
 * @example
   type Store = ReturnType<typeof createStore>
   type Keys = keyof Store['modules']
   type Getters = Store['getters']

   function createStore() {
      return defineStore({
        authStore: useAuthStore(),
        counterStore: counterStore(),
        debugStore: debugStore(),
        todoStore: todoStore()
      }, (modules) => ({
        userIdAndTeamId: [modules.authStore.userId, modules.teamStore.selectedTeamId]
      }))
 */
export function defineStore<T extends Record<string, Module>, S = undefined>(
  modules: T,
  getters?: (modules: T) => S
) {
  const _store = reactive(modules)
  let _unsubscribes: (() => void)[] = []
  const _getters = (
    getters ? computed(() => copy(getters(modules))) : undefined
  ) as S extends undefined ? never : ComputedRef<S>

  function on<U>(
    mapper: ({
      modules,
      getters,
    }: {
      modules: T
      getters: S extends undefined ? never : ComputedRef<S>
    }) => U
  ) {
    let _predicate: ((newer: Unref<U>, older?: Unref<U>) => boolean) | null = null

    function trigger(
      action: (modules: T) => WatchCallback<Unref<U>, Unref<U>>,
      options?: WatchOptions
    ) {
      const target = () => copy(mapper({ modules: _store as T, getters: _getters })) as Unref<U>
      const unwatch = w(
        target,
        async (newer, older, cleanUp) => {
          if (_predicate && !_predicate(newer, older)) return
          await action(_store as T)(newer as Unref<U>, older as Unref<U>, cleanUp)
        },
        options
      )
      _unsubscribes.push(unwatch)

      return {
        /**
         * Trigger other action, like `dispatch` on Vuex
         * @example
         *   ```ts
         *   store
         *     .on(({ modules: it }) => it.authStore.userId)
         *     .trigger((it) => it.profileStore.findByUserId)
         *
         *   store
         *     .on(({ getters: it }) => it.userIdAndTeamId)
         *     .trigger((it) =>
         *       ([newUserId, newTeamId], _, cleanUp) => {
         *         if (!newUserId || !newTeamId) return
         *         const unsubscribe = it.teamStore.subscribe(newUserId, newTeamId)
         *         cleanUp(unsubscribe)
         *   ```
         */
        trigger,
      }
    }

    function filter(predicate: (newer: Unref<U>, older: Unref<U>) => boolean) {
      _predicate = predicate as (newer: Unref<U>, older?: Unref<U>) => boolean
      return {
        /**
         * Trigger other action, like `dispatch` on Vuex
         * @example
         *   ```ts
         *   store
         *     .on(({ modules: it }) => it.authStore.userId)
         *     .trigger((it) => it.profileStore.findByUserId)
         *
         *   store
         *     .on(({ getters: it }) => it.userIdAndTeamId)
         *     .trigger((it) =>
         *       ([newUserId, newTeamId], _, cleanUp) => {
         *         if (!newUserId || !newTeamId) return
         *         const unsubscribe = it.teamStore.subscribe(newUserId, newTeamId)
         *         cleanUp(unsubscribe)
         *   ```
         */
        trigger,
      }
    }

    function watch(effect: WatchCallback<Unref<U>, Unref<U> | undefined>, options?: WatchOptions) {
      const target = () => copy(mapper({ modules: _store as T, getters: _getters }))
      const unwatch = w(
        target as () => Unref<U>,
        effect as WatchCallback<Unref<U>, Unref<U> | undefined>,
        options
      )
      _unsubscribes.push(unwatch)

      return {
        /**
         * [`watch`](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiWatch.ts#L89) function on vue3
         * @example
         *  ```ts
         *  store
         *    .on(({ modules: it }) => it.authStore.userId)
         *    .watch((newId, oldId) => console.log)
         *  ```
         */
        watch,
      }
    }

    return {
      /**
       * Trigger other action, like `dispatch` on Vuex
       * @example
       *   ```ts
       *   store
       *     .on(({ modules: it }) => it.authStore.userId)
       *     .trigger((it) => it.profileStore.findByUserId)
       *
       *   store
       *     .on(({ getters: it }) => it.userIdAndTeamId)
       *     .trigger((it) =>
       *       ([newUserId, newTeamId], _, cleanUp) => {
       *         if (!newUserId || !newTeamId) return
       *         const unsubscribe = it.teamStore.subscribe(newUserId, newTeamId)
       *         cleanUp(unsubscribe)
       *   ```
       */
      trigger,
      /**
       * Filter before trigger
       * @example
       *   ```ts
       *   store
       *     .on(({ modules: it }) => it.authStore.userId)
       *     .filter((it) => it !== null)
       *     .trigger((it) => it.profileStore.findByUserId)
       *   ```
       */
      filter,
      /**
       * [`watch`](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiWatch.ts#L89) function on vue3
       * @example
       *  ```ts
       *  store
       *    .on(({ modules: it }) => it.authStore.userId)
       *    .watch((newId, oldId) => console.log)
       *  ```
       */
      watch,
    }
  }

  /**
   * Unsubscribe all trigger and watch function
   */
  function unwatchAll(): void {
    _unsubscribes.forEach((unsubscribe) => unsubscribe())
    _unsubscribes = []
  }

  return {
    modules,
    /**
     *
     * @param mapper Map to property you'd like to watch or trigger. Do not include anything like ComputedRef in the return value, please.
     * @example
     *   ```ts
     *   store
     *     .on(({ modules: it }) => it.authStore.userId)
     *     .watch((newId, oldId) => console.log)
     *
     *   store
     *     .on(({ getters: it }) => it.userIdAndTeamId)
     *     .trigger((it) =>
     *       ([newUserId, newTeamId], _, cleanUp) => {
     *         if (!newUserId || !newTeamId) return
     *         const unsubscribe = it.teamStore.subscribe(newUserId, newTeamId)
     *         cleanUp(unsubscribe)
     *       })
     *    ```
     */
    on,
    unwatchAll,
    get getters() {
      return _getters
    },
  }
}

/**
 * Like vue's inject.
 * @param key inject key
 * @param type 'module'
 * @param name module name
 */
export function inject<T>(
  key: Parameters<typeof inj>[0],
  type: 'module',
  name: string
): T | undefined
/**
 * Like vue's inject.
 * @param key inject key
 * @param type 'getter'
 * @param name undefined
 */
export function inject<T>(
  key: Parameters<typeof inj>[0],
  type: 'getter',
  name?: undefined
): T | undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function inject<T = any>(key: any, type: any, name: any): T | undefined {
  if (type === 'module' && name) {
    return (
      inj(key) as Record<string, unknown> & {
        modules: Record<string, unknown>
      }
    )?.modules[name] as T | undefined
  }
  if (name) console.warn('Name property is defined, but it has no effect.')
  return (
    inj(key) as Record<string, unknown> & {
      getters: Record<string, unknown>
    }
  )?.getters as T | undefined
}
