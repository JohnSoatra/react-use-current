import { getRaw } from "vref";

/**
 * Recursively finds all parent objects (raw) that reference a given target.
 * Uses cacheParents (WeakMap) to track only direct parent relations.
 */
export function findRawParents(
  target: object,
  cacheParents: WeakMap<object, Set<object>>,
  parents: Set<object> = new Set(),
) {
  const _parents = cacheParents.get(target);
  if (_parents) {
    _parents.forEach(parent => {
      const rawParent = getRaw(parent);
      parents.add(rawParent);
      findRawParents(
        rawParent,
        cacheParents,
        parents
      );
    });
  }
  return parents;
}
