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

    if (creatable(prevKey)) {
      if (!cacheProxy.has(prevKey)) {
        newKey = createProxy(prevKey, reRender, cacheProxy, cacheShallow, false);
        cacheProxy.set(newKey, newKey);
      } else if (!isProxy(prevKey)) {
        newKey = cacheProxy.get(prevKey);
      }
    } else {
      newKey = prevKey;
    }

    if (creatable(prevValue)) {
      if (!cacheProxy.has(prevValue)) {
        newValue = createProxy(prevValue, reRender, cacheProxy, cacheShallow, false);
        cacheProxy.set(newValue, newValue);
      } else if (!isProxy(prevValue)) {
        newValue = cacheProxy.get(prevValue);
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
