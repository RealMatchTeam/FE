import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import FilterBottomSheet from "../../business/components/FilterBottomSheet";
import FilterButton from "../../../components/common/FilterButton";

type BrandLike = {
  id: number;
  name: string;
  tags: string[];
  matchRate: number;
  logoText?: string;
};

type CampaignLike = {
  id: number;
  brand: string;
  title: string;
  matchRate: number;
  reward: number;
  dday: string;
  applicants: string;
  logoText?: string;
};

const BRAND_LIKES: BrandLike[] = [
  {
    id: 1,
    name: "라운드랩",
    tags: ["#청정자극", "#저자극", "#심플한 감성"],
    matchRate: 99,
    logoText: "ROUND\nLAB",
  },
  {
    id: 2,
    name: "비플레인",
    tags: ["#비건", "#천연재료"],
    matchRate: 98,
    logoText: "beplain",
  },
  {
    id: 3,
    name: "이즈앤트리",
    tags: ["#클린 뷰티", "#저자극", "#성분 중심"],
    matchRate: 79,
    logoText: "Isntree",
  },
];

const CAMPAIGN_LIKES: CampaignLike[] = [
  {
    id: 1,
    brand: "비플레인",
    title: "‘글로우업' 선크림 신제품 홍보",
    matchRate: 98,
    reward: 100000,
    dday: "D-Day",
    applicants: "5명",
    logoText: "beplain",
  },
  {
    id: 2,
    brand: "라운드랩",
    title: "‘글로우잇미' 크림 신제품 홍보",
    matchRate: 89,
    reward: 100000,
    dday: "D-3",
    applicants: "3/6명",
    logoText: "ROUND\nLAB",
  },
  {
    id: 3,
    brand: "이즈앤트리",
    title: "비타크림 신제품 체험단 모집",
    matchRate: 79,
    reward: 150000,
    dday: "D-5",
    applicants: "2/7명",
    logoText: "Isntree",
  },
];

export default function MyPageLikes() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"brand" | "campaign">("brand");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("정렬 필터");

  const getSortButtonLabel = () => sortOption;

  const brandLikes = useMemo(() => {
    const list = [...BRAND_LIKES];
    if (sortOption === "매칭률 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "인기 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "신규 순") {
      return list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [sortOption]);

  const campaignLikes = useMemo(() => {
    const list = [...CAMPAIGN_LIKES];
    if (sortOption === "매칭률 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "인기 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "금액 순") {
      return list.sort((a, b) => b.reward - a.reward);
    }
    if (sortOption === "마감 순") {
      return list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [sortOption]);

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="내 찜" onBack={() => navigate(-1)} />
        </div>

        <div className="border-b border-[#E8E8FB]">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("brand")}
              className={[
                "flex-1 py-4 text-[16px] font-semibold",
                activeTab === "brand"
                  ? "text-[#4A4DFF] border-b-2 border-[#4A4DFF]"
                  : "text-[#9B9BA1]",
              ].join(" ")}
            >
              찜한 브랜드
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("campaign")}
              className={[
                "flex-1 py-4 text-[16px] font-semibold",
                activeTab === "campaign"
                  ? "text-[#4A4DFF] border-b-2 border-[#4A4DFF]"
                  : "text-[#9B9BA1]",
              ].join(" ")}
            >
              찜한 캠페인
            </button>
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 60px - 56px)" }}
        >
          <div className="bg-gradient-to-b from-[#F2F3FF] to-white px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-[18px] font-semibold text-black">
                {activeTab === "brand" ? "브랜드 리스트" : "캠페인 리스트"}
              </div>
              <FilterButton
                label={getSortButtonLabel()}
                isActive={sortOption !== "정렬 필터"}
                onClick={() => {
                  setIsFilterOpen(true);
                }}
              />
            </div>

            <div className="mt-4 space-y-4">
              {activeTab === "brand"
                ? brandLikes.map((brand) => (
                    <div
                      key={brand.id}
                      className="bg-white rounded-[14px] border border-[#E8E8FB] px-[10px] py-[10px] flex gap-4 items-center h-[100px]"
                    >
                      <div className="w-[80px] h-[80px] rounded-[12px] border border-[#E8E8FB] grid place-items-center text-[#1D1D1F] text-[16px] font-semibold whitespace-pre text-center">
                        {brand.logoText ?? brand.name}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[18px] font-semibold text-[#171718] truncate">
                            {brand.name}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-[#6D6AFE] text-[14px] font-semibold">
                              매칭률 {brand.matchRate}%
                            </div>
                            <button
                              type="button"
                              className="text-[#B7B7F3] text-[20px]"
                              aria-label="찜 해제"
                            >
                              ♥
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-[13px] text-[#8B8D99] truncate">
                          {brand.tags.join(" ")}
                        </div>
                      </div>
                    </div>
                  ))
                : campaignLikes.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-white rounded-[14px] border border-[#E8E8FB] px-[12px] py-[12px] flex gap-4 items-start"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-[96px] h-[96px] rounded-[12px] border border-[#E8E8FB] grid place-items-center text-[#1D1D1F] text-[16px] font-semibold whitespace-pre text-center">
                          {campaign.logoText ?? campaign.brand}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full border border-[#6D6AFE] text-[#6D6AFE] text-[12px]">
                            {campaign.dday}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#EEF0FF] text-[#6D6AFE] text-[12px]">
                            {campaign.applicants}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-[20px] font-semibold text-[#171718] truncate">
                            {campaign.brand}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-[#6D6AFE] text-[16px] font-semibold">
                              매칭률 {campaign.matchRate}%
                            </div>
                            <button
                              type="button"
                              className="text-[#B7B7F3] text-[22px] leading-none"
                              aria-label="찜 해제"
                            >
                              ♥
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-[16px] text-[#171718] truncate">
                          {campaign.title}
                        </div>
                        <div className="mt-2 text-[14px] text-[#6D6AFE] font-semibold">
                          원고료: {campaign.reward.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <FilterBottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filter) => setSortOption(filter)}
          currentFilter={sortOption}
          filters={
            activeTab === "brand"
              ? ["정렬 필터", "매칭률 순", "인기 순", "신규 순"]
              : ["정렬 필터", "매칭률 순", "인기 순", "금액 순", "마감 순"]
          }
          title="정렬 필터"
        />
      </div>
    </div>
  );
}
