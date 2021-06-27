import { Ref, ComputedRef } from 'vue'

type PickKeysByType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]
export type Action<T> = Pick<T, PickKeysByType<T, Function>>
export type State<T> = Omit<T, PickKeysByType<T, Function>>

export type Module = Record<string, unknown>
export type Unref<T> = T extends Ref<infer V> ? V : T extends ComputedRef<infer R> ? R : T
