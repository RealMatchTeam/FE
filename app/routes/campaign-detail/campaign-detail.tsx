import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MiniLogo from "../../assets/logo/mini-logo.svg";
import BrandHero from "../brand-detail/components/BrandHero";
import BrandInfo from "../brand-detail/components/BrandInfo";
import CampaingActionBar from "./components/CampaignActionBar";
import OngoingCampaignSection from "../brand-detail/components/OngoingCampaignSection";

import { tokenStorage } from "../../lib/token";
import { apiClient } from "../../api/axios";
import { useCampaignProposalStore } from "../../stores/campaign-proposal";

import type { BrandDetailData } from "../brand-detail/types";
import type {
  CampaignDetail,
  CampaignDetailApiResponse,
} from "../campaign-detail/types";

import informationIconUrl from "../../assets/information-icon.svg?url";
import CampaignDetailSkeleton from "./components/CampaignDetailSkeleton";
import { toggleCampaignLike } from "./campaign-like";

type Props = {
  brandData: BrandDetailData;
  campaignId: number;
};

const fmtMoney = (n?: number) =>
  Number.isFinite(n) ? `${Number(n).toLocaleString()}원` : "-";

const formatDateOnly = (iso?: string) => {
  if (!iso) return "-";
  return iso.split("T")[0];
};

const joinTagNames = (items?: { name: string }[]) =>
  (items ?? []).map((x) => x.name).filter(Boolean);

const toKoreanCategory = (c?: string) => {
  if (c === "BEAUTY") return "뷰티";
  if (c === "FASHION") return "패션";
  return "-";
};

const toDdayText = (dday?: number) => {
  if (typeof dday !== "number" || !Number.isFinite(dday)) return "-";
  if (dday < 0) return "모집 완료";
  if (dday === 0) return "D-DAY";
  return `D-${dday}`;
};

export default function CampaignDetailContent({
  brandData,
  campaignId,
}: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setProposalData = useCampaignProposalStore((s) => s.setProposalData);

  const heroUrl = brandData.brandImages?.[0] ?? brandData.heroImageUrl;

  const [isCampaignLiked, setIsCampaignLiked] = useState(false);

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
        setIsCampaignLiked(res.data.result.like ?? false);
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
      { label: "원고료", value: `${fmtMoney(campaign.rewardAmount)} (VAT포함)` },
      { label: "일정", value: campaign.schedule || "-" },
      // {
      //   label: "모집기간",
      //   value: `${formatDateOnly(campaign.recruitStartDate)} ~ ${formatDateOnly(
      //     campaign.recruitEndDate,
      //   )}`,
      // },
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

  const ongoing = useMemo(
    () =>
      (brandData.ongoingCampaigns ?? []).filter(
        (c) => c.campaignId !== campaignId,
      ),
    [brandData, campaignId],
  );

  const handleChat = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }
    navigate(`/rooms/brand/${brandData.id}`);
  };
  const handleToggleHeart = async (next: boolean) => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    const campaignIdNum = Number(campaignId);
    if (!Number.isFinite(campaignIdNum) || campaignIdNum <= 0) return;

    const prev = isCampaignLiked;

    setIsCampaignLiked(next);

    try {
      const serverStatus = await toggleCampaignLike(campaignIdNum);

      if (typeof serverStatus === "boolean") {
        setIsCampaignLiked(serverStatus);
      }
    } catch {
      setIsCampaignLiked(prev);
    }
  };

  const handleSuggest = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    if (!campaign) return;

    const brandIdNum = Number(brandData.id);
    if (!Number.isFinite(brandIdNum) || brandIdNum <= 0) return;

    const domainParam = searchParams.get("domain");
    const domain =
      domainParam === "fashion" || domainParam === "beauty"
        ? domainParam
        : "beauty";

    setProposalData({
      brandId: brandIdNum,
      campaignId,
      domain,
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

    navigate("/matching/suggest");
  };

  const handleApply = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    if (!campaign) return;

    setProposalData({
      brandId: Number(searchParams.get("brandId")),
      campaignId,
      domain: searchParams.get("domain") || "beauty",
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

    navigate("/matching/apply");
  };

  if (campaignError) {
    return (
      <div className="w-full bg-bg-w">
        <div className="px-5 py-6 text-callout1 text-error">
          {campaignError}
        </div>
      </div>
    );
  }

  if (!campaign) {
    return <CampaignDetailSkeleton />;
  }

  const campaignImage = campaign.imageUrl ?? heroUrl;

  return (
    <div className="w-full overflow-x-hidden bg-bg-w">
      <div className="w-full bg-bg-w">
        <BrandHero
          heroImageUrl={heroUrl}
          logoImageUrl={brandData.logoImageUrl}
          logoText={brandData.logoText ?? ""}
        />

        <div className="px-3">
          <BrandInfo
            name={brandData.name}
            matchRate={brandData.matchRate}
            hashtags={(brandData.hashtags ?? []).slice(0, 2)}
            description={brandData.description}
          />

          <div className="my-3.5 flex items-center gap-2 text-title1 text-core-1 font-[16px]">
            <MetaItem
              icon={
                <img
                  src={informationIconUrl}
                  alt=""
                  className="block h-4 w- select-none"
                  draggable={false}
                />
              }
              text={toDdayText(campaign.dday)}
            />

            <span className="px-1 text-core-3">|</span>
            <span className="text-core-1">{campaign.quota}명</span>
            <span className="px-1 text-core-3">|</span>
            <span className="text-core-1">
              {toKoreanCategory(campaign.category)}
            </span>
          </div>

          <CampaingActionBar
            isHearted={isCampaignLiked}
            onChat={handleChat}
            onSuggest={handleSuggest}
            onToggleHeart={handleToggleHeart}
          />

          <div className="my-4 h-px w-full bg-core-2" />

          <section>
            <div className="my-6 mx-2 overflow-hidden bg-bluegray-1">
              <img
                src={campaignImage}
                alt="campaign"
                className="h-[280px] w-full object-cover"
                draggable={false}
              />
            </div>

            <div className=" text-center text-title text-text-black">
              {campaign.title}
            </div>
          </section>

          <section className="py-4 mx-4">
            <div className="text-title1 text-text-black my-3">상세 설명</div>
            <div className="mt-2.5 space-y-3">
              {detailRows.map((row) => (
                <DetailRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>
          </section>

          <div className="my-2 mx-auto w-3/4 border-t border-core-2" />

          <section className="py-4 mx-4">
            <div className="text-title1 text-text-black">콘텐츠</div>

            <div className="mt-2.5 space-y-3 text-callout1 text-text-gray3">
              {contentRows.map((row) => (
                <div key={row.label} className="flex">
                  <div className="w-21 shrink-0 text-title3 text-text-gray3">
                    {row.label}
                  </div>

                  <div className="flex-1 gap-[14px]">
                    {"value" in row && row.value ? (
                      <div className="whitespace-pre-line text-title3 text-text-gray1">
                        {row.value}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {(row.chips ?? []).map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center rounded-full border border-core-2 bg-bg-w px-2 py-1 text-callout1 text-text-gray1"
                          >
                            {c}
                          </span>
                        ))}
                        {(!row.chips || row.chips.length === 0) && (
                          <span>-</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-6 mb-9 mx-2">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex w-full h-13 items-center justify-center gap-2.5 rounded-xl bg-core-1"
            >
              <span className="flex items-center justify-center gap-2">
                <img
                  src={MiniLogo}
                  alt=""
                  className="h-4 w-6.5 select-none"
                  draggable={false}
                />
                <span className="text-title7 text-white">지원하기</span>
              </span>
            </button>
          </div>

          <OngoingCampaignSection campaigns={ongoing} onMore={() => {}} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-21 shrink-0 text-title3 text-text-gray3">{label}</div>
      <div className="whitespace-pre-line text-title3 text-text-gray1">
        {value}
      </div>
    </div>
  );
}

function MetaItem({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1">
      {icon ? (
        <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      ) : null}
      <span className="leading-none">{text}</span>
    </span>
  );
}
