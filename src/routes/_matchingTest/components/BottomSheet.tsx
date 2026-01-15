import type { ReactNode } from "react";

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
        {/* header: 좌 타이틀 / 우 닫기 */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="text-[14px] font-semibold text-text-black">{title}</div>

          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-medium text-text-gray3 active:opacity-90"
          >
            닫기
          </button>
        </div>

        {/* content */}
        <div className="px-5 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
}
