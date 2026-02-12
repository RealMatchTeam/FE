interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    isActive?: boolean;
}

// 글자수 초과시 ""..." 처리
const truncateLabel = (text: string, maxLength = 10) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export default function FilterButton({ label, isActive, className = "", ...props }: FilterButtonProps) {
    return (
        <button
            className={`flex items-center gap-1 px-[10px] py-1 rounded-[60px] border transition-colors cursor-pointer ${
                isActive
                    ? "border-core-1 bg-core-1/10 text-core-1"
                    : "border-[#E6E6F3] bg-white text-text-gray2"
            } ${className}`}
            {...props}
        >
            {truncateLabel(label)}
            <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-current"
            >
                <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}
