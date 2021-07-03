import { WatchCallback, WatchOptions, inject as inj, ComputedRef } from 'vue';
import { Module, Unref } from './type';
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
export declare function defineStore<T extends Record<string, Module>, S = undefined>(modules: T, getters?: (modules: T) => S): {
    modules: T;
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
    on: <U>(mapper: ({ modules, getters, }: {
        modules: T;
        getters: S extends undefined ? never : ComputedRef<S>;
    }) => U) => {
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
        trigger: (action: (modules: T) => WatchCallback<Unref<U>, Unref<U>>, options?: WatchOptions<boolean> | undefined) => void;
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
        filter: (predicate: (newer: Unref<U>, older: Unref<U>) => boolean) => {
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
            trigger: (action: (modules: T) => WatchCallback<Unref<U>, Unref<U>>, options?: WatchOptions<boolean> | undefined) => void;
        };
        /**
         * [`watch`](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiWatch.ts#L89) function on vue3
         * @example
         *  ```ts
         *  store
         *    .on(({ modules: it }) => it.authStore.userId)
         *    .watch((newId, oldId) => console.log)
         *  ```
         */
        watch: (effect: WatchCallback<Unref<U>, Unref<U> | undefined>, options?: WatchOptions<boolean> | undefined) => void;
    };
    unwatchAll: () => void;
    readonly getters: S extends undefined ? never : ComputedRef<S>;
};
/**
 * Like vue's inject.
 * @param key inject key
 * @param type 'module'
 * @param name module name
 */
export declare function inject<T>(key: Parameters<typeof inj>[0], type: 'module', name: string): T | undefined;
/**
 * Like vue's inject.
 * @param key inject key
 * @param type 'getter'
 * @param name undefined
 */
export declare function inject<T>(key: Parameters<typeof inj>[0], type: 'getter', name?: undefined): T | undefined;
