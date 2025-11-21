import { useCallback, useMemo, useRef, useState } from 'react';
import ref from 'vref';
import ReadonlyError from './classes/ReadonlyError';
import { Updated } from './constants/symbols';
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
 * @returns A reactive `Current<T>` object with a `.value` property.
 */
function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [signal, setSignal] = useState(Symbol());
  const signalRef = useRef(signal);
  const handleChange = useCallback(() => {
    setSignal(() => {
      const newSignal = Symbol();
      signalRef.current = newSignal;
      return newSignal;
    });
  }, []);
  return useMemo(() => new Proxy(ref(initial, handleChange), {
    get(target, key, receiver) {
      if (key === 'track') {
        return trackHandler;
      }
      // if (key === Updated) {
      //   return signalRef.current;
      // }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      if (key === Updated) {
        throw new ReadonlyError(key);
      }
      return Reflect.set(target, key, newValue, receiver);
    },
  }) as any, []);
}

export default useCurrent;
