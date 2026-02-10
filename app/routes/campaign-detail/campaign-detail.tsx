import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import BrandHero from "../brand-detail/components/BrandHero";
import BrandInfo from "../brand-detail/components/BrandInfo";
import BrandActionBar from "../brand-detail/components/BrandActionBar";
import OngoingCampaignSection from "../brand-detail/components/OngoingCampaignSection";

import { tokenStorage } from "../../lib/token";
import { toggleBrandLike } from "../matching/api/matching";
import { apiClient } from "../../api/axios";
import { useCampaignProposalStore } from "../../stores/campaign-proposal";

import type { BrandDetailData } from "../brand-detail/types";
import type {
  CampaignDetail,
  CampaignDetailApiResponse,
} from "../campaign-detail/types";

type Props = {
  brandData: BrandDetailData;
  campaignId: number;
};

const fmtMoney = (n?: number) =>
  Number.isFinite(n) ? `${Number(n).toLocaleString()}원` : "-";

const joinTagNames = (items?: { name: string }[]) =>
  (items ?? []).map((x) => x.name).filter(Boolean);

const formatDateOnly = (iso?: string) => {
  if (!iso) return "-";
  return iso.split("T")[0];
};

export default function CampaignDetailContent({
  brandData,
  campaignId,
}: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setProposalData = useCampaignProposalStore((state) => state.setProposalData);

  const heroUrl = brandData.brandImages?.[0] ?? brandData.heroImageUrl;
  const [isHearted, setIsHearted] = useState<boolean>(
    brandData.isLiked ?? false,
  );

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await apiClient.get<CampaignDetailApiResponse>(
          `/api/v1/campaigns/${campaignId}`,
        );

        if (!alive) return;

        if (!res.data?.isSuccess) {
          setCampaignError(
            res.data?.message || "캠페인 정보를 불러오지 못했어요.",
          );
          setCampaign(null);
          return;
        }

        setCampaign(res.data.result);
        setCampaignError(null);
      } catch {
        if (!alive) return;
        setCampaignError("캠페인 정보를 불러오지 못했어요.");
        setCampaign(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [campaignId]);

  const detailRows = useMemo(() => {
    if (!campaign) return [];
    return [
      { label: "모집인원", value: `${campaign.quota}명` },
      { label: "우대사항", value: campaign.preferredSkills || "-" },
      { label: "제품협찬", value: campaign.product || "-" },
      { label: "원고료", value: fmtMoney(campaign.rewardAmount) },
      { label: "일정", value: campaign.schedule || "-" },
      {
        label: "모집기간",
        value: `${formatDateOnly(campaign.recruitStartDate)} ~ ${formatDateOnly(
          campaign.recruitEndDate,
        )}`,
      },
    ];
  }, [campaign]);

  const contentRows = useMemo(() => {
    if (!campaign) return [];
    const tags = campaign.contentTags;

    return [
      { label: "설명", value: campaign.description || "-" },
      { label: "개수 및 길이", value: campaign.videoSpec || "-" },
      { label: "콘텐츠 형식", chips: joinTagNames(tags?.formats) },
      { label: "카테고리", chips: joinTagNames(tags?.categories) },
      { label: "톤", chips: joinTagNames(tags?.tones) },
      { label: "참여도", chips: joinTagNames(tags?.involvements) },
      { label: "사용 범위", chips: joinTagNames(tags?.usageRanges) },
    ];
  }, [campaign]);

  const ongoing = useMemo(() => {
    return (brandData.ongoingCampaigns ?? []).length
      ? brandData.ongoingCampaigns
      : [
          {
            campaignId: 101,
            brandName: brandData.name,
            title: "브이로그 협찬 캠페인",
            recruitQuota: 10,
            rewardAmount: 200000,
            imageUrl: "https://picsum.photos/400/300?random=ongoing-1",
            dday: 10,
            isLiked: false,
          },
          {
            campaignId: 102,
            brandName: brandData.name,
            title: "신규 런칭 제품 홍보 캠페인",
            recruitQuota: 8,
            rewardAmount: 150000,
            imageUrl: "https://picsum.photos/400/300?random=ongoing-2",
            dday: 3,
            isLiked: false,
          },
        ];
  }, [brandData]);

  const handleChat = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }
    navigate(`/rooms/brand/${brandData.id}`);
  };

  const handleToggleHeart = async () => {
    const brandIdNum = Number(brandData.id);
    if (!Number.isFinite(brandIdNum) || brandIdNum <= 0) return;

    const prev = isHearted;
    setIsHearted(!prev);

    try {
      const serverStatus = await toggleBrandLike(brandIdNum);
      setIsHearted(serverStatus);
    } catch {
      setIsHearted(prev);
    }
  };

  const handleSuggest = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    if (!campaign) return;

    // URL에서 brandId와 domain 가져오기
    const brandId = searchParams.get("brandId");
    const domain = searchParams.get("domain");

    // zustand에 캠페인 데이터 저장
    setProposalData({
      brandId: Number(brandId),
      campaignId,
      domain: domain || "beauty",
      brandName: brandData.name,
      campaignTitle: campaign.title,
      campaignDescription: campaign.description,
      rewardAmount: campaign.rewardAmount,
      product: campaign.product,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      contentTags: {
        formats: campaign.contentTags?.formats,
        categories: campaign.contentTags?.categories,
        tones: campaign.contentTags?.tones,
        involvements: campaign.contentTags?.involvements,
        usageRanges: campaign.contentTags?.usageRanges,
      },
    });

    // 먼저 /matching/suggest로 이동 (신규/기존 선택 화면)
    navigate("/matching/suggest");
  };

  const handleApply = () => {
    console.log("apply:", campaignId);
  };

  if (campaignError) {
    return (
      <div className="min-h-screen bg-white px-5 py-6">{campaignError}</div>
    );
  }

  if (!campaign) {
    return <div className="min-h-screen bg-white px-5 py-6">로딩중...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen max-w-[430px] bg-white">
        <BrandHero
          heroImageUrl={heroUrl}
          logoImageUrl={brandData.logoImageUrl}
          logoText={brandData.logoText ?? ""}
        />

        <div className="px-5 pb-24">
          <BrandInfo
            name={brandData.name}
            matchRate={brandData.matchRate}
            hashtags={(brandData.hashtags ?? []).slice(0, 2)}
            description={brandData.description}
          />

          <BrandActionBar
            isHearted={isHearted}
            onChat={handleChat}
            onSuggest={handleSuggest}
            onToggleHeart={handleToggleHeart}
          />

          <div className="my-4 h-[1px] w-full bg-gray-200" />

          <section className="py-4">
            <div className="mt-4 overflow-hidden rounded-2xl bg-bluegray-1">
              <img
                src={`https://picsum.photos/800/900?random=campaign-${campaignId}`}
                alt="campaign"
                className="h-[280px] w-full object-cover"
              />
            </div>

            <div className="mt-4 text-center text-[16px] font-semibold text-text-black">
              {campaign.title}
            </div>
          </section>

          <section className="py-5">
            <div className="text-[14px] font-semibold text-text-black">
              상세 설명
            </div>
            <div className="mt-3 space-y-2 text-[13px] text-text-gray3">
              {detailRows.map((row) => (
                <DetailRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>
          </section>

          <section className="py-5">
            <div className="text-[14px] font-semibold text-text-black">
              콘텐츠
            </div>
            <div className="mt-3 space-y-4 text-[13px] text-text-gray3">
              {contentRows.map((row) => (
                <div key={row.label} className="flex gap-4">
                  <div className="w-[84px] shrink-0 text-text-gray2">
                    {row.label}
                  </div>
                  <div className="flex-1">
                    {"value" in row && row.value ? (
                      <div className="whitespace-pre-line">{row.value}</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(row.chips ?? []).map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center rounded-full border border-bluegray-2 bg-white px-3 py-1 text-[12px] font-medium text-text-gray3"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <DividerBlock />

          <OngoingCampaignSection campaigns={ongoing} onMore={() => {}} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
          <div className="mx-auto max-w-[430px] px-5 pb-5 pt-3">
            <button
              type="button"
              onClick={handleApply}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-500 text-[16px] font-semibold text-white"
            >
              지원하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-[84px] shrink-0 text-text-gray2">{label}</div>
      <div className="whitespace-pre-line">{value}</div>
    </div>
  );
}

function DividerBlock() {
  return (
    <div className="relative left-1/2 mt-5 h-2 w-screen -translate-x-1/2 bg-bluegray-1" />
  );
}
