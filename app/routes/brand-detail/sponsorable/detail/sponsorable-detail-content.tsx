import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NavigationHeader from "../../../../components/common/NavigateHeader";
import { LayoutContext } from "../../../layout-context";
import Button from "../../../../components/common/Button";
import { fetchSponsorProductDetail } from "../../api/api";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import { useCampaignProposalStore } from "../../../../stores/campaign-proposal";

const INTERVAL = 3000;

type SponsorAvailableItem = {
  itemId: number;
  availableType: string;
  availableQuantity: number;
  availableSize: number;
  shippingType: string;
};

type SponsorProductDetailResult = {
  brandId: number;
  brandName: string;
  productId: number;
  productName: string;
  productImageUrls: string[];
  categories: string[];
  sponsorInfo: {
    items: SponsorAvailableItem[];
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

interface BannerItem {
  src: string;
  alt: string;
}

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-core-3 px-2 py-1 text-callout1 text-white">
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

function formatItems(productName: string, items: SponsorAvailableItem[]) {
  const name = (productName ?? "").toString();

  return (items ?? [])
    .map((it) => {
      const type = mapType((it.availableType ?? "").toString().trim());

      const qty =
        typeof it.availableQuantity === "number" && it.availableQuantity > 0
          ? `${it.availableQuantity}개`
          : "";

      const size =
        typeof it.availableSize === "number" && it.availableSize > 0
          ? `${it.availableSize}ml`
          : "";

      const left = [name, type, qty].filter(Boolean).join(" ").trim();
      const right = size.trim();

      return [left, right].filter(Boolean).join(" / ");
    })
    .filter(Boolean)
    .join(" / ");
}

function formatSubtitleNoQty(
  productName: string,
  items: SponsorAvailableItem[],
) {
  const name = (productName ?? "").toString();

  return (items ?? [])
    .map((it) => {
      const type = mapType((it.availableType ?? "").toString().trim());

      const size =
        typeof it.availableSize === "number" && it.availableSize > 0
          ? `${it.availableSize}ml`
          : "";

      const left = [name, type].filter(Boolean).join(" ").trim();
      const right = size.trim();

      return [left, right].filter(Boolean).join(" / ");
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

function resolveShipping(items: SponsorAvailableItem[]) {
  const types = Array.from(
    new Set(
      (items ?? [])
        .map((it) => (it.shippingType ?? "").toString().trim())
        .filter(Boolean),
    ),
  );

  if (types.length === 0) return "";
  if (types.length === 1) return formatShipping(types[0]);
  return types.map(formatShipping).join(" · ");
}

export default function SponsorableDetailContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const setProposalData = useCampaignProposalStore((state) => state.setProposalData);

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

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const banners: BannerItem[] = useMemo(() => {
    const urls = (data?.productImageUrls ?? [])
      .map((v) => (v ?? "").toString().trim())
      .filter(Boolean);

    return urls.map((src, idx) => ({
      src,
      alt: `${data?.productName ?? "제품"} 배너 ${idx + 1}`,
    }));
  }, [data?.productImageUrls, data?.productName]);

  const start = useCallback(() => {
    if (timerRef.current) return;
    if (banners.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, INTERVAL);
  }, [banners.length]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setCurrent(0);
    stop();
    start();
    return stop;
  }, [banners.length, start, stop]);

  useEffect(() => {
    if (!layout) return;
    layout.setHideHeader(true);
    return () => layout.setHideHeader(false);
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

  const itemsText = useMemo(() => {
    if (!data) return "";
    const items = data.sponsorInfo?.items ?? [];
    return items.length ? formatItems(data.productName, items) : "";
  }, [data]);

  const subtitleText = useMemo(() => {
    if (!data) return "";
    const items = data.sponsorInfo?.items ?? [];
    return items.length ? formatSubtitleNoQty(data.productName, items) : "";
  }, [data]);

  const shippingText = useMemo(() => {
    if (!data) return "";
    const items = data.sponsorInfo?.items ?? [];
    return resolveShipping(items);
  }, [data]);

  const showButton = true;
  const buttonText = "제안하기";

  return (
    <div className="h-full w-full overflow-hidden bg-bg-w">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg-w">
        <div className="shrink-0 bg-bg-w">
          <NavigationHeader
            title="협찬 가능 제품"
            onBack={() => navigate(-1)}
          />
        </div>
        <div className="h-px w-full bg-core-2" />

        <main className="min-h-0 flex-1 overflow-y-auto bg-bg-w">
          {loading && <LoadingSpinner className="py-16" />}

          {!loading && errorText && (
            <div className="px-5 py-16 text-center text-callout1 text-text-gray2">
              {errorText}
            </div>
          )}

          {!loading && !errorText && data && (
            <div className="pb-6">
              {banners.length ? (
                <div className="relative h-[450px] w-full overflow-hidden bg-bluegray-1">
                  <div
                    className="flex h-full w-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                  >
                    {banners.map((banner, i) => (
                      <div
                        key={`${data.productId}-banner-${i}`}
                        className="h-full w-full shrink-0"
                      >
                        <img
                          src={banner.src}
                          alt={banner.alt}
                          className="h-full w-full object-cover"
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>

                  {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                      {banners.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`banner ${i + 1}`}
                          onClick={() => {
                            stop();
                            setCurrent(i);
                            start();
                          }}
                          className={`h-[7px] w-[7px] rounded-full transition-colors ${
                            i === current ? "bg-white" : "bg-bg-w-60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[450px] w-full bg-bluegray-1" />
              )}

              <div className="bg-bg-w px-4 pt-4">
                <div className="w-full px-[5px]">
                  <div className="text-callout1 text-text-gray3">
                    {data.brandName}
                  </div>

                  <div className="mt-2 text-title1 text-text-black">
                    {data.productName}
                  </div>

                  {subtitleText ? (
                    <div className="mt-1 mb-3.5 text-callout1 text-text-gray1">
                      {subtitleText}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="h-px w-full bg-core-2" />

              <div className="flex flex-col gap-5 bg-bg-w px-5 pb-6 pt-6">
                <section className="px-[5px]">
                  <div className="text-title1 text-text-black">카테고리</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(data.categories ?? []).map((c) => (
                      <Pill key={c}>{c}</Pill>
                    ))}
                  </div>
                </section>

                <section className="px-[5px]">
                  <div className="text-title3 text-text-black">협찬 설명</div>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-[92px] shrink-0 text-title3 text-text-gray3">
                        품목
                      </div>
                      <div className="min-w-0 flex-1 text-title3 text-text-gray1">
                        {itemsText}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="w-[92px] shrink-0 text-title3 text-text-gray3">
                        배송
                      </div>
                      <div className="min-w-0 flex-1 text-title3 text-text-gray1">
                        {shippingText}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {showButton && (
                <div className="bg-bg-w px-6 pt-[14px] pb-6 safe-area-bottom">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setProposalData({
                        brandId: data?.brandId ?? 0,
                        brandName: data?.brandName,
                        product: data?.productName,
                        productId: data?.productId,
                        domain: "BEAUTY",
                      });
                      navigate("/matching/suggest/create?type=new");
                    }}
                  >
                    {buttonText}
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
