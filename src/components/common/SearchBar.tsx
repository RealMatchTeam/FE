
interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    className?: string;
}

export default function SearchBar({ placeholder = "검색", className = "", ...props }: SearchBarProps) {
    return (
        <div className={`relative flex items-center w-full ${className}`}>
            <div className="absolute left-3 flex items-center justify-center w-5 h-5 text-text-gray4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.22723 1C6.23416 1.00008 5.2555 1.23765 4.37291 1.69286C3.49032 2.14808 2.72939 2.80775 2.15361 3.61685C1.57783 4.42594 1.20389 5.36099 1.063 6.34398C0.922104 7.32698 1.01834 8.32941 1.34367 9.26765C1.669 10.2059 2.21399 11.0527 2.93318 11.7375C3.65237 12.4223 4.5249 12.9252 5.47797 13.2042C6.43105 13.4832 7.43703 13.5303 8.41199 13.3414C9.38694 13.1526 10.3026 12.7334 11.0826 12.1187L13.7583 14.7943C13.8965 14.9278 14.0816 15.0016 14.2737 15C14.4658 14.9983 14.6496 14.9213 14.7854 14.7854C14.9212 14.6496 14.9983 14.4658 15 14.2737C15.0016 14.0816 14.9278 13.8965 14.7943 13.7584L12.1186 11.0827C12.8425 10.1644 13.2932 9.06091 13.4192 7.89843C13.5451 6.73595 13.3413 5.56149 12.8309 4.50946C12.3206 3.45743 11.5243 2.57033 10.5333 1.94968C9.54229 1.32904 8.39656 0.999922 7.22723 1ZM2.46483 7.22753C2.46483 5.96451 2.96658 4.75321 3.8597 3.86012C4.75283 2.96703 5.96416 2.4653 7.22723 2.4653C8.4903 2.4653 9.70164 2.96703 10.5948 3.86012C11.4879 4.75321 11.9896 5.96451 11.9896 7.22753C11.9896 8.49055 11.4879 9.70184 10.5948 10.5949C9.70164 11.488 8.4903 11.9898 7.22723 11.9898C5.96416 11.9898 4.75283 11.488 3.8597 10.5949C2.96658 9.70184 2.46483 8.49055 2.46483 7.22753Z" fill="currentColor" />
                </svg>
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full h-10 pl-10 pr-10 text-center text-body2 bg-white border border-gray-200 rounded-[8px] placeholder-text-gray3 focus:outline-none focus:border-core-1 transition-colors"
                {...props}
            />
            <div className="absolute right-3 flex items-center justify-center w-5 h-5 bg-text-gray4 rounded-full text-white cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
        </div>
    );
}
