import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable, getRaw, isProxy } from "../utils";

export default function hasWeakMapHandler(
  value: WeakMap<any, any> | WeakSet<any>,
  key: object,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  let hasValue = value.has(key);

  if (!hasValue && creatable(key)) {
    if (isProxy(key)) {
      hasValue = value.has(getRaw(key));
    } else {
      hasValue = value.has(createProxy(key, reRender, cacheProxy, cacheShallow));
    }
  }

  return hasValue;
}
