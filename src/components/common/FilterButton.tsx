interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    isActive?: boolean;
}

export default function FilterButton({ label, isActive, className = "", ...props }: FilterButtonProps) {
    return (
        <button
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-title3 transition-colors cursor-pointer ${isActive
                ? 'border-core-1 text-core-1 bg-blue-50'
                : 'border-gray-200 text-text-gray2 bg-white'
                } ${className}`}
            {...props}
        >
            {label}
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
