import { createFileRoute } from "@tanstack/react-router";
import type { BrandDomain } from "./types";
import { useBrandDetail } from "./query";
import BrandDetailContent from "./brand-detail-content";

export const Route = createFileRoute("/_main/_home/brand/")({
  validateSearch: (search: Record<string, unknown>) => {
    const brandId =
      typeof search.brandId === "string" && search.brandId.length > 0
        ? search.brandId
        : "beplain";

    const domain: BrandDomain | undefined =
      search.domain === "beauty" || search.domain === "fashion"
        ? (search.domain as BrandDomain)
        : undefined;

    return { brandId, domain };
  },
  component: BrandDetailPage,
});

function BrandDetailPage() {
  const { brandId, domain } = Route.useSearch();
  console.log("BRAND SEARCH", brandId, domain);
  const { data, isLoading, isError } = useBrandDetail(brandId, domain);

  if (isLoading) {
    return <div className="min-h-screen bg-white px-5 py-6">로딩중…</div>;
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
