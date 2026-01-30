import BrandLogo from "../../../../components/common/BrandLogo";

interface CampaignCardProps {
    brandName: string;
    title: string;
    reward: number;
    matchRate: number;
    applicants: number;
    isLiked?: boolean;
    logoUrl?: string;
    onLike?: () => void;
}

export default function CampaignCard({
    brandName,
    title,
    reward,
    matchRate,
    applicants,
    isLiked = false,
    logoUrl,
    onLike
}: CampaignCardProps) {
    // 금액 포맷팅
    const formatReward = (amount: number) => {
        return amount.toLocaleString('ko-KR');
    };

    return (
        <div className="flex w-full p-2.5 bg-white border border-bluegray-2 rounded-2xl shadow-sm">
            {/* 왼쪽: 이미지 + 배지 */}
            <div className="mr-4 flex-shrink-0 flex flex-col items-center gap-2 w-[100px]">
                <BrandLogo src={logoUrl} alt={brandName} />
                {/* 원고료 & D-Day 배지 */}
                <div className="flex items-center justify-center gap-1 w-full">
                    <span className="px-1.5 py-0.5 bg-white text-core-1 text-title5 rounded border border-core-1 border-[0.5px]">
                        D-DAY
                    </span>
                    <span className="px-1.5 py-0.5 bg-core-2 text-core-1 text-title5 rounded">{applicants}명</span>
                </div>
            </div>

            {/* 오른쪽: 콘텐츠 */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 h-full">
                    <div className="flex flex-col gap-1 w-full">
                        {/* 헤더: 브랜드명 & 매칭률 & 좋아요 */}
                        <div className="flex justify-between items-start">
                            <h3 className="text-title1 text-text-black truncate">{brandName}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-core-1"><span className="text-callout1">매칭률 </span><span className="text-title1 font-bold">{matchRate}%</span></span>
                                <button onClick={onLike} className="flex-shrink-0 cursor-pointer">
                                    {isLiked ? (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#B7B7F3" />
                                        </svg>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.1 18.55L12 18.65L11.89 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.93C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55ZM16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.03L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3Z" fill="#C1C1CB" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* 캠페인 제목 */}
                        <p className="text-title3 text-black truncate">{title}</p>
                        {/* 원고료 */}
                        <span className="text-callout1 text-core-1">원고료: {formatReward(reward)}원</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
