import { useCallback, useMemo, useState } from 'react';
import createProxy from './utils/createProxy';

export type Current<T> = {
  get current(): T;
  set current(value: T);
  readonly signal: {} | undefined;
};

function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [signal, setSignal] = useState<{}>();
  const packet = useMemo(() => ({ current: initial, signal }), []);
  const cache = useMemo(() => new WeakMap(), []);
  const cacheArray = useMemo(() => new WeakMap(), []);

  const reRender = useCallback(() => {
    setSignal(() => {
      const newSignal = Object.freeze({});
      packet.signal = newSignal;
      return newSignal;
    });
  }, []);

  return useMemo(() => createProxy(packet, reRender, cache, cacheArray), []);
}

export default useCurrent;
