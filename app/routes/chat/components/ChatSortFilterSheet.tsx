import BottomSheet from "../../../components/common/BottomSheet";
import { cn } from "../../../lib/utils";
import { SORT_LABEL, type SortOption } from "./ChatSortFilterConstant";

// 정렬, 필터 옵션 (최신순/협업 중)

type SortOptionItem<T extends string> = {
  label: string;
  value: T;
};

const DEFAULT_OPTIONS: SortOptionItem<SortOption>[] = [
  { label: SORT_LABEL.latest, value: "latest" },
  { label: SORT_LABEL.collaborating, value: "collaborating" },
];

export function SortFilterSheet<T extends string = SortOption>({
  open,
  value,
  onChange,
  onClose,
  onApply,
  options,
  title = "정렬 필터",
  applyLabel = "적용하기",
  titleClassName,
  optionClassName,
  containerClassName,
  applyButtonClassName,
}: {
  open: boolean;
  value: T;
  onChange: (v: T) => void;
  onClose: () => void;
  onApply: () => void;
  options?: SortOptionItem<T>[];
  title?: string;
  applyLabel?: string;
  titleClassName?: string;
  optionClassName?: string;
  containerClassName?: string;
  applyButtonClassName?: string;
}) {
  if (!open) return null;

  const sheetOptions = (options ?? DEFAULT_OPTIONS) as SortOptionItem<T>[];

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      height={500}
      className={containerClassName}
    >
      <div className="px-4 pt-5">
        <div
          className={cn(
            "text-title3 font-semibold text-text-black",
            titleClassName,
          )}
        >
          {title}
        </div>
      </div>

      <div className="mt-3 bg-[#F3F4F8] px-4 py-3">
        <div className="flex gap-6">
          {sheetOptions.map((option) => (
            <SortOptionButton
              key={option.value}
              label={option.label}
              active={value === option.value}
              onClick={() => onChange(option.value)}
              className={optionClassName}
            />
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="px-4 pb-6">
        <button
          onClick={onApply}
          className={cn(
            "w-full h-11 rounded-[12px] bg-[#6666E5] text-white text-[13px] font-semibold",
            applyButtonClassName,
          )}
        >
          {applyLabel}
        </button>
      </div>
    </BottomSheet>
  );
}

function SortOptionButton({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-title3",
        active ? "text-text-black" : "text-text-gray3",
        className ?? "",
      ]
        .join(" ")
        .trim()}
    >
      {label}
    </button>
  );
}

export default SortFilterSheet;
