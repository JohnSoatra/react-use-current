import Symbols from "../constants/symbols";
import { createGlobalVariable } from "../utils/global";

export const Cache = createGlobalVariable(
  Symbols.Cache,
  new WeakMap<object, object>(),
  'Global Cache key is already used by another library or code, overriding.',
);
