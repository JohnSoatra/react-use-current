import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable, getRaw, isProxy } from "../utils";

export default function getWeakMapHandler(
  value: WeakMap<any, any>,
  key: object,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  let result = value.get(key);

  if (!result && creatable(key)) {
    if (isProxy(key)) {
      result = value.get(getRaw(key));
    } else {
      result = value.get(createProxy(key, reRender, cacheProxy, cacheShallow));
    }
  }

  if (creatable(result)) {
    return createProxy(result, reRender, cacheProxy, cacheShallow);
  }

  return result;
}
