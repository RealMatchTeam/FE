import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface FilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export default function FilterBottomSheet({ isOpen, onClose, children, className }: FilterBottomSheetProps) {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShouldRender(true), 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) {
            setShouldRender(false);
        }
    };

    if (!shouldRender && !isOpen) return null;

    const animateClass = isOpen ? "animate-slide-up" : "animate-slide-down";

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* 배경 오버레이 */}
            <div
                className={cn(
                    "absolute inset-0 bg-black transition-opacity duration-300",
                    isOpen ? "bg-black/50" : "bg-black/0"
                )}
                onClick={onClose}
            />

            {/* 바텀시트 */}
            <div
                onAnimationEnd={handleAnimationEnd}
                className={cn(
                    "relative w-full max-w-[375px] bg-white rounded-t-3xl",
                    "flex flex-col",
                    animateClass,
                    className || "h-[60%]"
                )}>

                {/* 콘텐츠 */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {children}
                </div>
            </div>
        </div>
    );
}
