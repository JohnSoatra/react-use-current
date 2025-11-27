import { getRaw } from "vref";

/**
 * Recursively finds all parent objects (proxy) that reference a given target.
 * Uses cacheParents (WeakMap) to track only direct parent relations.
 */
export function findParents(
  target: object,
  cacheParents: WeakMap<object, Set<object>>,
  parents: Set<object> = new Set(),
) {
  const rawTarget = getRaw(target);
  cacheParents.get(rawTarget)?.forEach(parent => {
    parents.add(parent);
    findParents(
      parent,
      cacheParents,
      parents
    );
  });
  return parents;
}

export function updatedAt() {
  return Symbol(`useCurrent @${new Date().toISOString()}`);
}
