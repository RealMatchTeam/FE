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
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-title3 transition-colors cursor-pointer ${isActive
                ? 'border-core-3 text-core-1 bg-core-70 shadow-[0_1px_3px_0_#D4D4D9]'
                : 'border-gray-200 text-text-gray2 bg-white'
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
                className={isActive ? 'text-core-1' : 'text-gray-400'}
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
