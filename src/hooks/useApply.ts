import { DependencyList, EffectCallback, useEffect } from "react";
import track from "../utils/track";

/**
 * A reactive version of `useEffect`.
 * 
 * Works like useEffect, but supports reactive values.
 * If a dependency is reactive, track(dep) is used so the effect
 * runs whenever its `.value` changes.
 */
export default function useApply(
  effect: EffectCallback,
  deps?: DependencyList
) {
  const trackedDeps = deps?.map(each => track(each));
  return useEffect(effect, trackedDeps);
}
