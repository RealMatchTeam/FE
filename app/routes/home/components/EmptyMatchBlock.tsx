type Props = {
  title: string;
  desc: string;
  ctaLabel: string;
  onCta?: () => void;
};

export default function EmptyMatchBlock({ title, desc, ctaLabel, onCta }: Props) {
  return (
    <div className="mt-3 rounded-2xl bg-white px-4 py-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="text-[13px] font-bold text-[#111318]">{title}</div>
      <div className="mt-2 text-[11px] leading-5 text-[#8C91A7]">{desc}</div>

      <button
        type="button"
        onClick={onCta}
        className="mt-4 h-10 w-full rounded-xl bg-[#EEF0FF] text-[13px] font-extrabold text-[#5B63FF] active:opacity-90"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
