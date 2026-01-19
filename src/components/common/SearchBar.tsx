
import SearchIcon from '../../assets/search.svg';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    className?: string;
}

export default function SearchBar({ placeholder = "검색", className = "", ...props }: SearchBarProps) {
    return (
        <div className={`relative flex items-center w-full ${className}`}>
            <div className="absolute left-3 flex items-center justify-center w-5 h-5 text-gray3 text-title3">
                <img src={SearchIcon} alt="검색" className="w-full h-full" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full h-10 pl-10 pr-10 text-center text-body2 bg-white border border-gray-200 rounded-[8px] placeholder-text-gray3 focus:outline-none focus:border-core-1 transition-colors"
                {...props}
            />
            <div className="absolute right-3 flex items-center justify-center w-5 h-5 text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 12.708l3.246 3.246q.14.14.344.15t.364-.15t.16-.354t-.16-.354L12.708 12l3.246-3.246q.14-.14.15-.344t-.15-.364t-.354-.16t-.354.16L12 11.292L8.754 8.046q-.14-.14-.344-.15t-.364.15t-.16.354t.16.354L11.292 12l-3.246 3.246q-.14.14-.15.345q-.01.203.15.363t.354.16t.354-.16zM12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" /></svg>
            </div>
        </div>
    );
}
