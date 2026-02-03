import { createFileRoute } from "@tanstack/react-router";
import BrandDetailContent from "./brand-detail-content";
import type { BrandDomain } from "./types";
import { useBrandDetail } from "./query";

export const Route = createFileRoute("/_main/_home/brand/")({
  validateSearch: (search: Record<string, unknown>) => {
    const brandId =
      typeof search.brandId === "string" ? search.brandId : "beplain";

    const domain =
      search.domain === "beauty" || search.domain === "fashion"
        ? (search.domain as BrandDomain)
        : undefined;

    return { brandId, domain };
  },
  component: BrandDetailPage,
});

function BrandDetailPage() {
  const { brandId, domain } = Route.useSearch();
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
