import type { ReactNode } from "react";

interface BottomSheetProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function BottomSheet({ title, children, onClose }: BottomSheetProps) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="absolute bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 rounded-t-2xl bg-white px-5 pb-6 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-500 active:opacity-90"
          >
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
