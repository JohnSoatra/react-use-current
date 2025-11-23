import { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import ref, { ChangeEvent, Ref, getRaw } from 'vref';

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
  const cache = useRef(new WeakMap());
  const current = useMemo(() => new Proxy(
    ref(
      initial,
      (evt) => handleChange(cache, current, evt, setSignal),
      { cache: cache.current }
    ), {
    get(target, p, receiver) {
      if (p === 'cache') {
        return cache;
      }
      return Reflect.get(target, p, receiver);
    },
  }), []);
  return current;
}
function handleChange(
  cache: RefObject<WeakMap<any, any>>,
  current: Ref<any>,
  event: ChangeEvent,
  setSignal: Function,
) {
  cache.current.delete(getRaw(current.value));
  cache.current.delete(getRaw(event.target));
  setSignal(Symbol());
}

export default useCurrent;
