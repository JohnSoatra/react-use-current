import { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { toProxies } from "../utils";

export default function defaultHandler(
  proxy: object,
  target: object,
  key: string | symbol,
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  ...args: any[]
) {
  const result = (target  as any)[key](...toProxies(
    reRender,
    cacheProxy,
    cacheShallow,
    ...args
  ));

  return result === target ? proxy : result;
}
