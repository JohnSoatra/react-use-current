import { mutationMethod } from "./utils";
import arrayHandler from "./handlers/arrayHandler";
import getHandler from "./handlers/getHandler";
import mapHandler from "./handlers/mapHandler";
import setHandler from "./handlers/setHandler";
import hasHandler from "./handlers/hasHandler";
import Labels from "../constants/labels";

export type ReRender = () => void;
export type CacheProxy = WeakMap<any, any>;
export type CacheShallow = WeakMap<any, any>;

export default function createProxy<T extends Record<string, any>>(
  content: T,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  saveProxy?: boolean
) {
  if (cacheProxy.has(content)) {
    saveProxy && console.log('in has', content);
    return cacheProxy.get(content);
  };

  saveProxy && console.log('no has', content);

  const proxy = new Proxy(content, {
    get(target, key, receiver) {
      if (key === Labels.IsProxy) {
        return true;
      }

      let value;

      try {
        value = Reflect.get(target, key, receiver);
      } catch {
        value = Reflect.get(target, key);
      }

      if (!(value === undefined || value === null)) {
        if (Array.isArray(value)) {
          return arrayHandler(value, reRender, cacheProxy, cacheShallow);
        } else if (typeof value === 'object') {
          if ((value as any) instanceof Map) {
            return mapHandler(value, reRender, cacheProxy, cacheShallow);
          }
          if ((value as any) instanceof Set) {
            return setHandler(value, reRender, cacheProxy, cacheShallow);
          }
          return createProxy(value, reRender, cacheProxy, cacheShallow);
        } else if (typeof value === 'function') {
          if (typeof key === 'string') {
            if (mutationMethod(target, key)) {
              return function (...args: any[]) {
                const result = (target as any)[key](...args);
                reRender();
                return result === target ? proxy : result;
              }
            } else if (
              key === 'get' &&
              (target instanceof Map || target instanceof Set)
            ) {
              return function (getKey: any) {
                return getHandler(target as any, getKey, reRender, cacheProxy, cacheShallow);
              }
            } else if (
              key === 'has' &&
              (target instanceof Map || target instanceof Set || target instanceof WeakMap || target instanceof WeakSet)
            ) {
              return function (item: any) {
                return hasHandler(target as any, item, reRender, cacheProxy, cacheShallow);
              }
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

  // if (saveProxy ?? true) {
  //   cacheProxy.set(content, proxy);
  // }

  return proxy;
}
