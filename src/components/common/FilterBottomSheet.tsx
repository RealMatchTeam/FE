import { cn } from "../../lib/utils";

interface FilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function FilterBottomSheet({ isOpen, onClose, children }: FilterBottomSheetProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* 바텀시트 */}
            <div className={cn(
                "relative w-full max-w-[430px] bg-white rounded-t-2xl",
                "animate-slide-up h-[60%] flex flex-col"
            )}>
                {/* 핸들 바 */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
