import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import BrandHero from "./components/BrandHero";
import BrandInfo from "./components/BrandInfo";
import BrandActionBar from "./components/BrandActionBar";
import PillChip from "./components/PillChip";
import TagGroup from "./components/TagGroup";
import OngoingCampaignSection from "./components/OngoingCampaignSection";
import HistoryRow from "./components/HistoryRow";
import SponsorableProductSection from "./components/SponsorableProductSection";

import { tokenStorage } from "../../lib/token";
import { toggleBrandLike } from "../matching/api/matching";
import { useCampaignProposalStore } from "../../stores/campaign-proposal";

import { apiClient } from "../../api/axios";

import type { BrandDetailData } from "./types";
import type { ProductMiniCardItem } from "./components/ProductMiniCard";

type Props = { data: BrandDetailData };

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 6L11 12L17 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 6L5 12L11 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 6L13 12L7 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type TagGroupLike = { label: string; chips: unknown[] };
type TagSectionLike = { title: string; groups: TagGroupLike[] };

function normalizeChips(chips: unknown[]) {
  return (chips ?? [])
    .map((c) => {
      if (typeof c === "string") return `s:${c}`;
      if (typeof c === "number") return `n:${c}`;
      if (c && typeof c === "object") {
        const rec = c as Record<string, unknown>;
        if (typeof rec.id === "number" || typeof rec.id === "string") {
          return `id:${String(rec.id)}`;
        }
        if (typeof rec.name === "string") {
          return `name:${rec.name}`;
        }
        return `o:${JSON.stringify(rec)}`;
      }
      return `u:${String(c)}`;
    })
    .sort();
}

function groupSignature(g: TagGroupLike) {
  const chips = normalizeChips(g.chips).join("|");
  return `label:${g.label}__chips:${chips}`;
}

function sectionGroupsSignature(sec: TagSectionLike) {
  return (sec.groups ?? []).map(groupSignature).sort().join("||");
}

function shouldShowTitleByRules(sections: TagSectionLike[]) {
  if (sections.length <= 1) return false;

  const firstSig = sectionGroupsSignature(sections[0]);
  const allSame = sections.every((s) => sectionGroupsSignature(s) === firstSig);
  if (allSame) return false;

  return true;
}

type OngoingCampaign = NonNullable<BrandDetailData["ongoingCampaigns"]>[number];

const getNumberField = (
  obj: unknown,
  keys: readonly string[],
): number | null => {
  if (!obj || typeof obj !== "object") return null;
  const rec = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  }
  return null;
};

const getCampaignIdFromOngoing = (c: OngoingCampaign): number | null =>
  getNumberField(c, ["campaignId", "campaign_id", "id"]);

type SponsorProductsListItem = {
  productId: number;
  productName: string;
  thumbnailImageUrl?: string | null;
  productImageUrls?: string[] | null;
};

type SponsorProductsApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SponsorProductsListItem[];
};

export default function BrandDetailContent({ data }: Props) {
  const heroUrl = data.brandImages?.[0] ?? data.heroImageUrl;
  const [isHearted, setIsHearted] = useState<boolean>(data.isLiked ?? false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const brandId = Number(searchParams.get("brandId"));
  const validBrandId = Number.isFinite(brandId) && brandId >= 0;

  const setProposalData = useCampaignProposalStore(
    (state) => state.setProposalData,
  );

  const isHardcodedBeauty = brandId === 0 && searchParams.get("domain") === "beauty";

  const baseOngoingCampaigns = useMemo<OngoingCampaign[]>(
    () => data.ongoingCampaigns ?? [],
    [data.ongoingCampaigns],
  );

  const [ongoingLikeOverrides, setOngoingLikeOverrides] = useState<
    Record<number, boolean>
  >({});

  const adCampaign: OngoingCampaign = {
    campaignId: 0,
    brandName: "리얼매치",
    title: "'리얼이 커버터 크림' 론칭...",
    recruitQuota: 10,
    rewardAmount: 200000,
    dday: 0,
    isLiked: false,
  };

  const ongoingCampaigns = useMemo<OngoingCampaign[]>(() => {
    const overrides = ongoingLikeOverrides;

    const real = baseOngoingCampaigns.map((c) => {
      const cid = getCampaignIdFromOngoing(c);
      if (!cid) return c;

      if (Object.prototype.hasOwnProperty.call(overrides, cid)) {
        return { ...(c as object), isLiked: overrides[cid] } as OngoingCampaign;
      }
      return c;
    });

    return brandId === 0 ? [adCampaign, ...real] : real;
  }, [baseOngoingCampaigns, ongoingLikeOverrides, brandId]);

  const ongoingLikeInFlight = useRef<Set<number>>(new Set());

  const [sponsorProductsRaw, setSponsorProductsRaw] = useState<
    ProductMiniCardItem[]
  >([]);

  const sponsorProducts = useMemo<ProductMiniCardItem[]>(() => {
    if (!validBrandId) return [];
    // brandId=0일 때는 data.products를 직접 사용
    if (brandId === 0) return data.products ?? [];
    return sponsorProductsRaw;
  }, [validBrandId, brandId, data.products, sponsorProductsRaw]);

  useEffect(() => {
    if (!validBrandId) return;
    // brandId=0일 때는 API 호출 건너뛰기 (data.products 사용)
    if (brandId === 0) return;

    let alive = true;

    (async () => {
      try {
        const res = await apiClient.get<SponsorProductsApiResponse>(
          `/api/v1/brands/${brandId}/sponsor-products`,
        );

        if (!alive) return;

        if (!res.data?.isSuccess) {
          setSponsorProductsRaw([]);
          return;
        }

        const mapped: ProductMiniCardItem[] = (res.data.result ?? []).map(
          (p) => {
            const fallback =
              (p.productImageUrls ?? []).find(Boolean) ??
              p.thumbnailImageUrl ??
              "";

            return {
              productId: p.productId,
              productName: p.productName ?? "",
              thumbnailImageUrl: (p.thumbnailImageUrl ?? "") || fallback,
            };
          },
        );

        setSponsorProductsRaw(mapped);
      } catch {
        if (!alive) return;
        setSponsorProductsRaw([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [brandId, validBrandId]);

  const handleChat = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }
    if (!data.brandUserId) return;
    navigate(`/rooms/brand/${data.brandUserId}`);
  };

  const handleSuggest = () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }
    if (!validBrandId) return;

    const domain = searchParams.get("domain");

    setProposalData({
      brandId,
      campaignId: 0,
      domain: domain || "beauty",
      brandName: data.name,
      products: sponsorProducts.map((p) => ({
        id: String(p.productId),
        name: p.productName,
      })),
    });

    navigate("/matching/suggest");
  };

  const handleGoSponsorableProducts = () => {
    if (!validBrandId) return;

    navigate(`/products/sponsorable?brandId=${brandId}`, {
      state: {
        brandId,
        brandName: data.name,
        products: sponsorProducts,
      },
    });
  };

  const handleSponsorableProductClick = (productId: number) => {
    if (!validBrandId) return;
    if (!Number.isFinite(productId)) return;

    navigate(
      `/products/sponsorable/detail?brandId=${brandId}&productId=${productId}`,
      {
        state: {
          brandId,
          brandName: data.name,
        },
      },
    );
  };

  const handleToggleHeart = async () => {
    if (!validBrandId) return;

    const prev = isHearted;
    const next = !prev;
    setIsHearted(next);

    try {
      const serverStatus = await toggleBrandLike(brandId);
      setIsHearted(serverStatus);
    } catch {
      setIsHearted(prev);
    }
  };

  const goOngoingCampaignDetail = (c: OngoingCampaign) => {
    const cid = getCampaignIdFromOngoing(c) ?? (c.campaignId === 0 ? 0 : null);
    if (cid === null) return;

    const domainParam = searchParams.get("domain");
    const domain =
      domainParam === "fashion" || domainParam === "beauty"
        ? domainParam
        : "beauty";

    const brandIdNum = validBrandId
      ? brandId
      : Number.isFinite(Number(data.id)) && Number(data.id) >= 0
        ? Number(data.id)
        : null;

    if (brandIdNum === null) return;

    navigate(
      `/campaign?brandId=${brandIdNum}&campaignId=${cid}&domain=${domain}`,
    );
  };

  const handleOngoingLikeToggle = async (id: string) => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    const clickedId = Number(id);
    if (!Number.isFinite(clickedId) || clickedId <= 0) return;

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

    setOngoingLikeOverrides((m) => ({ ...m, [cid]: next }));

    ongoingLikeInFlight.current.delete(cid);
  };

  const PAGE_SIZE = 4;
  const GROUP_SIZE = 4;

  const histories = useMemo(() => {
    if (isHardcodedBeauty) {
      return [
        {
          id: "h1",
          title: "'리얼이 캐릭터 세럼' 론칭 리뷰",
          rightText: "1월 15일 진행예정",
          highlight: true,
        },
        {
          id: "h2",
          title: "'리얼이 캐릭터 토너' 론칭 리뷰",
          rightText: "12/15/24 완료",
          highlight: false,
        },
      ];
    }
    return data.histories ?? [];
  }, [isHardcodedBeauty, data.histories]);

  const hasNext = isHardcodedBeauty ? false : !!data.historiesHasNext;

  const [page, setPage] = useState(1);

  const knownPages = Math.max(1, Math.ceil(histories.length / PAGE_SIZE));
  const totalPages = hasNext ? Math.max(knownPages, page + 1) : knownPages;

  const groupIndex = Math.floor((page - 1) / GROUP_SIZE);
  const groupStart = groupIndex * GROUP_SIZE + 1;

  const displayPages = Array.from(
    { length: GROUP_SIZE },
    (_, i) => groupStart + i,
  );

  const canPrevGroup = groupStart > 1;

  const goPage = (p: number) => {
    if (p < 1) return;
    setPage(p);
  };

  const goPrevGroup = () => {
    if (!canPrevGroup) return;
    goPage(groupStart - GROUP_SIZE);
  };

  const canPrev = page > 1;
  const canNext = hasNext || page < totalPages;
  const canNextGroup = hasNext || groupStart + GROUP_SIZE <= totalPages;

  const startIdx = (page - 1) * PAGE_SIZE;
  const pageItems = histories.slice(startIdx, startIdx + PAGE_SIZE);

  const goPrev = () => {
    if (!canPrev) return;
    goPage(page - 1);
  };

  const goNext = () => {
    if (!canNext) return;
    goPage(page + 1);
  };

  const goNextGroup = () => {
    if (!canNextGroup) return;
    goPage(groupStart + GROUP_SIZE);
  };

  const tagSections = (data.tagSections ?? []) as unknown as TagSectionLike[];
  const showSectionTitle = shouldShowTitleByRules(tagSections);

  return (
    <div className="w-full bg-bg-w">
      <div className="w-full bg-bg-w">
        <BrandHero
          heroImageUrl={heroUrl}
          logoImageUrl={data.logoImageUrl}
          logoText={data.logoText ?? ""}
        />

        <div className="px-4">
          <BrandInfo
            name={data.name}
            matchRate={data.matchRate}
            hashtags={data.hashtags ?? []}
            description={data.description}
            isAd={brandId === 0}
          />

          <div className="mt-3.5">
            <BrandActionBar
              isHearted={isHearted}
              onChat={handleChat}
              onSuggest={handleSuggest}
              onToggleHeart={handleToggleHeart}
            />
          </div>

          <div className="mb-3 mt-4 h-px w-full bg-core-2" />

          <div className="py-9">
            <section className="pb-5">
              <div className="text-title1 text-text-black">카테고리</div>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {(isHardcodedBeauty
                  ? ["스킨케어"]
                  : (data.categories ?? [])
                ).map((c) => (
                  <PillChip key={c} variant="filled">
                    {c}
                  </PillChip>
                ))}
              </div>
            </section>

            <section>
              {(brandId === 0 && searchParams.get("domain") === "beauty"
                ? [
                  {
                    title: "스킨케어 태그",
                    groups: [
                      { label: "피부타입", chips: ["건성", "지성"] },
                      { label: "주요 기능", chips: ["수분/보습", "진정"] },
                    ],
                  },
                ]
                : (tagSections ?? [])
              ).map((sec, idx) => {
                const showTitle =
                  brandId === 0 && searchParams.get("domain") === "beauty"
                    ? true
                    : showSectionTitle;

                return (
                  <div
                    key={`${sec.title}-${idx}`}
                    className={idx ? "mt-5" : ""}
                  >
                    {showTitle ? (
                      <div className="text-title3 text-text-black">
                        {sec.title}
                      </div>
                    ) : null}

                    <div
                      className={showTitle ? "mt-2 space-y-1.5" : "space-y-1.5"}
                    >
                      {(sec.groups ?? []).map((g, gi) => (
                        <TagGroup
                          key={`${sec.title}-${g.label}-${gi}`}
                          label={g.label}
                          chips={g.chips as never}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>

          <DividerBlock />

          <OngoingCampaignSection
            campaigns={ongoingCampaigns}
            onMore={() => {
              const domain = searchParams.get("domain");
              const categoryParam = domain === "fashion" ? "FASHION" : "BEAUTY";
              navigate(`/matching/brand?type=${categoryParam}&search=${encodeURIComponent(data.name)}`);
            }}
            onCampaignClick={goOngoingCampaignDetail}
            onLikeToggle={handleOngoingLikeToggle}
          />

          <DividerBlock />

          <SponsorableProductSection
            products={sponsorProducts}
            onMore={handleGoSponsorableProducts}
            onProductClick={handleSponsorableProductClick}
          />

          <DividerBlock />

          <section className="py-9">
            <div className="text-title1 text-text-black">캠페인 내역</div>

            {histories.length === 0 ? (
              <div className="mt-2 inline-flex w-full flex-col items-start gap-2 bg-white">
                <div className="flex w-full flex-col items-start justify-center">
                  <div className="flex w-full flex-col items-start gap-[0.875rem] py-[3.75rem]">
                    <div className="flex w-full flex-col items-center justify-center gap-[0.625rem]">
                      <div className="w-[7.0625rem] text-center text-callout1 text-text-gray2">
                        진행한 캠페인이 없어요
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-3">
                  {pageItems.map((h) => (
                    <HistoryRow key={h.id} item={h} />
                  ))}
                </div>

                <div className="my-5 flex items-center justify-center gap-3">
                  {page > GROUP_SIZE && (
                    <button
                      type="button"
                      onClick={goPrevGroup}
                      className="grid h-7 w-7 place-items-center text-text-gray3"
                    >
                      <DoubleArrowLeftIcon />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="grid h-7 w-7 place-items-center text-text-gray3 disabled:opacity-30"
                  >
                    <ArrowLeftIcon />
                  </button>

                  <div className="flex items-center gap-3">
                    {displayPages.map((p) => {
                      const disabledPage = p > totalPages && !hasNext;
                      const active = p === page;

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => !disabledPage && goPage(p)}
                          disabled={disabledPage}
                          className={
                            active
                              ? "h-7 w-7 rounded-md text-[0.8125rem] font-semibold text-white"
                              : "h-7 w-7 rounded-md text-[0.8125rem] font-medium text-text-gray3 disabled:opacity-30"
                          }
                          style={
                            active ? { backgroundColor: "#A9ADFF" } : undefined
                          }
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="grid h-7 w-7 place-items-center text-text-gray3 disabled:opacity-30"
                  >
                    <ArrowRightIcon />
                  </button>

                  <button
                    type="button"
                    onClick={goNextGroup}
                    disabled={!canNextGroup}
                    className="grid h-7 w-7 place-items-center text-text-gray3 disabled:opacity-30"
                  >
                    <DoubleArrowRightIcon />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function DividerBlock() {
  return <div className="-mx-4 h-2.5 bg-bluegray-1" />;
}
