import { useState } from "react";
import FilterBottomSheet from "../../../../../components/common/FilterBottomSheet";
import Button from "../../../../../components/common/Button";
import { CheckIcon } from "../../../../auth/components/CheckIcon";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: SelectOption[];
  selectedValues: string[];
  onSubmit: (values: string[]) => void;
  multiSelect?: boolean;
  hasCustomInput?: boolean;
}

export default function SelectBottomSheet({
  isOpen,
  onClose,
  title,
  options,
  selectedValues,
  onSubmit,
  multiSelect = false,
  hasCustomInput = false,
}: SelectBottomSheetProps) {
  const [selected, setSelected] = useState<string[]>(selectedValues);
  const [customInput, setCustomInput] = useState("");

  const handleToggle = (value: string) => {
    if (multiSelect) {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else {
      setSelected([value]);
    }
  };

  const handleSubmit = () => {
    const finalValues = customInput
      ? [...selected.filter((v) => v !== "custom"), customInput]
      : selected;
    onSubmit(finalValues);
    onClose();
  };

  const handleClose = () => {
    setSelected(selectedValues);
    setCustomInput("");
    onClose();
  };

  return (
    <FilterBottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      className="h-[60%]"
    >
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <h3 className="text-title2 text-text-black">{title}</h3>
      </div>
      <div className="w-[90%] mx-auto border-b border-core-2" />

      {/* 옵션 목록 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-2.5 pb-20 flex flex-col gap-2.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div onClick={() => handleToggle(option.value)}>
              <CheckIcon checked={selected.includes(option.value)} />
            </div>
            <span className="text-title3 text-text-gray1">{option.label}</span>
          </label>
        ))}

        {/* 그 외 입력 */}
        {hasCustomInput && (
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div onClick={() => handleToggle("custom")}>
                <CheckIcon checked={selected.includes("custom")} />
              </div>
              <span className="text-title3 text-text-gray1">그 외 입력</span>
            </label>
            {selected.includes("custom") && (
              <input
                type="text"
                placeholder="입력해주세요"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-md border border-core-2 bg-white/80 text-title3 text-text-black placeholder:text-text-gray3 focus:outline-none"
              />
            )}
          </div>
        )}
      </div>

      {/* 선택 완료 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-4 bg-white">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          className="text-title7 w-[90%] h-[44px] flex items-center justify-center gap-[10px] rounded-[12px]"
        >
          선택 완료
        </Button>
      </div>
    </FilterBottomSheet>
  );
}
