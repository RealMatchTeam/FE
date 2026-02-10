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
                "flex-1 py-3 text-center text-title2 transition-colors",
                active
                  ? "text-[var(--color-core-1)]"
                  : "text-[var(--color-text-gray3)]",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="relative h-px w-full bg-black/10">
        <div
          className="absolute top-0 h-0.5 w-1/2 bg-[var(--color-success)] transition-transform"
          style={{
            transform:
              value === "beauty"
                ? "translateX(0%)"
                : "translateX(100%)",
          }}
        />
      </div>
    </div>
  );
}
