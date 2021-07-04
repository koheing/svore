export function copy<T>(target: T): T {
  if (typeof target === 'undefined' || typeof target === 'symbol') {
    return target
  }
  if (target === null) {
    return target
  }
  if (typeof target !== 'object') {
    return target
  }

  if (target instanceof Date) {
    return new Date(target) as unknown as T
  }

  if (target instanceof Array) {
    return target.map((it) => copy(it)) as unknown as T
  }

  return { ...target } as unknown as T
}
