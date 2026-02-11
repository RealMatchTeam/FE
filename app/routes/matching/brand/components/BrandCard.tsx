import BrandLogo from "../../../../components/common/BrandLogo";


interface BrandCardProps {
    name: string;
    matchRate: number;
    tags: string[];
    isLiked?: boolean;
    logoUrl?: string;
    onLike?: () => void;
    onClick?: () => void;
}

export default function BrandCard({
    name,
    matchRate,
    tags,
    isLiked = false,
    logoUrl,
    onLike,
    onClick
}: BrandCardProps) {
    return (
        <div onClick={onClick} className="flex w-full p-2.5 bg-white/80 border border-bluegray-2 rounded-[10px] shadow-sm cursor-pointer">
            {/* 왼쪽: 이미지 */}
            <div className="mr-4 flex-shrink-0 flex flex-col items-center gap-2 w-[100px]">
                <BrandLogo src={logoUrl} alt={name} />
            </div>

            {/* 오른쪽: 콘텐츠 */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 h-full">
                    <div className="flex flex-col w-full">
                        {/* 헤더: 이름 & 좋아요 & 매칭률 */}
                        <div className="flex justify-between items-start">
                            <h3 className="text-title1 text-text-black truncate">{name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-core-1"><span className="text-callout1">매칭률 </span><span className="text-title1 font-bold">{matchRate}%</span></span>
                                <button onClick={(e) => { e.stopPropagation(); onLike?.(); }} className="flex-shrink-0 cursor-pointer">
                                    {isLiked ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 14" fill="none">
                                            <path d="M14.7663 1.169C14.3753 0.798396 13.9111 0.504403 13.4002 0.303821C12.8893 0.10324 12.3417 0 11.7887 0C11.2357 0 10.6881 0.10324 10.1772 0.303821C9.66629 0.504403 9.20211 0.798396 8.81116 1.169L7.9998 1.93779L7.18843 1.169C6.39874 0.420752 5.32768 0.000387845 4.21089 0.000387853C3.09409 0.000387861 2.02303 0.420752 1.23334 1.169C0.443646 1.91726 8.32078e-09 2.93211 0 3.99029C-8.32078e-09 5.04848 0.443646 6.06333 1.23334 6.81159L7.9998 13.2229L14.7663 6.81159C15.1574 6.44115 15.4677 6.00133 15.6794 5.51724C15.891 5.03315 16 4.51429 16 3.99029C16 3.4663 15.891 2.94744 15.6794 2.46335C15.4677 1.97926 15.1574 1.53944 14.7663 1.169Z" fill="#B7B7F3" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 16" fill="none">
                                            <path d="M15.5163 2.05768C15.1253 1.68707 14.6611 1.39308 14.1502 1.19249C13.6393 0.991912 13.0917 0.888672 12.5387 0.888672C11.9857 0.888672 11.4381 0.991912 10.9272 1.19249C10.4163 1.39308 9.95211 1.68707 9.56116 2.05768L8.7498 2.82646L7.93843 2.05768C7.14874 1.30942 6.07768 0.88906 4.96089 0.88906C3.84409 0.88906 2.77303 1.30942 1.98334 2.05768C1.19365 2.80593 0.75 3.82078 0.75 4.87897C0.75 5.93716 1.19365 6.952 1.98334 7.70026L8.7498 14.1116L15.5163 7.70026C15.9074 7.32982 16.2177 6.89 16.4294 6.40591C16.641 5.92183 16.75 5.40296 16.75 4.87897C16.75 4.35497 16.641 3.83611 16.4294 3.35202C16.2177 2.86793 15.9074 2.42811 15.5163 2.05768Z" stroke="#B7B7F3" strokeWidth="1.5" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 태그 */}
                        <div className="flex flex-wrap gap-1 mt-[6px]">
                            {tags.map((tag, i) => (
                                <span key={i} className="text-callout1 text-text-gray3">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
