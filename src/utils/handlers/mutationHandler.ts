import { CacheProxy, CacheShallow, ReRender } from "../createProxy";
import { toProxies } from "../utils";

export default function mutationHandler(
  proxy: object,
  target: object,
  key: string,
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

  reRender();

  return result === target ? proxy : result;
}
