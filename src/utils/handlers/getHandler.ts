import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable } from "../utils";

export default function getHandler(
  value: Map<any, any> | WeakMap<any, any>,
  key: any,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  const result = value.get(key);

  if (creatable(result)) {
    return createProxy(result, reRender, cacheProxy, cacheShallow);
  }

  return result;
}
