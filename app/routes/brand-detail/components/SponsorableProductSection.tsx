import ProductMiniCard from "./ProductMiniCard";
import type { ProductMiniCardItem } from "./ProductMiniCard";

type Props = {
  products: ProductMiniCardItem[];
  onMore?: () => void;
  onProductClick?: (productId: number) => void;
};

export default function SponsorableProductSection({
  products,
  onMore,
  onProductClick,
}: Props) {
  const isEmpty = products.length === 0;

  return (
    <section className="py-9">
      <div className="flex items-center justify-between">
        <div className="text-title1 text-text-black">협찬 가능 제품</div>

        {onMore ? (
          <button
            type="button"
            onClick={onMore}
            className="mt-0.5 grid h-6 w-6 place-items-center"
            aria-label="more"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="#9B9BA1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {isEmpty ? (
        <div className="mt-2 inline-flex w-full flex-col items-start gap-2 bg-white">
          <div className="flex h-[126px] w-full flex-col items-start justify-center">
            <div className="flex w-full flex-col items-start gap-[14px] py-[60px]">
              <div className="flex w-full flex-col items-center justify-center gap-[10px]">
                <div className="w-[113px] text-center text-callout1 text-text-gray2">
                  협찬 가능한 제품이 없어요
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-2 -mx-4 overflow-x-hidden">
          <div className="px-4 overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-4">
              {products.map((p, idx) => (
                <ProductMiniCard
                  key={`${p.productId}-${idx}`}
                  item={p}
                  onClick={() => onProductClick?.(p.productId)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
