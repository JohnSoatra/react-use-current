import { Ref } from "vref";

/**
 * A reactive reference object.
 *
 * @template T The type of the stored value.
 */
export type Current<T> = Ref<T>;
