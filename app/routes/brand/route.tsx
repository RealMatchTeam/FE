import { useSearchParams } from "react-router";
import BrandDetailContent from "./brand-detail-content";
import { useBrandDetail } from "./query";
import type { BrandDomain } from "../../types/brand";

import LoadingView from "../../components/common/LoadingView";

export default function BrandDetailPage() {
  const [searchParams] = useSearchParams();

  const brandId = searchParams.get("brandId") || "beplain";
  const domainParam = searchParams.get("domain");
  const domain: BrandDomain | undefined =
    domainParam === "beauty" || domainParam === "fashion"
      ? (domainParam as BrandDomain)
      : undefined;

  const { data, isLoading, isError } = useBrandDetail(brandId, domain);

  if (isLoading) {
    return <LoadingView message="브랜드 정보를 불러오는 중이에요" />;
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-white px-5 py-6">
        데이터를 불러오지 못했어요.
      </div>
    );
  }

  return <BrandDetailContent data={data} />;
}
