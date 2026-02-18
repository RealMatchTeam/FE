import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number | string;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
};

export default function BottomSheet({
  open,
  onClose,
  children,
  height,
  className,
  contentClassName,
  overlayClassName,
}: BottomSheetProps) {
  if (!open) return null;

  const heightStyle =
    height === undefined
      ? undefined
      : typeof height === "number"
        ? { height: `${height}px` }
        : { height };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="close"
        className={cn("absolute inset-0 bg-[#17171833]", overlayClassName)}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed left-1/2 bottom-0 w-full max-w-[480px] -translate-x-1/2",
          "rounded-t-[12px] bg-white flex flex-col animate-slide-up",
          className,
        )}
        style={heightStyle}
      >
        <div className={cn("flex-1 flex flex-col", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
