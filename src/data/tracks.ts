import Symbols from "../constants/symbols";
import { createGlobalVariable } from "../utils/global";

export const Tracks = createGlobalVariable(
  Symbols.Tracks,
  new WeakMap<object, symbol>(),
  'Global Tracks key is already used by another library or code, overriding.',
);
