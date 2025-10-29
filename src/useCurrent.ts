import { useCallback, useMemo, useRef, useState } from 'react';
import { createProxy } from './utils';

export type Current<T> = {
  get current(): T;
  set current(value: T);
  readonly tick: number;
};

function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [tick, setTick] = useState(0);
  const timeout = useRef<NodeJS.Timeout>(undefined);
  const packet = useMemo(() => ({ current: initial, tick }), []);
  const cache = useMemo(() => new WeakMap(), []);

  const reRender = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setTick(tick => {
        const newTick = tick + 1;
        packet.tick = newTick;
        return newTick;
      });
    }, 25);
  }, []);

  return useMemo(() => createProxy(packet, reRender, cache), []);
}

export default useCurrent;
