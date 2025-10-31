import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable, isProxy } from "../utils";

export default function setHandler(
  value: Set<any>,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  let shallow: Set<any>;

  if (cacheShallow.has(value)) {
    shallow = cacheShallow.get(value);
  } else {
    shallow = new Set(value);
    cacheShallow.set(value, shallow);
  }

  for (const each of shallow) {
    if (creatable(each)) {
      if (!cacheProxy.has(each)) {
        const newValue = createProxy(each, reRender, cacheProxy, cacheShallow, true);
        cacheProxy.set(newValue, newValue);
        shallow.delete(each);
        shallow.add(newValue);
      } else if (!isProxy(each)) {
        shallow.delete(each);
        shallow.add(cacheProxy.get(each));
      }
    }
  }

  return createProxy(shallow, reRender, cacheProxy, cacheShallow);
}
