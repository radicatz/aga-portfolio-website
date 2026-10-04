import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true setelah hydration di browser; false saat render server. Menghindari setState di dalam effect. */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
