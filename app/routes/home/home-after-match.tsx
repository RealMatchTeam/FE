import { useMemo, useState } from "react";
import type { CategoryKey, HomeAfterMatchCategoryData } from "./types";
import { HOME_AFTER_MATCH_MOCK } from "./home.mock";
import HeroCarousel from "./components/HeroCarousel";
import CategoryTabs from "./components/CategoryTabs";
import SectionHeader from "./components/SectionHeader";
import BrandCard from "./components/BrandCard";
import CampaignCard from "./components/CampaignCard";
import CreatorProfileCard from "./components/CreatorProfileCard";

export default function HomeAfterMatchPage() {
  const [category, setCategory] = useState<CategoryKey>("beauty");

  const data: HomeAfterMatchCategoryData = useMemo(() => {
    return category === "beauty"
      ? HOME_AFTER_MATCH_MOCK.beauty
      : HOME_AFTER_MATCH_MOCK.fashion;
  }, [category]);

  return (
    // 전체 화면 배경 흰색 고정
    <div className="min-h-screen bg-white">
      {/* Hero 영역 */}
      <HeroCarousel items={data.hero} />

      {/* 본문 */}
      <div className="bg-white px-5">
        {/* 카테고리 탭 */}
        <CategoryTabs value={category} onChange={setCategory} />

        {/* ===============================
            매칭률 높은 브랜드
           =============================== */}
        <section className="mt-6">
          <SectionHeader
            title="매칭률 높은 브랜드"
            subtitle="이런 브랜드가 매칭률이 가장 높아요!"
            onMore={() => console.log("more brands")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {data.topBrands.map((brand) => (
              <BrandCard key={brand.id} item={brand} />
            ))}
          </div>
        </section>

        {/* ===============================
            매칭률 높은 캠페인
           =============================== */}
        <section className="mt-7">
          <SectionHeader
            title="매칭률 높은 캠페인"
            subtitle="이런 캠페인이 매칭률이 가장 높아요!"
            onMore={() => console.log("more campaigns")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {data.topCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} item={campaign} variant="top" />
            ))}
          </div>
        </section>

        {/* ===============================
            크리에이터 프로필
           =============================== */}
        <section className="mt-7">
          <CreatorProfileCard model={data.creatorProfile} />
        </section>

        {/* ===============================
            인기 캠페인
           =============================== */}
        <section className="mt-8 pb-24">
          <SectionHeader
            title="인기 캠페인"
            subtitle="이런 캠페인이 인기가 많아요!"
            onMore={() => console.log("more popular")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {data.popularCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                item={campaign}
                variant="popular"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
