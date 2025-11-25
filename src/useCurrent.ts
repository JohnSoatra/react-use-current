import { useEffect, useMemo, useRef, useState } from 'react';
import ref, { getRaw, Ref } from 'vref';
import { findRawParents } from './utils';
import { Current } from './types';

/**
 * React hook that creates a reactive ref-like state object.
 *
 * `useCurrent` wraps the `ref()` reactive system from `vref`.
 * The returned object has a mutable `.value`, and **any change to `.value`**
 * automatically triggers a React re-render — similar to `useState`, but using
 * a single reactive field instead of a setter function.
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
 * @returns A reactive `Ref<T>` object with a `.value` property.
 */
function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [signal, setSignal] = useState(Symbol());
  const cache = useRef(new WeakMap<object, object>());
  const cacheParents = useRef(new WeakMap<object, Set<any>>());
  const updated = useRef(new Set<object>());

  const rootRef = useMemo(() => ref(
    initial,
    (evt) => {
      updated.current.add(evt.target);
      setSignal(Symbol());
    },
    {
      cache: cache.current,
      cacheParents: cacheParents.current
    }
  ), []);

  useEffect(() => {
    return () => {
      updated.current.forEach(target => {
        const rawRootRef = getRaw(rootRef);
        const rawTarget = getRaw(target);
        const rawParents = findRawParents(
          rawTarget,
          cacheParents.current
        );
        cache.current.delete(rawTarget);
        rawParents.delete(rawRootRef);
        rawParents.forEach(rawParent => {
          cache.current.delete(rawParent);
        });
      });
      updated.current.clear();
    }
  }, [signal]);

  return rootRef;
}

export default useCurrent;
