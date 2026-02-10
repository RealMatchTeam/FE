import { useNavigate, useLocation } from "react-router";

interface MatchingHeaderProps {
    title: string;
    onBack?: () => void;
}

export default function MatchingHeader({ title, onBack }: MatchingHeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (location.pathname.includes("/create")) {
            navigate("/matching/suggest");
        } else {
            navigate("/");
        }
    };

    return (
        <header className="sticky top-0 z-50 flex items-center w-full h-14 px-4 bg-transparent safe-area-top">
            <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 text-text-black hover:bg-bluegray-1 rounded-lg transition-colors"
                aria-label="뒤로가기"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                </svg>
            </button>
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-title1 text-text-black">
                {title}
            </h1>
        </header>
    );
}
