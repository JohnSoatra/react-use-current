import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createProxy } from './utils';

export type Current<T> = {
  get current(): T;
  set current(value: T);
  tick: number;
};

function useCurrent<T>(initial: T): Current<T>;
function useCurrent<T = undefined>(): Current<T | undefined>;
function useCurrent<T>(initial?: T): Current<T | undefined> {
  const [tick, setTick] = useState(0);
  const timeout = useRef<NodeJS.Timeout>(undefined);

  const reRender = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setTick(tick => tick + 1);
    }, 50);
  }, []);

  const proxy = useMemo(() => {
    const value = createProxy({ current: initial }, reRender);
    return value;
  }, []);

  return proxy;
}

export default useCurrent;
