export type ProductMiniCardItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type Props = {
  item: ProductMiniCardItem;
};

function ellipsis10(text: string) {
  return text.length > 10 ? `${text.slice(0, 10)}...` : text;
}

export default function ProductMiniCard({ item }: Props) {
  return (
    <div className="w-[118px] shrink-0">
      <div className="aspect-square overflow-hidden rounded-2xl bg-bluegray-2">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-2 text-[12px] font-medium text-text-black">
        {ellipsis10(item.title)}
      </div>
    </div>
  );
}
