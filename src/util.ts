export function deepCopy<T>(target: T): T {
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
    return new Date(target) as any
  }

  if (target instanceof Array) {
    return target.map((it) => deepCopy(it)) as unknown as T
  }

  const newObject: Record<string, any> = { ...target }
  return newObject as unknown as T
}
