interface BrandLogoProps {
    src?: string;
    alt: string;
    className?: string;
}

export default function BrandLogo({ src, alt, className = "" }: BrandLogoProps) {
    return (
        <div className={`w-[80px] h-[80px] bg-white border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-contain p-2" />
            ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-text-gray3 text-callout1 font-medium text-center p-2 break-keep">
                    {alt}
                </div>
            )}
        </div>
    );
}
