import { useCallback, useMemo, useRef, useState } from 'react';
import ref from 'ref.js';
import ReadonlyError from './classes/ReadonlyError';

export const Updated = Symbol.for('react-use-current.updated');

export type Current<T> = {
  value: T;
  readonly [Updated]: Symbol;
};

function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [signal, setSignal] = useState(Symbol());
  const signalRef = useRef(signal);

  const reRender = useCallback(() => {
    setSignal(() => {
      const newSignal = Symbol();
      signalRef.current = newSignal;
      return newSignal;
    });
  }, []);

  return useMemo(() => {
    return new Proxy(ref(initial, reRender), {
        get(target, key, receiver) {
          if (key === Updated) {
            return signalRef.current;
          }
          return Reflect.get(target, key, receiver);
        },
        set(target, key, newValue, receiver) {
          if (key === Updated) {
            throw new ReadonlyError(key);
          }
          return Reflect.set(target, key, newValue, receiver);
        },
      }) as any;
  }, []);
}

export default useCurrent;
