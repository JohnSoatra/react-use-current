import { Dispatch, RefObject, SetStateAction } from "react";
import { ChangeEvent, getRaw, Ref } from "vref";
import { findRawParents } from "./utils";

/**
 * React-specific change handler for `useCurrent`.
 *
 * Purpose:
 * - Trigger React re-render when any reactive mutation occurs.
 * - Clean up affected cached proxies to ensure fresh proxy generation
 *   for updated objects and their parent references.
 *
 * This function ensures React gets fresh proxies after mutation,
 * maintaining correct reactivity and rendering behavior.
 */
export default function handleChange(
  event: ChangeEvent,
  rootRef: Ref<any>,
  cache: RefObject<WeakMap<object, object>>,
  cacheParents: RefObject<WeakMap<object, Set<object>>>,
  setSignal: Dispatch<SetStateAction<symbol>>,
) {
  const rawRootRef = getRaw(rootRef);
  const rawTarget = getRaw(event.target);
  const rawParents = findRawParents(rawTarget, cacheParents.current);
  rawParents.delete(rawRootRef);
  cache.current.delete(rawTarget);
  rawParents.forEach(rawParent => {
    cache.current.delete(rawParent);
  });
  setSignal(Symbol());
}
