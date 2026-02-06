import { useEffect } from "react";

export function useAutoScroll(
  listRef: React.RefObject<HTMLElement | null>,
  deps: any[]
) {
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}