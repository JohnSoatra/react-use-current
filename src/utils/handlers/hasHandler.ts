import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable } from "../utils";

export default function hasHandler(
  target: Map<any, any> | WeakMap<any, any> | Set<any> | WeakSet<any>,
  item: any,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  if (creatable(item)) {
    const proxy = createProxy(item, reRender, cacheProxy, cacheShallow, true);
    console.log(proxy);
    // console.log('in has', target, proxy);
    // console.log(target, proxy);
    // return target.has(proxy);
    return target.has(proxy);
  }

  return target.has(item);
}
