import { isArray, isProxy, mutationMethod } from "./utils";
import Symbols from "../constants/symbols";
import Keys from "../constants/keys";
import arrayHandler from "./handlers/arrayHandler";
import mapHandler from "./handlers/mapHandler";
import setHandler from "./handlers/setHandler";
import mutationHandler from "./handlers/mutationHandler";
import getWeakMapHandler from "./handlers/getWeakHandler";
import hasWeakMapHandler from "./handlers/hasWeakHandler";
import deleteWeakMapHandler from "./handlers/deleteWeakHandler";
import defaultHandler from "./handlers/defaultHandler";

export type ReRender = () => void;
export type CacheProxy = WeakMap<object, any>;
export type CacheShallow = WeakMap<object, any>;

export default function createProxy<T extends Record<string, any>>(
  content: T,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  if (isProxy(content)) {
    return content;
  } else if (cacheProxy.has(content)) {
    return cacheProxy.get(content);
  };

  const proxy = new Proxy(content, {
    get(target: any, key, receiver) {
      if (key === Symbols.IsProxy) {
        return true;
      } else if (key === Symbols.RawObject) {
        return content;
      }

      let value: any;

      try {
        value = Reflect.get(target, key, receiver);
      } catch {
        value = Reflect.get(target, key);
      }

      if (
        !(value === undefined || value === null) &&
        (
          isArray(value) ||
          typeof value === 'object' ||
          typeof value === 'function'
        )
      ) {
        if (isArray(value)) {
          return arrayHandler(value, reRender, cacheProxy, cacheShallow);
        } else if (typeof value === 'object') {
          if (value instanceof Map) {
            return mapHandler(value, reRender, cacheProxy, cacheShallow);
          }
          if (value instanceof Set) {
            return setHandler(value, reRender, cacheProxy, cacheShallow);
          }
          return createProxy(value, reRender, cacheProxy, cacheShallow);
        }
        if (typeof key === 'string') {
          if (key === Keys.Get && value instanceof WeakMap) {
            return function (getKey: any) {
              return getWeakMapHandler(target, getKey, reRender, cacheProxy, cacheShallow);
            }
          } else if (
            key === Keys.Has &&
            (value instanceof WeakMap || value instanceof WeakSet)
          ) {
            return function (hasKey: any) {
              return hasWeakMapHandler(target, hasKey, reRender, cacheProxy, cacheShallow);
            }
          } else if (
            key === Keys.Delete &&
            (value instanceof WeakMap || value instanceof WeakSet)
          ) {
            return function (deleteKey: any) {
              return deleteWeakMapHandler(target, deleteKey, reRender, cacheProxy, cacheShallow);
            }
          } else if (mutationMethod(target, key)) {
            return function (...args: any[]) {
              return mutationHandler(proxy, target, key, reRender, cacheProxy, cacheShallow, ...args);
            }
          }
        }

        return function (...args: any[]) {
          return defaultHandler(proxy, target, key, reRender, cacheProxy, cacheShallow, ...args);
        }
      }

      return value;
    },
    set(target, key, value, receiver) {
      const currentValue = target[key];
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

  cacheProxy.set(content, proxy);

  return proxy;
}
