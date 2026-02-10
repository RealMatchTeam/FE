type Props = {
  children: React.ReactNode;
  variant?: "filled" | "outline";
};

export default function PillChip({ children, variant = "outline" }: Props) {
  if (variant === "filled") {
    // 카테고리 칩
    return (
      <span className="inline-flex h-7 items-center rounded-full bg-core-3 px-3 text-title3 text-white">
        {children}
      </span>
    );
  }

  // 태그 칩
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-[#E3E5F1] px-2.5 text-callout1 text-text-gray2">
      {children}
    </span>
  );
}
