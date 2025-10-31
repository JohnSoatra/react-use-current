import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable, isProxy } from "../utils";

export default function arrayHandler(
  value: any[],
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  let shallow;

  if (cacheShallow.has(value)) {
    shallow = cacheShallow.get(value);
  } else {
    shallow = [...value];
    cacheShallow.set(value, shallow);
  }

  for (let index = 0; index < shallow.length; index++) {
    const each = shallow[index];

    if (creatable(each)) {
      if (!cacheProxy.has(each)) {
        const newValue = createProxy(each, reRender, cacheProxy, cacheShallow, false);
        cacheProxy.set(newValue, newValue);
        shallow[index] = newValue;
      } else if (!isProxy(each)) {
        shallow[index] = cacheProxy.get(each);
      }
    }
  }

  return createProxy(shallow, reRender, cacheProxy, cacheShallow);
}
