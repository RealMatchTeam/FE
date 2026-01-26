import { useEffect, useState } from "react";
import { cn } from "../../../../../lib/utils";

interface TermsDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

export function TermsDetailModal({ isOpen, onClose, title, content }: TermsDetailModalProps) {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            setIsVisible(true);
        } else {
            timer = setTimeout(() => setIsVisible(false), 300);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 오버레이 */}
            <div
                className={cn(
                    "absolute inset-0 bg-transparent transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* 모달 콘텐츠 */}
            <div
                className={cn(
                    "relative w-full max-w-[375px] h-full bg-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-center relative h-[56px] px-4 border-b border-gray-100">
                    <button
                        onClick={onClose}
                        className="absolute left-6 p-2 -ml-2"
                        aria-label="뒤로가기"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" fill="none">
                            <path d="M10 1L1 10L10 19" stroke="#5B5D6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <h2 className="text-title2 text-text-black">{title}</h2>
                </div>

                {/* 약관 내용 */}
                <div className="flex-1 overflow-y-auto px-6 py-6 pb-12">
                    <div className="text-body1 text-text-gray1 whitespace-pre-wrap leading-relaxed">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
}
