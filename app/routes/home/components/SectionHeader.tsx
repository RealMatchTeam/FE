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
        <div className="text-[16px] leading-[20px] font-semibold">{title}</div>
        {subtitle ? <div className="mt-[10px] text-callout1 text-[var(--color-text-gray3)]">{subtitle}</div> : null}
      </div>

      {onMore ? (
        <button
          type="button"
          onClick={onMore}
          className="mt-0.5 grid h-6 w-6 place-items-center text-[var(--color-text-gray3)]"
          aria-label="more"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#9B9BA1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      ) : null}
    </div>
  );
}
