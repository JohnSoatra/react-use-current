import { useRef } from "react"
import track from "../utils/track";

/**
 * Provides a function to track a reactive value for React dependency arrays.
 */
export default function useTrack() {
  const trackRef = useRef<any>(undefined);
  return function <T>(target: T) {
    return trackRef.current = track(target);
  }
}
