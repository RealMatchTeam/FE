import type { ReactNode } from "react";
import CloseIcon from "../../../../assets/matchingTest-go-back.svg?url";

interface BottomSheetProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function BottomSheet({ title, children, onClose }: BottomSheetProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* dim */}
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* sheet */}
      <div className="absolute bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 rounded-t-2xl bg-white shadow-xl">
        {/* header */}
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

        {/* content */}
        <div className="px-5 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
}
