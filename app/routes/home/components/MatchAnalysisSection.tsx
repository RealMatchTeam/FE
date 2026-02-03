import { useMatchResultStore } from "../../../stores/matching-result";

export default function MatchAnalysisSection() {
    const result = useMatchResultStore((s) => s.result);

    if (!result?.apiResult) {
        return null;
    }

    const { userType, typeTag, highMatchingBrandList } = result.apiResult;
    const topBrands = highMatchingBrandList.brands.slice(0, 3);

    return (
        <section className="mt-7 rounded-2xl bg-gradient-to-br from-[#F6F7FF] to-white p-6">
            {/* User Type */}
            <div className="mb-4">
                <h3 className="text-[16px] font-bold text-[#2F2F2F]">{userType}</h3>
                <p className="mt-1 text-[12px] text-[#2F2F2F]/60">
                    회원님의 매칭 분석 결과예요
                </p>
            </div>

            {/* Type Tags */}
            {typeTag && typeTag.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {typeTag.map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="rounded-full bg-[#5D5FEF]/10 px-3 py-1 text-[12px] font-medium text-[#5D5FEF]"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* High Matching Brands Preview */}
            {topBrands.length > 0 && (
                <div>
                    <p className="mb-2 text-[12px] font-medium text-[#2F2F2F]/70">
                        높은 매칭률 브랜드 ({highMatchingBrandList.count}개)
                    </p>
                    <div className="flex gap-2 overflow-x-auto">
                        {topBrands.map((brand: { brandId: number; logoUrl?: string; brandName: string }) => (
                            <div
                                key={brand.brandId}
                                className="flex min-w-[100px] flex-col items-center rounded-lg bg-white p-3 shadow-sm"
                            >
                                {brand.logoUrl ? (
                                    <img
                                        src={brand.logoUrl}
                                        alt={brand.brandName}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                                )}
                                <span className="mt-2 text-[11px] font-medium text-[#2F2F2F]">
                                    {brand.brandName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
