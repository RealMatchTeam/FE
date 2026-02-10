import type { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen h-dvh bg-bluegray-1 overflow-hidden">
      <div className="relative mx-auto min-h-screen h-dvh w-full max-w-[480px] bg-white shadow-lg overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
        {children}
      </div>
    </div>
  );
}
