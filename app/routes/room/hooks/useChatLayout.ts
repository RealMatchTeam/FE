import { useEffect, useMemo, useRef } from "react";

type Args = {
  kb: number;
  isSheetOpen: boolean;
  messagesLength: number;
};

export default function useChatLayout({ kb, isSheetOpen, messagesLength }: Args) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const sheetHeight = useMemo(() => {
    return kb > 0 ? kb : 240;
  }, [kb]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messagesLength]);

  // 시트가 열리면 스크롤을 맨 아래로
  useEffect(() => {
    if (isSheetOpen) {
      const el = listRef.current;
      if (!el) return;
      setTimeout(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }, 250);
    }
  }, [isSheetOpen]);

  // 키보드가 열리면 스크롤을 맨 아래로
  useEffect(() => {
    if (kb > 0) {
      const el = listRef.current;
      if (!el) return;
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 250);
    }
  }, [kb]);

  return { listRef, sheetHeight };
}