import { useEffect, useState } from "react";
import MainIcon from "../../assets/MainIcon.svg";

interface LoadingViewProps {
    message?: string;
    fullscreen?: boolean;
}

export default function LoadingView({
    message = "나에게 꼭 맞는 매칭을 찾는 중이에요",
    fullscreen = true
}: LoadingViewProps) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center bg-white ${fullscreen ? "fixed inset-0 z-50" : "w-full h-full py-20"}`}>
            <div className="mb-6">
                <img
                    src={MainIcon}
                    alt="Loading..."
                    className="w-20 h-20 animate-pulse"
                />
            </div>

            {/* 텍스트 영역 */}
            <div className="flex flex-col items-center gap-2">
                <p className="text-title1 text-text-black animate-fade-in text-center">
                    {message}
                    <span className="inline-block w-8 text-left">{dots}</span>
                </p>
                <p className="text-body2 text-text-gray3 opacity-60">잠시만 기다려 주세요</p>
            </div>
        </div>
    );
}
