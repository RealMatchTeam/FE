// src/routes/_home/components/CategoryTabs.tsx
import type { CategoryKey } from "../types";

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
    <div className="relative -mx-5 h-12.5 w-[calc(100%+40px)] bg-white">
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

      <div className="absolute bottom-0 left-0 right-0 px-0">
        <div
          className="h-0.5 w-1/2 bg-(--color-success) transition-transform"
          style={{
            transform:
              value === "beauty" ? "translateX(0%)" : "translateX(100%)",
          }}
        />
      </div>
    </div>
  );
}
