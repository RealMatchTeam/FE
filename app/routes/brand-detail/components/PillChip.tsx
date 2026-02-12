type Props = {
  children: React.ReactNode;
  variant?: "filled" | "outline";
};

export default function PillChip({ children, variant = "outline" }: Props) {
  if (variant === "filled") {
    // 카테고리 칩
    return (
      <span className="inline-flex items-center rounded-full bg-core-3 px-2 py-1 text-callout1 text-white">
        {children}
      </span>
    );
  }

  // 태그 칩
  return (
    <span className="inline-flex items-center rounded-full border border-core-2 px-2 py-1 text-callout1 text-text-gray1">
      {children}
    </span>
  );
}
