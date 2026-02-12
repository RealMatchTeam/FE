type Props = {
  title: string;
  subtitle: string;
  imageUrl: string;
  onClick?: () => void;
};

export default function ProductListCard({
  title,
  subtitle,
  imageUrl,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-[10px] bg-bg-w-80 p-2.5 text-left"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[5px] bg-bluegray-1">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <h3 className="text-title1 text-text-black truncate">{title}</h3>

        <p className="mt-2 text-callout1 text-text-gray3 truncate">
          {subtitle}
        </p>
      </div>
    </button>
  );
}
