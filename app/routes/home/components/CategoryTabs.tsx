// src/routes/_home/components/CategoryTabs.tsx
import type { CategoryKey } from "../types";

const PRIMARY = "#5B5DEB";

export default function CategoryTabs({
  value,
  onChange,
}: {
  value: CategoryKey;
  onChange: (v: CategoryKey) => void;
}) {
  const tabs: { key: CategoryKey; label: string }[] = [
    { key: "beauty", label: "뷰티" },
    { key: "fashion", label: "패션" },
  ];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "flex-1 py-3 text-center text-[13px] font-medium",
                active ? "" : "text-black/35",
              ].join(" ")}
              style={active ? { color: PRIMARY } : undefined}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 캡쳐처럼 바닥 라인 + 활성 언더라인 */}
      <div className="relative h-px w-full bg-black/10">
        <div
          className="absolute top-0 h-[2px] w-1/2 transition-transform"
          style={{
            backgroundColor: PRIMARY,
            transform: value === "beauty" ? "translateX(0%)" : "translateX(100%)",
          }}
        />
      </div>
    </div>
  );
}
