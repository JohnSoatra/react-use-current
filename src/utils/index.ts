import { MutationMethods } from "../constants";

function mutationFunction(obj: any, key: string) {
  const list = MutationMethods.get(obj.constructor);

  if (list) {
    return list.includes(key);
  }

  return false;
}
export function createProxy<T extends Record<string, any>>(
  content: T,
  reRender: () => void,
  _cache: WeakMap<any, any> = new WeakMap(),
) {
  if (_cache.has(content)) {
    return _cache.get(content);
  };

  const proxy = new Proxy(content, {
    get(target, key, receiver) {
      let value = Reflect.get(target, key, receiver);

      if (!(value === undefined || value === null)) {
        if (typeof value === 'object') {
          return createProxy(value, reRender, _cache);
        } else if (typeof value === 'function') {
          if (typeof key === 'string' && mutationFunction(target, key)) {
            return function (...args: any[]) {
              const result = (target as any)[key](...args);
              reRender();
              return result === target ? proxy : result;
            }
          } else {
            return (value as Function).bind(target);
          }
        }
      }

      return value;
    },
    set(target, key, value, receiver) {
      const currentValue = (target as any)[key];
      const newValue = Reflect.set(target, key, value, receiver);

      if (currentValue !== value) {
        reRender();
      };

      return newValue;
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey) {
        reRender();
      };

      return result;
    }
  });

  _cache.set(content, proxy);

  return proxy;
}
