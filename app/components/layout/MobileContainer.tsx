import type { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-bluegray-1">
      {/* 데스크톱: 중앙 정렬 컨테이너 */}
      <div className="relative mx-auto max-w-[480px] bg-white min-h-screen shadow-lg  [scrollbar-gutter:stable]">
        {children}
      </div>
    </div>
  );
}
