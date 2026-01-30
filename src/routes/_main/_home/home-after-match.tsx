import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { CategoryKey, HomeAfterMatchCategoryData } from "./types";
import { HOME_AFTER_MATCH_MOCK } from "./home.mock";
import HeroCarousel from "./components/HeroCarousel";
import CategoryTabs from "./components/CategoryTabs";
import SectionHeader from "./components/SectionHeader";
import BrandCard from "./components/BrandCard";
import CampaignCard from "./components/CampaignCard";
import CreatorProfileCard from "./components/CreatorProfileCard";

// ✅ index.tsx를 직접 import (barrel 금지)
import { Route as BrandIndexRoute } from "./brand/index";
import { Route as CampaignIndexRoute } from "./campaign/index";

export default function HomeAfterMatchPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryKey>("beauty");

  const data: HomeAfterMatchCategoryData = useMemo(() => {
    return category === "beauty"
      ? HOME_AFTER_MATCH_MOCK.beauty
      : HOME_AFTER_MATCH_MOCK.fashion;
  }, [category]);

  return (
    <div className="min-h-screen bg-white">
      <HeroCarousel items={data.hero} />

      <div className="bg-white px-5">
        <CategoryTabs value={category} onChange={setCategory} />

        {/* 매칭률 높은 브랜드 */}
        <section className="mt-6">
          <SectionHeader
            title="매칭률 높은 브랜드"
            subtitle="이런 브랜드가 매칭률이 가장 높아요!"
            onMore={() => console.log("more brands")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {data.topBrands.map((brand) => (
              <BrandCard
                key={brand.id}
                item={brand}
                onClick={() => {
                  console.log("CLICK BRAND", brand.id, brand.domain);
                  navigate({
                    to: BrandIndexRoute.to,
                    search: () => ({
                      brandId: brand.id,
                      domain: brand.domain,
                    }),
                  });
                }}
              />
            ))}
          </div>
        </section>

        {/* 매칭률 높은 캠페인 */}
        <section className="mt-7">
          <SectionHeader
            title="매칭률 높은 캠페인"
            subtitle="이런 캠페인이 매칭률이 가장 높아요!"
            onMore={() => console.log("more campaigns")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {data.topCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                item={campaign}
                variant="top"
                onClick={() => {
                  navigate({
                    to: CampaignIndexRoute.to,
                    search: () => ({
                      campaignId: campaign.id,
                    }),
                  });
                }}
              />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <CreatorProfileCard model={data.creatorProfile} />
        </section>

        {/* 인기 캠페인 */}
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
                onClick={() => {
                  navigate({
                    to: CampaignIndexRoute.to,
                    search: () => ({
                      campaignId: campaign.id,
                    }),
                  });
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
