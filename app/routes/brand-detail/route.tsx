import { useSearchParams } from "react-router";
import BrandDetailContent from "./brand-detail-content";
import BrandDetailSkeleton from "./components/BrandDetailSkeleton";
import { useBrandDetail } from "./query";
import type { BrandDomain } from "./types";

export default function BrandDetailPage() {
  const [searchParams] = useSearchParams();

  const brandIdParam = searchParams.get("brandId");
  const brandId =
    brandIdParam && brandIdParam.trim().length > 0 ? brandIdParam : undefined;

  const domainParam = searchParams.get("domain");
  const domain: BrandDomain | undefined =
    domainParam === "beauty" || domainParam === "fashion"
      ? (domainParam as BrandDomain)
      : undefined;

  const { data, isLoading, isError } = useBrandDetail(brandId ?? "", domain);

  if (!brandId) {
    return (
      <div className="min-h-screen bg-white px-5 py-6">brandId가 없어요.</div>
    );
  }

  if (isLoading) {
    return <BrandDetailSkeleton />;
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
