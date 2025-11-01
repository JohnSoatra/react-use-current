import { useCallback, useMemo, useState } from 'react';
import createProxy, { CacheProxy, CacheShallow } from './utils/createProxy';

export type Current<T> = {
  get current(): T;
  set current(value: T);
  readonly signal: Symbol | undefined;
};

function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [signal, setSignal] = useState<Symbol>();
  const packet = useMemo(() => ({ current: initial, signal }), []);
  const cacheProxy = useMemo<CacheProxy>(() => new WeakMap(), []);
  const cacheShallow = useMemo<CacheShallow>(() => new WeakMap(), []);

  const reRender = useCallback(() => {
    setSignal(() => {
      const newSignal = Symbol();
      packet.signal = newSignal;
      return newSignal;
    });
  }, []);

  return useMemo(() => createProxy(packet, reRender, cacheProxy, cacheShallow), []);
}

export default useCurrent;
