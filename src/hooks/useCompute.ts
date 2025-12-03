import { DependencyList, useMemo } from "react";
import { isRef } from "vref";
import track from "../utils/track";

/**
 * Like useMemo, but supports reactive dependencies.
 * If a dependency is reactive, `track(dep)` is used so the memoized
 * value recalculates when `.value` changes.
 */
export default function useCompute<T>(
  computer: () => T,
  deps: DependencyList
) {
  const trackedDeps = deps.map(each => isRef(each) ?
    track(each) :
    each
  );
  return useMemo(computer, trackedDeps);
}
