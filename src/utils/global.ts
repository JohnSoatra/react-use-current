export function createGlobalVariable<T extends WeakMap<any, any>>(
  name: symbol,
  value: T,
  warning: string,
) {
  const global = globalThis as any;
  if (!global[name]) {
    global[name] = value;
  } else if (!(global[name] instanceof WeakMap)) {
    console.warn(`[react-use-current] ${warning} `);
    global[name] = value;
  }
  return global[name] as T;
}
