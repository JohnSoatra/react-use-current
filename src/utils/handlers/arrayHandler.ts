import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable, isProxy } from "../utils";

export default function arrayHandler(
  value: any[],
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  let shallow: any[];

  if (cacheShallow.has(value)) {
    shallow = cacheShallow.get(value);
  } else {
    shallow = [...value];
    cacheShallow.set(value, shallow);
  }

  for (let index = 0; index < shallow.length; index++) {
    const each = shallow[index];

    if (creatable(each) && !isProxy(each)) {
      if (cacheProxy.has(each)) {
        shallow[index] = cacheProxy.get(each);
      } else {
        shallow[index] = createProxy(each, reRender, cacheProxy, cacheShallow);
      }
    }
  }

  return createProxy(shallow, reRender, cacheProxy, cacheShallow);
}
