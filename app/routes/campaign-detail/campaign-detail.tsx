import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "../../components/common/Button";

import BrandHero from "../brand-detail/components/BrandHero";
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

import CampaignDetailSkeleton from "./components/CampaignDetailSkeleton";

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
      { label: "콘텐츠 종류", chips: joinTagNames(tags?.categories) },
      { label: "콘텐츠 톤", chips: joinTagNames(tags?.tones) },
      { label: "콘텐츠 관여도", chips: joinTagNames(tags?.involvements) },
      { label: "콘텐츠 활용범위", chips: joinTagNames(tags?.usageRanges) },
    ];
  }, [campaign]);

  const ongoing = useMemo(() => brandData.ongoingCampaigns ?? [], [brandData]);

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
      <div className="min-h-dvh bg-bluegray-1">
        <div className="mx-auto w-full max-w-[760px] px-4 py-6">
          <div className="rounded-2xl bg-bg-w p-5 text-callout1 text-error">
            {campaignError}
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) return <CampaignDetailSkeleton />;

  const campaignImage = campaign.imageUrl ?? heroUrl;

  return (
    <div className="min-h-dvh bg-bluegray-1">
      {/* responsive frame: mobile full-bleed, web centered card */}
      <div className="mx-auto w-full max-w-[760px] bg-bg-w md:my-6 md:overflow-hidden md:rounded-2xl md:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        {/* HERO (이미 있는 컴포넌트 유지) */}
        <BrandHero
          heroImageUrl={heroUrl}
          logoImageUrl={brandData.logoImageUrl}
          logoText={brandData.logoText ?? ""}
        />

        {/* INFO CARD (Figma: white section, 16px padding) */}
        <div className="bg-bg-w px-4 pb-6 pt-3 sm:px-5 md:px-6">
          <div className="flex flex-col gap-3">
            {/* 상단: 브랜드명 + 매칭률 */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[20px] font-semibold leading-[26px] text-text-black">
                  {brandData.name}
                </div>
                <div className="mt-1 line-clamp-1 text-[14px] font-medium leading-5 text-text-gray2">
                  {(brandData.hashtags ?? [])
                    .slice(0, 3)
                    .map((t) => `#${t}`)
                    .join(" ")}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[12px] font-medium leading-4 text-core-1">
                  매칭률
                </div>
                <div className="mt-0.5 text-[20px] font-semibold leading-[26px] text-core-1">
                  {Number.isFinite(brandData.matchRate)
                    ? `${brandData.matchRate}%`
                    : "-"}
                </div>
              </div>
            </div>

            {/* 한 줄 소개 */}
            <div className="text-[14px] font-medium leading-5 text-core-4">
              {brandData.description ?? "-"}
            </div>

            {/* 모집 상태 메타 (Figma 스타일) */}
            <div className="flex items-center gap-2 text-core-1">
              <span className="inline-flex h-[18px] w-[16px] items-center justify-center">
                <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-core-1">
                  <span className="text-[13px] font-semibold leading-none text-core-1">
                    i
                  </span>
                </span>
              </span>

              <div className="flex items-center gap-2 text-[16px] font-semibold leading-5 text-core-1">
                <span>{toDdayText(campaign.dday)}</span>
                <span className="h-4 w-px bg-core-3/60" />
                <span>{campaign.quota}명</span>
                <span className="h-4 w-px bg-core-3/60" />
                <span>{toKoreanCategory(campaign.category)}</span>
              </div>
            </div>

            {/* 액션 버튼 3개 (Figma: 채팅/제안 + 하트) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleChat}
                className="h-[30px] w-[150px] rounded-[6px] bg-bluegray-1 px-4 text-[14px] font-medium leading-5 text-text-black md:w-[180px]"
              >
                채팅하기
              </button>

              <button
                type="button"
                onClick={handleSuggest}
                className="h-[30px] flex-1 rounded-[6px] bg-bluegray-1 px-4 text-[14px] font-medium leading-5 text-text-black"
              >
                제안하기
              </button>

              <button
                type="button"
                aria-pressed={isHearted}
                onClick={handleToggleHeart}
                className="grid h-[30px] w-[30px] place-items-center rounded-[6px] bg-bluegray-1"
              >
                {/* 단순 하트(디자인 토큰에 맞춰 최소 구현) */}
                <span
                  className={[
                    "inline-block h-5 w-5",
                    isHearted ? "text-core-2" : "text-core-3",
                  ].join(" ")}
                >
                  {isHearted ? "♥" : "♡"}
                </span>
              </button>
            </div>

            <div className="h-px w-full bg-bluegray-2" />
          </div>

          {/* 캠페인 이미지 (Figma: 중앙 정사각형, max 334) */}
          <section className="py-6">
            <div className="mx-auto w-full max-w-[334px]">
              <div className="aspect-square overflow-hidden rounded-2xl bg-bluegray-1">
                <img
                  src={campaignImage}
                  alt="campaign"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>

            <div className="mt-6 text-center text-[20px] font-semibold leading-[26px] text-text-black">
              {campaign.title}
            </div>
          </section>

          {/* 상세 설명 */}
          <section className="pb-6">
            <div className="text-[16px] font-semibold leading-5 text-core-4">
              상세 설명
            </div>
            <div className="mt-3 space-y-2 text-[14px] font-medium leading-5 text-core-4">
              {detailRows.map((row) => (
                <DetailRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>
          </section>

          {/* 중간 구분선 (Figma: 짧은 라인) */}
          <div className="mx-auto my-2 h-px w-[254px] bg-bluegray-2" />

          {/* 콘텐츠 */}
          <section className="py-6">
            <div className="text-[16px] font-semibold leading-5 text-core-4">
              콘텐츠
            </div>

            <div className="mt-4 space-y-4 text-[14px] font-medium leading-5 text-core-4">
              {contentRows.map((row) => (
                <div key={row.label} className="flex gap-2">
                  <div className="w-[92px] shrink-0 text-text-gray2">
                    {row.label}
                  </div>
                  <div className="min-w-0 flex-1">
                    {"value" in row && row.value ? (
                      <div className="whitespace-pre-line break-words">
                        {row.value}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {(row.chips ?? []).map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center rounded-full border border-bluegray-2 bg-bg-w px-2 py-1 text-[12px] font-medium leading-4 text-core-4"
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

          {/* 하단 버튼 (Figma: 16px 좌우, 52px 높이, 라운드 12) */}
          <div className="pb-8">
            <div className="sticky bottom-0 -mx-4 bg-bg-w px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 sm:-mx-5 sm:px-5 md:static md:mx-0 md:px-0 md:pb-0">
              <Button
                type="button"
                variant="primary"
                size="lg"
                withLogo
                fullWidth
                onClick={handleApply}
              >
                지원하기
              </Button>
            </div>
          </div>
        </div>

        {/* 진행 중인 다른 캠페인 */}
        <div className="h-2 bg-bluegray-1" />
        <div className="bg-bg-w px-4 py-9 sm:px-5 md:px-6">
          <OngoingCampaignSection campaigns={ongoing} onMore={() => {}} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-[92px] shrink-0 text-text-gray2">{label}</div>
      <div className="min-w-0 flex-1 whitespace-pre-line break-words text-core-4">
        {value}
      </div>
    </div>
  );
}
