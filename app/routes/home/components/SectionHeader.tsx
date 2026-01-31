// src/routes/_home/components/SectionHeader.tsx
export default function SectionHeader({
  title,
  subtitle,
  onMore,
}: {
  title: string;
  subtitle?: string;
  onMore?: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[14px] font-semibold text-black">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-[12px] text-black/35">{subtitle}</div>
        ) : null}
      </div>

      {onMore ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="more"
          onClick={(e) => {
            e.stopPropagation(); // ✅ 상위 클릭 전파 방지
            onMore();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onMore();
          }}
          className="mt-0.5 grid h-6 w-6 cursor-pointer select-none place-items-center text-black/30"
        >
          ›
        </div>
      ) : null}
    </div>
  );
}
