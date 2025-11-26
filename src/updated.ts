const Updated = new WeakMap<object, {
  updated: boolean;
  prev: Symbol;
}>();

export default Updated;
