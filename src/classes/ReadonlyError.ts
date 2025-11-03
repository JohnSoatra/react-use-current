export default class ReadonlyError extends Error {
  constructor(prop: string | symbol) {
    const propKey = typeof prop === 'string' ? prop : prop.toString();
    super(`Property "${propKey}" is readonly and cannot be modified.`);
    this.name = 'ReadonlyError';
  }
}
