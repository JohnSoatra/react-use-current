import { useMemo, useRef, useState } from 'react';
import ref, { getRaw } from 'vref';
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
  const [, setSignal] = useState(Symbol());
  const cache = useRef(new WeakMap<object, object>());
  const cacheParents = useRef(new WeakMap<object, Set<any>>());

  const rootRef = useMemo(() => ref(
    initial,
    (evt) => {
      // Defer to microtask queue to avoid reentrancy issues
      Promise.resolve().then(() => {
        // console.log('on change', evt);
        // cache.current.delete(getRaw(rootRef.value))
        const rawRootRef = getRaw(rootRef);
        const rawTarget = getRaw(evt.target);
        const rawParents = findRawParents(rawTarget, cacheParents.current);

        rawParents.has()
        // // Clear proxy cache for changed target and its parents
        // cache.current.delete(rawTarget);
        // rawParents.forEach(rawParent => {
        //   cache.current.delete(rawParent);
        // });

        // Trigger React re-render
        setSignal(Symbol());
      });
    },
    {
      cache: cache.current,
      cacheParents: cacheParents.current
    }
  ), []);

  return rootRef;
}

export default useCurrent;
