import type { ReactNode } from "react";

interface CardProps {
    image?: ReactNode
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Card({ image, children, className = "", onClick }: CardProps) {
    return (
        <div
            className={`flex w-full p-4 bg-white border border-bluegray-2 rounded-2xl shadow-sm ${className}`}
            onClick={onClick}
        >
            {/* Left Image Slot */}
            {image && (
                <div className="mr-4 flex-shrink-0">
                    {image}
                </div>
            )}

            {/* Main Content Info */}
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}
