export type ProductMiniCardItem = {
  productId: number;
  productName: string;
  thumbnailImageUrl: string;
};

type Props = {
  item: ProductMiniCardItem;
  onClick?: () => void; 
};

const ellipsis10 = (text?: string | null) => {
  const safe = (text ?? "").toString();
  return safe.length > 10 ? `${safe.slice(0, 10)}...` : safe;
};

export default function ProductMiniCard({ item, onClick }: Props) {
  return (
    <div
      className="w-[120px] md:w-[140px] lg:w-[160px] shrink-0 mt-2 mb-2.5 cursor-pointer"
      onClick={onClick}
      role="button"
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-bluegray-2">
        <img
          src={item.thumbnailImageUrl}
          alt={item.productName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-2 text-title1 text-text-black">
        {ellipsis10(item.productName)}
      </div>
    </div>
  );
}
