import { useState } from "react";
import FilterButton from "../../../../components/common/FilterButton";
import BrandCard from "./components/BrandCard";
import { BRAND_DATA } from "../../../../data/brand";
import BrandFilterBar from "./components/BrandFilterBar";


type Category = "BEAUTY" | "FASHION";

export default function BrandContent() {
    const [category, setCategory] = useState<Category>("BEAUTY");
    const [brands, setBrands] = useState(BRAND_DATA);

    const toggleLike = (id: number) => {
        setBrands(prev => prev.map(brand =>
            brand.id === id ? { ...brand, isLiked: !brand.isLiked } : brand
        ));
    };

    return (
        <div className="flex flex-col h-full bg-core2">
            {/* 뷰티/패션 필터 & 검색창 */}
            <BrandFilterBar category={category} onCategoryChange={setCategory} />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {/* 타이틀 & 필터 */}
                <div className="mb-4">
                    <h2 className="text-title1 font-bold mb-3">브랜드 리스트</h2>
                    <div className="flex gap-2">
                        <FilterButton label="정렬 필터" />
                        <FilterButton label="뷰티 필터" />
                    </div>
                </div>

                {/* 브랜드 리스트 */}
                <div className="space-y-3 pb-20">
                    {brands.map((brand) => (
                        <BrandCard
                            key={brand.id}
                            name={brand.name}
                            matchRate={brand.matchRate}
                            tags={brand.tags}
                            isLiked={brand.isLiked}
                            onLike={() => toggleLike(brand.id)}
                            logoUrl={`/dummy-logo-${brand.id}.png`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
