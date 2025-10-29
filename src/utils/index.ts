import { MutationMethods } from "../constants";

function mutationMethod(obj: any, key: string) {
  const list = MutationMethods.get(obj.constructor);
  return list ? list.includes(key) : false;
}
export function createProxy<T extends Record<string, any>>(
  content: T,
  reRender: () => void,
  cache: WeakMap<any, any>,
) {
  if (cache.has(content)) {
    return cache.get(content);
  };

  const proxy = new Proxy(content, {
    get(target, key) {
      const value = Reflect.get(target, key);

      if (!(value === undefined || value === null)) {
        if (typeof value === 'object') {
          return createProxy(value, reRender, cache);
        } else if (typeof value === 'function') {
          if (typeof key === 'string' && mutationMethod(target, key)) {
            return function (...args: any[]) {
              const result = (target as any)[key](...args);
              reRender();
              return result === target ? proxy : result;
            }
          }

          return (value as Function).bind(target);
        }
      }

      return value;
    },
    set(target, key, value, receiver) {
      const currentValue = (target as any)[key];
      const result = Reflect.set(target, key, value, receiver);

      if (currentValue !== value && result) {
        reRender();
      };

      return result;
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
        reRender();
      };

      return result;
    }
  });

  cache.set(content, proxy);

  return proxy;
}
