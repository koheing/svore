export function deepCopy(target) {
    if (typeof target === 'undefined' || typeof target === 'symbol') {
        return target;
    }
    if (target === null) {
        return target;
    }
    if (typeof target !== 'object') {
        return target;
    }
    if (target instanceof Date) {
        return new Date(target);
    }
    if (target instanceof Array) {
        return target.map((it) => deepCopy(it));
    }
    const newObject = { ...target };
    return newObject;
}
//# sourceMappingURL=util.js.map