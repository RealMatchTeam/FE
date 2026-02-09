import type { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="h-dvh bg-bluegray-1 overflow-hidden">
      <div className="relative mx-auto h-dvh w-full max-w-[430px] bg-white shadow-lg overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
