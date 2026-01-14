interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
}

export default function FormField({
  label,
  value,
  placeholder,
  onClick,
}: FormFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full bg-white",
        // ✅ Figma: radius 12px, border 1px(core2)
        "rounded-[12px] border border-core-2",
        // ✅ Figma: 좌우 16px
        "px-4",
        // ✅ 입력 전/후 높이
        hasValue ? "h-[46px]" : "h-[52px]",
        "active:opacity-90 transition-[height] duration-150",
        // ✅ 레이아웃
        hasValue
          ? "flex items-center justify-center" // 입력 후: 값만 중앙
          : "flex flex-col items-center justify-center", // 입력 전: 라벨+플레이스홀더 세로
      ].join(" ")}
    >
      {!hasValue ? (
        // ✅ 입력 전 (Figma: 상단 10px, 하단 6px, gap 2px)
        <div className="flex w-full flex-col items-center justify-center gap-[2px] pt-[10px] pb-[6px]">
          <span className="text-[12px] leading-[16px] font-medium text-text-gray3">
            {label}
          </span>
          <span className="text-title1 text-core-1">{placeholder}</span>
        </div>
      ) : (
        // ✅ 입력 후 (라벨 안 보임, 값만 중앙)
        <span className="text-title1 text-core-1">{value}</span>
      )}
    </button>
  );
}
