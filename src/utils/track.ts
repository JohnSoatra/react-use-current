import { isRef } from "vref";
import { Tracks } from "../data/global";
import { updatedAt } from ".";

export default function track<T>(target: T) {
  if (isRef(target)) {
    if (!Tracks.has(target as object)) {
      Tracks.set(target as object, updatedAt());
    }
    return Tracks.get(target as object)!;
  }
  return target;
}
