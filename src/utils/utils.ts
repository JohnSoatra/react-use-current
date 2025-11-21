export function isTypedArray(value: any) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

export function isArray(value: any): boolean {
  return Array.isArray(value) || isTypedArray(value);
}
