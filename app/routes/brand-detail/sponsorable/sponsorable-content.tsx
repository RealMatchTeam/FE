import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NavigationHeader from "../../../components/common/NavigateHeader";
import ProductListCard from "../components/ProductListCard";
import { LayoutContext } from "../../layout-context";
import { fetchSponsorProductList } from "../../brand-detail/api/api";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

type SponsorProduct = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
};

type NavState = {
  brandId?: number;
  brandName?: string;
};

type SponsorProductListResponseDto = {
  id: number;
  name: string;
  thumbnailImageUrl: string;
  totalCount: number;
  currentCount: number;
};

function toUiProducts(list: SponsorProductListResponseDto[]): SponsorProduct[] {
  return list.map((p) => ({
    id: p.id,
    title: p.name,
    subtitle: `${p.currentCount}/${p.totalCount}개 남음`,
    imageUrl: p.thumbnailImageUrl,
  }));
}

export default function SponsorableContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = (location.state ?? {}) as NavState;

  const brandIdFromQuery = Number(searchParams.get("brandId"));
  const brandId =
    state.brandId ??
    (Number.isFinite(brandIdFromQuery) ? brandIdFromQuery : undefined);

  const [brandName] = useState(state.brandName ?? "");
  const [products, setProducts] = useState<SponsorProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const layout = useContext(LayoutContext);

  const canFetch = useMemo(
    () => Number.isFinite(brandId) && (brandId ?? 0) > 0,
    [brandId],
  );

  // ✅ 헤더 숨김: “헤더만” 숨기고 화면(Outlet)은 계속 보여야 함
  useEffect(() => {
    if (!layout?.setHideHeader) return;

    layout.setHideHeader(true);
    return () => layout.setHideHeader(false);
  }, [layout]);

  useEffect(() => {
    if (!canFetch || !brandId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErrorText(null);

        const list = await fetchSponsorProductList({
          brandId: String(brandId),
        });
        if (cancelled) return;

        setProducts(toUiProducts(list));
      } catch (e: unknown) {
        if (cancelled) return;
        setErrorText(
          e instanceof Error
            ? e.message
            : "협찬 가능 제품을 불러오지 못했어요.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brandId, canFetch]);

  const goDetail = (product: SponsorProduct) => {
    if (!brandId || !Number.isFinite(brandId) || brandId <= 0) return;
    if (!Number.isFinite(product.id) || product.id <= 0) return;

    navigate(
      `/products/sponsorable/detail?brandId=${brandId}&productId=${product.id}`,
      {
        state: {
          brandId,
          brandName,
          heroImageUrl: product.imageUrl,
          productName: product.title,
        },
      },
    );
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-hidden flex flex-col bg-grad-auth">
        <div className="shrink-0">
          <NavigationHeader
            title="협찬 가능 제품"
            onBack={() => navigate(-1)}
          />
        </div>

        <div className="shrink-0 px-5 pt-4">
          <div className="text-callout1 text-core-1 truncate">
            {brandName || "브랜드"}
          </div>
          <div className="mt-1 text-title1 text-text-black truncate">
            협찬 가능 리스트
          </div>
        </div>

        <div className="flex-1 min-h-0 px-5 pb-6 overflow-y-auto">
          <div className="mt-4 space-y-3">
            {loading && (
              <LoadingSpinner className="py-10" />
            )}

            {!loading && errorText && (
              <div className="py-10 text-center text-callout1 text-text-gray2">
                {errorText}
              </div>
            )}

            {!loading && !errorText && products.length === 0 && (
              <div className="py-10 text-center text-callout1 text-text-gray2">
                협찬 가능한 제품이 없어요.
              </div>
            )}

            {!loading &&
              !errorText &&
              products.map((p) => (
                <ProductListCard
                  key={p.id}
                  title={p.title}
                  subtitle={p.subtitle}
                  imageUrl={p.imageUrl}
                  onClick={() => goDetail(p)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
