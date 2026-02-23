import { useRef, useState } from 'react';
import ref, { Ref } from 'vref';
import { Tracks } from './data/tracks';
import { Cache } from './data/catch';
import { findParents, updatedAt } from './utils';
import { Current } from './types';

/**
 * React hook that creates a reactive ref-like state object.
 *
 * Built on top of `vref`, it provides:
 * - `.value` that updates instantly (like useRef)
 * - automatic re-render on mutation (like useState)
 * - deep reactive tracking
 *
 * Example:
 * ```tsx
 * const count = useCurrent(0);
 *
 * function handleIncrease() {
 *   count.value += 1;        // reactive update → re-render
 * }
 *
 * return (
 *   <button onClick={handleIncrease}>
 *     Count: {count.value}
 *   </button>
 * );
 * ```
 *
 * @param initial Optional initial value.
 * @returns A reactive `Current<T>` object with a `.value` property.
 */
function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [, setSignal] = useState<Symbol>();
  const cacheParents = useRef(new WeakMap<object, Set<any>>());
  const rootRef = useRef(undefined as Ref<T | undefined> | undefined);

  if (rootRef.current === undefined) {
    rootRef.current = ref(
      initial,
      (evt) => {
        const target = evt.target;
        const parents = findParents(target, cacheParents.current);
        parents.add(rootRef.current!);
        parents.add(target);
        parents.forEach(each => {
          if (Tracks.has(each)) {
            Tracks.set(each, updatedAt());
          }
        });
        setSignal(Symbol());
      },
      {
        cache: Cache,
        cacheParents: cacheParents.current
      }
    );
  }

  return rootRef.current;
}

export default useCurrent;
