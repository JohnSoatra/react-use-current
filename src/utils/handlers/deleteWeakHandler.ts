import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable, getRaw, isProxy } from "../utils";

export default function deleteWeakMapHandler(
  value: WeakMap<any, any> | WeakSet<any>,
  key: object,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  let deleted = value.delete(key);

  if (!deleted && creatable(key)) {
    if (isProxy(key)) {
      deleted = value.delete(getRaw(key));
    } else {
      deleted = value.delete(createProxy(key, reRender, cacheProxy, cacheShallow));
    }
  }

  if (deleted) {
    reRender();
  }

  return deleted;
}
