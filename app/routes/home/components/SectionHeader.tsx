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
        {subtitle ? <div className="mt-1 text-[12px] text-black/35">{subtitle}</div> : null}
      </div>

      {onMore ? (
        <button
          type="button"
          onClick={onMore}
          className="mt-0.5 grid h-6 w-6 place-items-center text-black/30"
          aria-label="more"
        >
          ›
        </button>
      ) : null}
    </div>
  );
}
