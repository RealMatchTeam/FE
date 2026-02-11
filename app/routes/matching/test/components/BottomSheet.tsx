import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import CloseIcon from "../../../../assets/matchingTest-go-back.svg?url";
import { useHideBottomTab } from "../../../../hooks/useHideBottomTab";

interface BottomSheetProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function BottomSheet({
  title,
  children,
  onClose,
}: BottomSheetProps) {
  useHideBottomTab(true);

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-auto w-full max-w-120 rounded-t-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between px-5 pt-5">
            <div className="text-title2 text-text-black">{title}</div>

            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="p-1 active:opacity-80"
            >
              <img src={CloseIcon} alt="" className="h-3 w-3" />
            </button>
          </div>

          <div className="px-5 pb-6 pt-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
