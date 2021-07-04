import { Ref, ComputedRef } from 'vue';
declare type PickKeysByType<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];
export declare type Action<T> = Pick<T, PickKeysByType<T, (...args: any[]) => any>>;
export declare type State<T> = Omit<T, PickKeysByType<T, (...args: any[]) => any>>;
export declare type Module = Record<string, unknown>;
export declare type Unref<T> = T extends Ref<infer V> ? V : T extends ComputedRef<infer R> ? R : T;
export {};
