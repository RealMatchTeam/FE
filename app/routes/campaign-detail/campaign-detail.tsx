import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MiniLogo from "../../assets/logo/mini-logo.svg";
import BrandHero from "../brand-detail/components/BrandHero";
import BrandInfo from "../brand-detail/components/BrandInfo";
import CampaignActionBar from "./components/CampaignActionBar";
import OngoingCampaignSection from "../brand-detail/components/OngoingCampaignSection";

import { tokenStorage } from "../../lib/token";
import { apiClient } from "../../api/axios";
import { useCampaignProposalStore } from "../../stores/campaign-proposal";

import adCampaignImage from "../../assets/ad/ad-realmatch-detail-campagin.png";

import type { BrandDetailData } from "../brand-detail/types";
import type {
  CampaignDetail,
  CampaignDetailApiResponse,
} from "../campaign-detail/types";

import CampaignDetailSkeleton from "./components/CampaignDetailSkeleton";
import { toggleCampaignLike } from "./campaign-like";

type Props = {
  brandData: BrandDetailData;
  campaignId: number;
};

type OngoingCampaign = NonNullable<BrandDetailData["ongoingCampaigns"]>[number];

const fmtMoney = (n?: number) =>
  Number.isFinite(n) ? `${Number(n).toLocaleString()}원` : "-";

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

const getNumberField = (
  obj: unknown,
  keys: readonly string[],
): number | null => {
  if (!obj || typeof obj !== "object") return null;
  const rec = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) return v;
  }
  return null;
};

const getNestedNumberField = (
  obj: unknown,
  outerKey: string,
  innerKeys: readonly string[],
): number | null => {
  if (!obj || typeof obj !== "object") return null;
  const rec = obj as Record<string, unknown>;
  const nested = rec[outerKey];
  return getNumberField(nested, innerKeys);
};

const getCampaignIdFromOngoing = (c: OngoingCampaign): number | null =>
  getNumberField(c, ["campaignId", "campaign_id", "id"]);

const getBrandIdFromOngoing = (c: OngoingCampaign): number | null =>
  getNumberField(c, ["brandId", "brand_id"]) ??
  getNestedNumberField(c, "brand", ["brandId", "id"]);

const AD_CAMPAIGN: CampaignDetail = {
  campaignId: 0,
  title: "'리얼이 캐릭터 크림' 론칭 리뷰",
  description:
    "'리얼이 캐릭터 크림'\n겟레디윗미 영상에서 자연스럽게 노출",
  imageUrl: adCampaignImage,
  category: "BEAUTY",
  preferredSkills:
    "인스타 뷰티 분야 크리에이터 우대\n1~5만 마이크로 크리에이터 우대",
  schedule:
    "모집 : 2025년 1월 5~10일\n피드백 : 2025년 1월 17일\n업로드 : 2025년 1월 20~22일",
  videoSpec: "개수: 영상 1개 | 길이: 30초~1분",
  product: "리얼이 캐릭터 크림 1개",
  rewardAmount: 200000,
  startDate: "2025-01-05",
  endDate: "2025-01-22",
  recruitStartDate: "2025-01-05",
  recruitEndDate: "2025-01-10",
  dday: 0,
  quota: 10,
  contentTags: {
    viewerGenders: [],
    viewerAges: [],
    avgVideoLengths: [],
    avgVideoViews: [],
    formats: [{ id: 3, name: "인스타 릴스" }],
    categories: [
      { id: 6, name: "리뷰" },
      { id: 7, name: "겟레디윗미" },
    ],
    tones: [
      { id: 16, name: "일상적인" },
      { id: 17, name: "수다적인" },
    ],
    usageRanges: [
      { id: 24, name: "크리에이터 1차활용" },
      { id: 25, name: "브랜드 2차활용" },
    ],
    involvements: [{ id: 20, name: "가이드만 제공" }],
  },
  like: false,
};

export default function CampaignDetailContent({
  brandData,
  campaignId,
}: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setProposalData = useCampaignProposalStore((s) => s.setProposalData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [campaignId]);

  const heroUrl = brandData.brandImages?.[0] ?? brandData.heroImageUrl;

  const [isCampaignLiked, setIsCampaignLiked] = useState(false);

  const isAdCampaign = campaignId === 0;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(
    isAdCampaign ? AD_CAMPAIGN : null,
  );
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const [ongoingCampaigns, setOngoingCampaigns] = useState<OngoingCampaign[]>(
    brandData.ongoingCampaigns ?? [],
  );

  useEffect(() => {
    setOngoingCampaigns(brandData.ongoingCampaigns ?? []);
  }, [brandData.ongoingCampaigns]);

  const ongoingLikeInFlight = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (isAdCampaign) {
      setCampaign(AD_CAMPAIGN);
      setIsCampaignLiked(false);
      return;
    }

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
  }, [campaignId, isAdCampaign]);

  const detailRows = useMemo(() => {
    if (!campaign) return [];
    return [
      { label: "모집인원", value: `${campaign.quota}명` },
      { label: "우대사항", value: campaign.preferredSkills || "-" },
      { label: "제품협찬", value: campaign.product || "-" },
      {
        label: "원고료",
        value: `${fmtMoney(campaign.rewardAmount)} (VAT포함)`,
      },
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
      { label: "콘텐츠 종류", chips: joinTagNames(tags?.categories) },
      { label: "컨톤체 톤", chips: joinTagNames(tags?.tones) },
      { label: "콘텐츠 활용범위", chips: joinTagNames(tags?.usageRanges) },
      { label: "콘텐츠 관려도", chips: joinTagNames(tags?.involvements) },
    ];
  }, [campaign]);

  const handleChat = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }
    if (!brandData.brandUserId) return;
    navigate(`/rooms/brand/${brandData.brandUserId}`);
  };

  const handleToggleHeart = async (next: boolean) => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    const campaignIdNum = Number(campaignId);
    if (!Number.isFinite(campaignIdNum) || campaignIdNum < 0) return;

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

  const handleOngoingLikeToggle = async (id: string) => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    const clickedId = Number(id);
    if (!Number.isFinite(clickedId) || clickedId < 0) return;

    const currentItem = ongoingCampaigns.find((c) => {
      const cid = getCampaignIdFromOngoing(c);
      return cid === clickedId;
    });
    if (!currentItem) return;

    const cid = getCampaignIdFromOngoing(currentItem);
    if (!cid) return;

    if (ongoingLikeInFlight.current.has(cid)) return;
    ongoingLikeInFlight.current.add(cid);

    const prev =
      (currentItem as unknown as { isLiked?: boolean }).isLiked ?? false;
    const next = !prev;

    setOngoingCampaigns((prevList) =>
      prevList.map((c) => {
        const eachId = getCampaignIdFromOngoing(c);
        if (eachId !== clickedId) return c;
        return { ...(c as object), isLiked: next } as OngoingCampaign;
      }),
    );

    try {
      const serverStatus = await toggleCampaignLike(cid);
      if (typeof serverStatus === "boolean") {
        setOngoingCampaigns((prevList) =>
          prevList.map((c) => {
            const eachId = getCampaignIdFromOngoing(c);
            if (eachId !== clickedId) return c;
            return {
              ...(c as object),
              isLiked: serverStatus,
            } as OngoingCampaign;
          }),
        );
      }
    } catch {
      setOngoingCampaigns((prevList) =>
        prevList.map((c) => {
          const eachId = getCampaignIdFromOngoing(c);
          if (eachId !== clickedId) return c;
          return { ...(c as object), isLiked: prev } as OngoingCampaign;
        }),
      );
    } finally {
      ongoingLikeInFlight.current.delete(cid);
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
    if (!Number.isFinite(brandIdNum) || brandIdNum < 0) return;

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

  const goOngoingCampaignDetail = (c: OngoingCampaign) => {
    const cid = getCampaignIdFromOngoing(c);
    if (!cid) return;

    const domainParam = searchParams.get("domain");
    const domain =
      domainParam === "fashion" || domainParam === "beauty"
        ? domainParam
        : "beauty";

    const bidFromItem = getBrandIdFromOngoing(c);
    const brandIdFromQuery = Number(searchParams.get("brandId"));
    const fallbackBrandId = Number(brandData.id);

    const brandIdNum =
      bidFromItem ??
      (Number.isFinite(brandIdFromQuery) && brandIdFromQuery > 0
        ? brandIdFromQuery
        : Number.isFinite(fallbackBrandId) && fallbackBrandId > 0
          ? fallbackBrandId
          : null);

    if (!brandIdNum) return;

    navigate(
      `/campaign?brandId=${brandIdNum}&campaignId=${cid}&domain=${domain}`,
    );
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
            hashtags={brandData.hashtags ?? []}
            description={brandData.description}
            isAd={isAdCampaign}
          />

          <div className="my-3 flex items-center gap-2 text-core-1">
            <MetaItem
              icon={
                <span className="relative block h-[1.125rem] w-4 shrink-0">
                  <span className="absolute left-0 top-0.5 h-4 w-4 rounded-full border-[0.09375rem] border-core-1" />
                  <span className="absolute left-1/2 top-[0.22rem] -translate-x-1/2 text-[0.8125rem] font-semibold leading-none text-core-1">
                    i
                  </span>
                </span>
              }
              text={toDdayText(campaign.dday)}
            />

            <span className="h-2.5 w-px bg-core-3" />

            <span className="font-semibold leading-5 text-core-1">
              {campaign.quota}명
            </span>

            <span className="h-2.5 w-px bg-core-3" />

            <span className="font-semibold leading-5 text-core-1">
              {toKoreanCategory(campaign.category)}
            </span>
          </div>

          <CampaignActionBar
            isHearted={isCampaignLiked}
            onChat={handleChat}
            onSuggest={handleSuggest}
            onToggleHeart={handleToggleHeart}
          />

          <div className="my-3 h-px w-full bg-core-2" />

          <section>
            <div className="my-6 mx-2 overflow-hidden bg-bluegray-1">
              <img
                src={campaignImage}
                alt="campaign"
                className="h-[280px] w-full object-cover"
                draggable={false}
              />
            </div>

            <div className="text-center text-title text-text-black">
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

            <div className="mt-2.5 space-y-3">
              {contentRows.map((row) => (
                <DetailRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  chips={row.chips}
                />
              ))}
            </div>
          </section>

          <div className="mt-6 mb-9 mx-2">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-core-1"
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

          <OngoingCampaignSection
            campaigns={ongoingCampaigns}
            brandLogoUrl={brandData.logoImageUrl}
            onMore={() => {
              const domain = searchParams.get("domain");
              const categoryParam = domain === "fashion" ? "FASHION" : "BEAUTY";
              navigate(`/matching/campaign?type=${categoryParam}&search=${encodeURIComponent(brandData.name)}`);
            }}
            onCampaignClick={goOngoingCampaignDetail}
            onLikeToggle={handleOngoingLikeToggle}
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  chips,
}: {
  label: string;
  value?: string;
  chips?: string[];
}) {
  return (
    <div className="flex gap-4">
      <div className="w-23 shrink-0 text-title3 text-text-gray3">{label}</div>
      <div className="flex-1">
        {value ? (
          <div className="whitespace-pre-line text-title3 text-text-gray1">
            {value}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {(chips ?? []).map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-core-2 bg-bg-w px-2 py-1 text-callout1 text-text-gray1"
              >
                {c}
              </span>
            ))}
            {(!chips || chips.length === 0) && (
              <span className="text-title3 text-text-gray1">-</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MetaItem({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="leading-5 font-semibold text-core-1">{text}</span>
    </span>
  );
}
