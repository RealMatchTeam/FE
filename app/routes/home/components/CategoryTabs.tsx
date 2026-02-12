import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CategoryKey } from "../types";

const SIDE_MARGIN_PX = 20;

export default function CategoryTabs({
  value,
  onChange,
}: {
  value: CategoryKey;
  onChange: (v: CategoryKey) => void;
}) {
  const tabs = useMemo(
    () =>
      [
        { key: "beauty" as const, label: "뷰티" },
        { key: "fashion" as const, label: "패션" },
      ] satisfies { key: CategoryKey; label: string }[],
    [],
  );

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapWidth, setWrapWidth] = useState(0);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => setWrapWidth(el.clientWidth);
    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === value),
  );

  const pxToRem = (px: number) => {
    if (typeof window === "undefined") return `${px / 16}rem`;
    const root = window.getComputedStyle(document.documentElement).fontSize;
    const base = Number.parseFloat(root) || 16;
    return `${px / base}rem`;
  };

  const trackWidth = Math.max(0, wrapWidth - SIDE_MARGIN_PX * 2);
  const indicatorWidth = trackWidth / tabs.length;
  const indicatorX = SIDE_MARGIN_PX + indicatorWidth * activeIndex;

  return (
    <div
      ref={wrapRef}
      className="relative -mx-5 h-12.5 w-[calc(100%+40px)] bg-white"
    >
      <div className="flex h-full items-center px-4">
        {tabs.map((t) => {
          const active = t.key === value;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "flex-1 h-full flex items-center justify-center text-title2 transition-colors",
                active ? "text-(--color-core-1)" : "text-text-gray3",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />

      <div
        className="absolute bottom-0 h-0.5 bg-(--color-success) transition-transform duration-200"
        style={{
          width: pxToRem(indicatorWidth),
          transform: `translateX(${pxToRem(indicatorX)})`,
        }}
      />
    </div>
  );
}
