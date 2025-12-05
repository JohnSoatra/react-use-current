import Symbols from "../constants/symbols";

const globalAny = globalThis as any;

if (!globalAny[Symbols.Tracks]) {
  globalAny[Symbols.Tracks] = new WeakMap();
} else if (!(globalAny[Symbols.Tracks] instanceof WeakMap)) {
  console.warn(
    '[react-use-current] Global Tracks key is already used by another library or code, overriding.'
  );
  globalAny[Symbols.Tracks] = new WeakMap();
}

export const Tracks: WeakMap<object, symbol> = globalAny[Symbols.Tracks];
