import { useEffect } from "react";

export function useAutoScroll(
  listRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList
) {
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [listRef, deps]);
}
