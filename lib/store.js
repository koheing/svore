import { watch as w, inject as inj, reactive, computed, } from 'vue';
import { copy } from './util';
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
export function defineStore(modules, getters) {
    const _store = reactive(modules);
    let _unsubscribes = [];
    const _getters = (getters ? computed(() => copy(getters(modules))) : undefined);
    function on(mapper) {
        function filter(predicate) {
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
                trigger: (action, options) => _trigger(mapper, action, options, predicate),
            };
        }
        function watch(effect, options) {
            const target = () => copy(mapper({ modules: _store, getters: _getters }));
            const unwatch = w(target, effect, options);
            _unsubscribes.push(unwatch);
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
            trigger: (action, options) => _trigger(mapper, action, options),
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
        };
    }
    /**
     * Unsubscribe all trigger and watch function
     */
    function unwatchAll() {
        _unsubscribes.forEach((unsubscribe) => unsubscribe());
        _unsubscribes = [];
    }
    function _trigger(mapper, action, options, filter) {
        const target = () => copy(mapper({ modules: _store, getters: _getters }));
        const unwatch = w(target, async (newer, older, cleanUp) => {
            if (filter && !filter(newer, older))
                return;
            await action(_store)(newer, older, cleanUp);
        }, options);
        _unsubscribes.push(unwatch);
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
            return _getters;
        },
    };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function inject(key, type, name) {
    if (type === 'module' && name) {
        return inj(key)?.modules[name];
    }
    if (name)
        console.warn('Name property is defined, but it has no effect.');
    return inj(key)?.getters;
}
//# sourceMappingURL=store.js.map