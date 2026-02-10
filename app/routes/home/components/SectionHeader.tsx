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
    <div className="flex items-start justify-between text-[var(--color-text-black)]">
      <div>
        <div className="text-title1 font-semibold ">{title}</div>
        {subtitle ? <div className="mt-1 text-callout1 text-[var(--color-text-gray3)]">{subtitle}</div> : null}
      </div>

      {onMore ? (
        <button
          type="button"
          onClick={onMore}
          className="mt-0.5 grid h-6 w-6 place-items-center text-[var(--color-text-gray3)]"
          aria-label="more"
        >
          ›
        </button>
      ) : null}
    </div>
  );
}
