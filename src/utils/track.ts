import { isRef } from "vref";
import { Tracks } from "../data/global";
import { updatedAt } from ".";

/**
 * Returns a symbol to track a reactive ref in React dependency arrays.
 * Use with useEffect or useMemo to respond to changes without recreating objects.
 *
 * @param target - A reactive ref from useCurrent, or any value.
 * @returns A symbol for reactive refs, or the original value if non-reactive.
 *
 * Example:
 *   useEffect(() => { ... }, [track(user)]);
 *   const isAdult = useMemo(() => user.value.age >= 18, [track(user.value.age)]);
 */
export default function track<T>(target: T) {
  if (isRef(target)) {
    if (!Tracks.has(target as object)) {
      Tracks.set(target as object, updatedAt());
    }
    return Tracks.get(target as object)!;
  }
  return target;
}
