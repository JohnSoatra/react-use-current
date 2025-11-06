import { Updated } from "../constants/symbols";

export type Current<T> = {
  value: T;
  readonly [Updated]: any;
};
