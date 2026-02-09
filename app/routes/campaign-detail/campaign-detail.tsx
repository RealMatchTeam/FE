import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import BrandHero from "../brand-detail/components/BrandHero";
import BrandInfo from "../brand-detail/components/BrandInfo";
import BrandActionBar from "../brand-detail/components/BrandActionBar";
import OngoingCampaignSection from "../brand-detail/components/OngoingCampaignSection";

import { tokenStorage } from "../../lib/token";
import { toggleBrandLike } from "../matching/api/matching";
import { apiClient } from "../../api/axios";

import type { BrandDetailData } from "../brand-detail/types";
import type {
  CampaignDetail,
  CampaignDetailApiResponse,
} from "../campaign-detail/types";

import informationIconUrl from "../../assets/information-icon.svg?url";

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
  if (typeof dday !== "number" || !Number.isFinite(dday)) {
    return "-";
  }

  if (dday < 0) return "모집 완료";
  if (dday === 0) return "D-DAY";

  return `D-${dday}`;
};

export default function CampaignDetailContent({
  brandData,
  campaignId,
}: Props) {
  const navigate = useNavigate();

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
    return brandData.ongoingCampaigns ?? [];
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

  if (campaignError) {
    return (
      <div className="min-h-screen bg-white px-5 py-6">{campaignError}</div>
    );
  }

  if (!campaign) {
    return <div className="min-h-screen bg-white px-5 py-6">로딩중...</div>;
  }

  const campaignImage = campaign.imageUrl ?? heroUrl;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen max-w-[430px] bg-white">
        <BrandHero
          heroImageUrl={heroUrl}
          logoImageUrl={brandData.logoImageUrl}
          logoText={brandData.logoText ?? ""}
        />

        <div className="px-5">
          <BrandInfo
            name={brandData.name}
            matchRate={brandData.matchRate}
            hashtags={(brandData.hashtags ?? []).slice(0, 2)}
            description={brandData.description}
          />

          <div className="mt-2 flex items-center gap-2 h-9 font-medium text-indigo-500">
            <MetaItem
              icon={
                <img
                  src={informationIconUrl}
                  alt=""
                  className="block h-4 w-4 "
                />
              }
              text={toDdayText(campaign.dday)}
            />

            <span className="px-1 text-indigo-300">|</span>

            <span>{campaign.quota}명</span>

            <span className="px-1 text-indigo-300">|</span>

            <span>{toKoreanCategory(campaign.category)}</span>
          </div>

          <BrandActionBar
            isHearted={isHearted}
            onChat={handleChat}
            onSuggest={() => {}}
            onToggleHeart={handleToggleHeart}
          />

          <div className="my-4 h-[1px] w-full bg-gray-200" />

          <section>
            <div className="mt-4 overflow-hidden bg-bluegray-1">
              <img
                src={campaignImage}
                alt="campaign"
                className="h-[280px] w-full object-cover"
              />
            </div>

            <div className="mt-2 text-center text-[16px] font-semibold text-text-black">
              {campaign.title}
            </div>
          </section>

          <section className="py-2">
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
          <div className="my-6 mx-auto w-3/4 border-t border-bluegray-2" />

          <section>
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

          <div className="mt-8 pb-10">
            <button className="h-12 w-full rounded-xl bg-indigo-500 text-[16px] font-semibold text-white">
              지원하기
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
      <div className="w-[84px] shrink-0 text-text-gray2">{label}</div>
      <div className="whitespace-pre-line">{value}</div>
    </div>
  );
}
/*
function DividerBlock() {
  return (
    <div className="relative left-1/2 mt-5 h-2 w-screen -translate-x-1/2 bg-bluegray-1" />
  );
}
  */

function MetaItem({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2">
      {icon && (
        <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      )}
      <span className="leading-none">{text}</span>
    </span>
  );
}
