import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import CampaignDetailContent from "./campaign-detail";
import CampaignDetailSkeleton from "./components/CampaignDetailSkeleton";
import { fetchBrandDetail } from "../brand-detail/api/api";
import type { BrandDetailData, BrandDomain } from "../brand-detail/types";
import { apiClient } from "../../api/axios";

type CampaignDetailResponse = {
  isSuccess: boolean;
  result: {
    brandId?: number;
    domain?: BrandDomain;
  };
};

export default function CampaignDetailRoute() {
  const [searchParams] = useSearchParams();

  const brandIdParam = searchParams.get("brandId");
  const domainParam = searchParams.get("domain");
  const campaignIdParam = searchParams.get("campaignId");
  const matchRateParam = searchParams.get("matchRate");

  const campaignId = useMemo(() => {
    const n = campaignIdParam ? Number(campaignIdParam) : NaN;
    return Number.isFinite(n) && n >= 0 ? n : null;
  }, [campaignIdParam]);

  const queryBrandId = useMemo(() => {
    const raw = brandIdParam?.trim();
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }, [brandIdParam]);

  const queryDomain: BrandDomain | null =
    domainParam === "beauty" || domainParam === "fashion" ? domainParam : null;

  // query에 없을 때만 채워질 fallback 값(= campaign detail에서 얻은 값)
  const [fallbackBrandId, setFallbackBrandId] = useState<number | null>(null);
  const [fallbackDomain, setFallbackDomain] = useState<BrandDomain | null>(
    null,
  );

  const resolvedBrandId = queryBrandId ?? fallbackBrandId;
  const resolvedDomain = queryDomain ?? fallbackDomain;

  const [data, setData] = useState<BrandDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // campaignId만 있고 brandId/domain이 없으면 campaign detail로 brandId/domain 확보
  useEffect(() => {
    if (campaignId === null) return;
    if (campaignId === 0) return; // 광고 캠페인은 API 호출 불필요
    if (queryBrandId && queryDomain) return; // query로 충분하면 스킵
    if (fallbackBrandId && fallbackDomain) return; // 이미 확보했으면 스킵

    let alive = true;

    (async () => {
      try {
        const res = await apiClient.get<CampaignDetailResponse>(
          `/api/v1/campaigns/${campaignId}`,
        );

        if (!alive) return;

        if (!res.data?.isSuccess) {
          setError("캠페인 정보를 불러오지 못했어요.");
          return;
        }

        const bId = res.data.result.brandId;
        const dom = res.data.result.domain;

        if (!bId || (dom !== "beauty" && dom !== "fashion")) {
          setError("캠페인 정보에서 brandId/domain을 찾지 못했어요.");
          return;
        }

        setFallbackBrandId(bId);
        setFallbackDomain(dom);
        setError(null);
      } catch {
        if (!alive) return;
        setError("캠페인 정보를 불러오지 못했어요.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [campaignId, queryBrandId, queryDomain, fallbackBrandId, fallbackDomain]);

  // brand detail fetch
  useEffect(() => {
    if (!resolvedBrandId) return;

    let alive = true;

    (async () => {
      try {
        const res = await fetchBrandDetail({
          brandId: String(resolvedBrandId),
          domain: resolvedDomain ?? undefined,
        });

        if (!alive) return;

        const paramRate = matchRateParam ? Number(matchRateParam) : NaN;
        if (Number.isFinite(paramRate) && paramRate > 0) {
          res.matchRate = paramRate;
        }

        setData(res);
        setError(null);
      } catch {
        if (!alive) return;
        setError("브랜드 정보를 불러오지 못했어요.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [resolvedBrandId, resolvedDomain, matchRateParam]);

  if (campaignId === null) {
    return (
      <div className="min-h-screen bg-white px-5 py-6">
        campaignId가 없어요.
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-white px-5 py-6">{error}</div>;
  }

  if (resolvedBrandId === null || !data) {
    return <CampaignDetailSkeleton />;
  }

  return <CampaignDetailContent brandData={data} campaignId={campaignId} />;
}
