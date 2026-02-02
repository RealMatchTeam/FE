import { type SortOption } from "./SortingSheetConstant";

// 정렬, 필터 옵션 (최신순/협업 중)

export function SortFilterSheet({
  open,
  value,
  onChange,
  onClose,
  onApply,
}: {
  open: boolean;
  value: SortOption;
  onChange: (v: SortOption) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  if (!open) return null;

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
      <div className="fixed left-1/2 -translate-x-1/2 top-[235px] w-full max-w-[375px] h-[530px] bg-white rounded-t-[12px] pt-[20px] px-4 flex flex-col">
        <div className="w-full max-w-[375px] h-[70px] fixed left-1/2 -translate-x-1/2"> 
          <div className="px-4 text-Medium text-text-black mb-3">정렬 필터</div>

          <div className="bg-[#F3F4F8] px-4 py-3">
            <div className="flex gap-6">
              <SortOptionButton
                label="최신순"
                active={value === "latest"}
                onClick={() => onChange("latest")}
              />
              <SortOptionButton
                label="협업 중"
                active={value === "collaborating"}
                onClick={() => onChange("collaborating")}
              />
            </div>
          </div>
        </div>
        <div className="flex-1" />

        <div className="flex justify-center py-6">
          <button
            onClick={onApply}
            className="w-full max-w-[327px] h-11 rounded-[12px] bg-[#6666E5] text-white text-SemiBold"
          >
            적용하기
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
      className={`text-Medium ${active ? "text-text-black" : "text-text-gray3"}`}
    >
      {label}
    </button>
  );
}

export default SortFilterSheet;