import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NavigationHeader from "../../../components/common/NavigateHeader";
import ProductListCard from "../components/ProductListCard";
import { LayoutContext } from "../../layout-context";
import { fetchSponsorProductList } from "../../brand-detail/api/api";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import realmatchDetailCampaign from "../../../assets/ad/ad-realmatch-detail-campagin.png";

import type { SponsorProductsListDto } from "../../brand-detail/types";

type UiSponsorProduct = {
  productId: number;
  productName: string;
  imageUrl: string;
  subtitle: string;
};

type NavState = {
  brandId?: number;
  brandName?: string;
};

const buildSubtitle = (dto: SponsorProductsListDto) => {
  const name = (dto.productName ?? "").toString();
  const items = dto.sponsorInfo?.items ?? [];

  if (!items.length) return "";

  const parts = items
    .map((it) => {
      const qty =
        typeof it.availableQuantity === "number" && it.availableQuantity > 0
          ? `${it.availableQuantity}개`
          : "";

      const size =
        typeof it.availableSize === "number" && it.availableSize > 0
          ? `${it.availableSize}ml`
          : "";

      const left = [name, qty].filter(Boolean).join(" ").trim();
      const right = size.trim();

      return [left, right].filter(Boolean).join(" / ");
    })
    .filter(Boolean);

  return parts.join(" / ");
};

function toUiProducts(list: SponsorProductsListDto[]): UiSponsorProduct[] {
  return (list ?? []).map((p) => ({
    productId: p.productId,
    productName: p.productName ?? "",
    imageUrl: p.thumbnailImageUrl ?? "",
    subtitle: buildSubtitle(p),
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
  const [products, setProducts] = useState<UiSponsorProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const layout = useContext(LayoutContext);

  const canFetch = useMemo(
    () => Number.isFinite(brandId) && brandId !== undefined,
    [brandId],
  );

  useEffect(() => {
    if (!layout?.setHideHeader) return;

    layout.setHideHeader(true);
    return () => layout.setHideHeader(false);
  }, [layout]);

  useEffect(() => {
    if (!canFetch || brandId === undefined) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErrorText(null);

        // brandId=0일 때 하드코딩된 데이터 사용
        if (brandId === 0) {
          if (cancelled) return;
          setProducts([
            {
              productId: 0,
              productName: "리얼이 캐릭터 크림",
              imageUrl: realmatchDetailCampaign,
              subtitle: "리얼이 캐릭터 크림 1개",
            },
          ]);
          setLoading(false);
          return;
        }

        const list = await fetchSponsorProductList({
          brandId: String(brandId),
        });

        if (cancelled) return;

        setProducts(toUiProducts(list as SponsorProductsListDto[]));
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

  const goDetail = (product: UiSponsorProduct) => {
    if (brandId === undefined || !Number.isFinite(brandId)) return;
    if (!Number.isFinite(product.productId)) return;

    navigate(
      `/products/sponsorable/detail?brandId=${brandId}&productId=${product.productId}`,
      {
        state: {
          brandId,
          brandName,
          heroImageUrl: product.imageUrl,
          productName: product.productName,
        },
      },
    );
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="flex h-full w-full flex-col bg-grad-auth overflow-hidden">
        <div className="shrink-0">
          <NavigationHeader
            title="협찬 가능 제품"
            onBack={() => navigate(-1)}
          />
        </div>

        <div className="shrink-0 px-4 pt-6">
          <div className="text-callout1 text-core-1 truncate">
            {brandName || "브랜드"}
          </div>
          <div className="mt-1 flex h-5 items-center justify-between">
            <div className="text-title1 text-text-black truncate">
              협찬 가능 리스트
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
          <div className="flex flex-col gap-2.5">
            {loading && <LoadingSpinner className="py-10" />}

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
                  key={p.productId}
                  title={p.productName}
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
