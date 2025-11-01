import createProxy, { CacheProxy, CacheShallow, ReRender } from "./createProxy";
import Symbols from "../constants/symbols";
import MutationMethods from "../constants/mutationMethods";

export function creatable(value: any) {
  return typeof value === 'object' && value !== null;
}

export function isArray(value: any): boolean {
  return Array.isArray(value) || ArrayBuffer.isView(value);
}

export function isProxy(value: any): boolean {
  return value[Symbols.IsProxy] ?? false;
}

export function getRaw(proxy: any): object | undefined {
  return proxy[Symbols.RawObject];
}

export function mutationMethod(obj: any, key: string) {
  const list = MutationMethods.get(obj.constructor);
  return list ? list.includes(key) : false;
}

export function toProxies(
  reRender: ReRender,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  ...args: any[]
) {
  let array:any[] = [];

  for (const each of args) {
    let result;

    if (creatable(each)) {
      if (isProxy(each)) {
        result = each;
      } else if (cacheProxy.has(each)) {
        result = cacheProxy.get(each);
      } else {
        result = createProxy(each, reRender, cacheProxy, cacheShallow);
      }
    } else {
      result = each;
    }

    array.push(result);
  }

  return array;
}
