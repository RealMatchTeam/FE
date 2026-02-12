export type ProductMiniCardItem = {
  productId: number;
  productName: string;
  thumbnailImageUrl: string;
};

type Props = {
  item: ProductMiniCardItem;
  onClick?: () => void; 
};

export default function ProductMiniCard({ item, onClick }: Props) {
  return (
    <div
      className="w-[150px] md:w-[170px] lg:w-[190px] shrink-0 mt-2 mb-2.5 cursor-pointer"
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

      <div className="mt-2 line-clamp-1 text-title1 text-text-black">
        {item.productName}
      </div>
    </div>
  );
}
