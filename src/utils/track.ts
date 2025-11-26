import { isRef } from "vref";
import Updated from "../updated";

export default function track(target: any) {
  if (isRef(target)) {
    let updated = Updated.get(target);
    if (!updated) {
      updated = {
        prev: Symbol(),
        updated: false
      }
      Updated.set(target, updated);
    }
    if (updated.updated) {
      updated.prev = Symbol();
    }
    return updated.prev;
  }
  return target;
}
