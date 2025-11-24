import { useMemo, useRef, useState } from 'react';
import ref, { Ref } from 'vref';
import handleChange from './utils/handleChange';

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
function useCurrent<T>(initial: T): Ref<T>;
function useCurrent<T = undefined>(): Ref<T | undefined>;
function useCurrent<T>(initial?: T): Ref<T | undefined> {
  const [_, setSignal] = useState(Symbol());
  const cache = useRef(new WeakMap<object, object>());
  const cacheParents = useRef(new WeakMap<object, Set<any>>());
  const rootRef = useMemo(() => ref(
    initial,
    (evt) => handleChange(
      evt,
      rootRef,
      cache,
      cacheParents,
      setSignal
    ),
    {
      cache: cache.current,
      cacheParents: cacheParents.current
    }
  ), []);
  return rootRef;
}

export default useCurrent;
