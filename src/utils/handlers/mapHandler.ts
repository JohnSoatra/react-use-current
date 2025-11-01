import createProxy, { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { creatable, isProxy } from "../utils";

export default function mapHandler(
  value: Map<any, any>,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
) {
  let shallow: Map<any, any>;

  if (cacheShallow.has(value)) {
    shallow = cacheShallow.get(value);
  } else {
    shallow = new Map(value);
    cacheShallow.set(value, shallow);
  }

  for (const [prevKey, prevValue] of shallow) {
    let newKey;
    let newValue;

    if (creatable(prevKey) && !isProxy(prevKey)) {
      if (cacheProxy.has(prevKey)) {
        newKey = cacheProxy.get(prevKey);
      } else {
        newKey = createProxy(prevKey, reRender, cacheProxy, cacheShallow);
      }
    } else {
      newKey = prevKey;
    }

    if (creatable(prevValue) && !isProxy(prevValue)) {
      if (cacheProxy.has(prevValue)) {
        newValue = cacheProxy.get(prevValue);
      } else {
        newValue = createProxy(prevValue, reRender, cacheProxy, cacheShallow);
      }
    } else {
      newValue = prevValue;
    }

    if (!(newKey === prevKey && newValue === prevValue)) {
      shallow.delete(prevKey);
      shallow.set(newKey, newValue);
    }
  }

  return createProxy(shallow, reRender, cacheProxy, cacheShallow);
}
