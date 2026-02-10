import { SORT_LABEL, type SortOption } from "./SortingSheetConstant";

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
}: {
  open: boolean;
  value: T;
  onChange: (v: T) => void;
  onClose: () => void;
  onApply: () => void;
  options?: SortOptionItem<T>[];
  title?: string;
  applyLabel?: string;
}) {
  if (!open) return null;

  const sheetOptions = (options ?? DEFAULT_OPTIONS) as SortOptionItem<T>[];

  return (
    <div className="fixed inset-0 z-50">
      {/* 딤(배경) */}
      <button
        type="button"
        aria-label="close"
        className="absolute inset-0 bg-[#17171833]"
        onClick={onClose}
      />

      {/* 시트 */}
      <div className="fixed left-1/2 -translate-x-1/2 top-[235px] w-full h-[530px] bg-white rounded-t-[12px] pt-[20px] px-4 flex flex-col">
        <div className="w-full h-[70px] fixed left-1/2 -translate-x-1/2">
          <div className="px-4 text-medium text-text-black mb-3">{title}</div>

          <div className="bg-[#F3F4F8] px-4 py-3">
            <div className="flex gap-6">
              {sheetOptions.map((option) => (
                <SortOptionButton
                  key={option.value}
                  label={option.label}
                  active={value === option.value}
                  onClick={() => onChange(option.value)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1" />

        <div className="flex justify-center py-6">
          <button
            onClick={onApply}
            className="w-full h-11 rounded-[12px] bg-[#6666E5] text-white text-SemiBold"
          >
            {applyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function SortOptionButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-medium ${active ? "text-text-black" : "text-text-gray3"}`}
    >
      {label}
    </button>
  );
}

export default SortFilterSheet;
