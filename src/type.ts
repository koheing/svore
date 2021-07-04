import { Ref, ComputedRef } from 'vue'

type PickKeysByType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<T> = Pick<T, PickKeysByType<T, (...args: any[]) => any>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type State<T> = Omit<T, PickKeysByType<T, (...args: any[]) => any>>

export type Module = Record<string, unknown>
export type Unref<T> = T extends Ref<infer V> ? V : T extends ComputedRef<infer R> ? R : T
