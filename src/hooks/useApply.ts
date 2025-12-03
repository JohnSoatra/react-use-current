import { DependencyList, EffectCallback, useEffect } from "react";
import { isRef } from "vref";
import track from "../utils/track";

/**
 * Works like useEffect, but supports reactive values.
 * If a dependency is reactive, track(dep) is used so the effect
 * runs whenever its `.value` changes.
 */
export default function useApply(
  action: EffectCallback,
  deps?: DependencyList
) {
  const trackedDeps = deps?.map(each => isRef(each) ?
    track(each) :
    each
  );
  return useEffect(action, trackedDeps);
}
