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
    if (creatable(each) && !isProxy(each)) {
      let newValue;

      if (cacheProxy.has(each)) {
        newValue = cacheProxy.get(each);
      } else {
        newValue = createProxy(each, reRender, cacheProxy, cacheShallow);
      }

      shallow.delete(each);
      shallow.add(newValue);
    }
  }

  return createProxy(shallow, reRender, cacheProxy, cacheShallow);
}
