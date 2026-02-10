import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NavigationHeader from "../../../../components/common/NavigateHeader";
import { LayoutContext } from "../../../layout-context";
import Button from "../../../../components/common/Button";
import { fetchSponsorProductDetail } from "../../api/api";

type SponsorAvailableItem = {
  itemId: number;
  availableType: string;
  availableQuantity: number;
  availableSize: number;
  sizeUnit: string;
};

type SponsorProductDetailResult = {
  brandId: number;
  brandName: string;
  productId: number;
  productName: string;
  productDescription: string;
  productImageUrls: string[];
  categories: string[];
  sponsorInfo: {
    items: SponsorAvailableItem[];
    shippingType: string;
  };
  action: {
    canProposeCampaign: boolean;
    proposeCampaignCtaText: string;
  };
};

type Envelope = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SponsorProductDetailResult;
};

type NavState = {
  brandId?: number;
  brandName?: string;
  heroImageUrl?: string;
  productName?: string;
};

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--color-core-3)] px-3 py-1 text-callout1 text-white">
      {children}
    </span>
  );
}

function mapType(t: string) {
  switch (t) {
    case "FULL":
      return "본품";
    case "SAMPLE":
      return "샘플";
    default:
      return t;
  }
}

function formatItems(items: SponsorAvailableItem[]) {
  return items
    .map((it) => {
      const type = mapType(it.availableType);
      const qty = Number.isFinite(it.availableQuantity)
        ? `${it.availableQuantity}개`
        : "";
      const size =
        Number.isFinite(it.availableSize) && it.sizeUnit
          ? `${it.availableSize}${it.sizeUnit}`
          : "";
      return `${type} ${qty}${size ? ` / ${size}` : ""}`.trim();
    })
    .filter(Boolean)
    .join(" · ");
}

function formatShipping(t: string) {
  switch (t) {
    case "CREATOR_PAY":
      return "크리에이터 부담";
    case "BRAND_PAY":
      return "브랜드 부담";
    default:
      return t;
  }
}

export default function SponsorableDetailContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  const layout = useContext(LayoutContext);
  const state = (location.state ?? {}) as NavState;

  const brandId = Number(sp.get("brandId")) || state.brandId;
  const productId = Number(sp.get("productId"));

  const canFetch =
    Number.isFinite(brandId) &&
    (brandId ?? 0) > 0 &&
    Number.isFinite(productId) &&
    productId > 0;

  const [data, setData] = useState<SponsorProductDetailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (!layout) return;

    layout.setHideHeader(true);

    return () => {
      layout.setHideHeader(false);
    };
  }, [layout]);

  useEffect(() => {
    if (!canFetch) {
      setErrorText("brandId/productId가 없어요.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErrorText(null);

        const res = await fetchSponsorProductDetail({
          brandId: String(brandId),
          productId,
        });

        if (cancelled) return;

        const maybe = res as unknown as Envelope;
        const next =
          maybe && typeof maybe === "object" && "result" in maybe
            ? maybe.result
            : (res as SponsorProductDetailResult);

        setData(next);
      } catch (e: unknown) {
        if (cancelled) return;
        setErrorText(
          e instanceof Error ? e.message : "제품 정보를 불러오지 못했어요.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brandId, productId, canFetch]);

  const heroUrl = state.heroImageUrl || data?.productImageUrls?.[0] || "";

  const itemsText = useMemo(() => {
    const items = data?.sponsorInfo?.items ?? [];
    return items.length ? formatItems(items) : "";
  }, [data]);

  const shippingText = useMemo(() => {
    return data ? formatShipping(data.sponsorInfo?.shippingType ?? "") : "";
  }, [data]);

  const showButton = !!data?.action?.canProposeCampaign;
  const buttonText = "제안하기";

  return (
    <div className="w-full h-full overflow-hidden">
      <div className=" w-full h-full overflow-hidden bg-bg-w relative flex flex-col">
        {/* 헤더 */}
        <div className="shrink-0 bg-bg-w">
          <NavigationHeader
            title="협찬 가능 제품"
            onBack={() => navigate(-1)}
          />
        </div>

        {/* 스크롤 영역 */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-bg-w">
          {loading && (
            <div className="px-5 py-16 text-center text-callout1 text-text-gray2">
              불러오는 중…
            </div>
          )}

          {!loading && errorText && (
            <div className="px-5 py-16 text-center text-callout1 text-text-gray2">
              {errorText}
            </div>
          )}

          {!loading && !errorText && data && (
            <div className={showButton ? "pb-15" : "pb-6"}>
              {heroUrl ? (
                <img
                  src={heroUrl}
                  alt={data.productName}
                  className="h-[360px] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="h-[360px] w-full bg-bluegray-1" />
              )}

              <div className="bg-bg-w px-5 pb-6 pt-5">
                <div className="text-callout1 text-text-gray3">
                  {data.brandName}
                </div>
                <div className="mt-2 text-title8 text-text-black">
                  {data.productName}
                </div>
                <div className="mt-2 text-title3 text-text-gray2">
                  {data.productDescription}
                </div>

                <div className="my-6 h-px w-full bg-bluegray-2" />

                <section>
                  <div className="text-title1 text-text-black">카테고리</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(data.categories ?? []).map((c) => (
                      <Pill key={c}>{c}</Pill>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <div className="text-title1 text-text-black">협찬 설명</div>

                  <div className="mt-4 space-y-5">
                    <div className="flex items-start gap-6">
                      <div className="w-14 shrink-0 text-title3 text-text-gray3">
                        품목
                      </div>
                      <div className="min-w-0 flex-1 text-title3 text-text-black">
                        {itemsText}
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-14 shrink-0 text-title3 text-text-gray3">
                        배송
                      </div>
                      <div className="min-w-0 flex-1 text-title3 text-text-black">
                        {shippingText}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>

        {showButton && (
          <div className="absolute bottom-0 w-full px-6 pb-6 pt-4 bg-bg-w safe-area-bottom">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() =>
                navigate("/matching/suggest/create", {
                  state: {
                    brandId: data?.brandId,
                    productId: data?.productId,
                    brandName: data?.brandName,
                    productName: data?.productName,
                  },
                })
              }
            >
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
