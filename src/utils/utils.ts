import { MutationMethods } from "../constants";
import Labels from "../constants/labels";

export function creatable(value: any) {
  return typeof value === 'object' && value !== null;
}

export function iterable(value: any) {
  return value != null && typeof value[Symbol.iterator] === 'function';
}

export function isProxy(value: any) {
  return value[Labels.IsProxy] ?? false;
}

export function mutationMethod(obj: any, key: string) {
  const list = MutationMethods.get(obj.constructor);
  return list ? list.includes(key) : false;
}
