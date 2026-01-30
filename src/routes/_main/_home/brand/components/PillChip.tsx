type Props = {
  children: React.ReactNode;
  variant?: "filled" | "outline";
};

export default function PillChip({ children, variant = "outline" }: Props) {
  if (variant === "filled") {
    // 카테고리 칩(스크샷 느낌)
    return (
      <span className="inline-flex h-7 items-center rounded-full bg-[#ECECFF] px-3 text-[12px] font-medium text-core-1">
        {children}
      </span>
    );
  }

  // ✅ 태그 칩(더 작게)
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-[#E3E5F1] px-2.5 text-[11px] font-medium text-text-gray2">
      {children}
    </span>
  );
}
