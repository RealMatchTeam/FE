interface Props {
  title: string;
  subtitle: string;
  imageUrl: string;
  onClick?: () => void;
}

export default function ProductListCard({
  title,
  subtitle,
  imageUrl,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="flex w-full h-[100px] p-2.5 bg-white rounded-2xl text-left"
    >
      {/* 이미지 영역 */}
      <div className="mr-3 flex-shrink-0 w-[76px] h-[76px] rounded-xl overflow-hidden bg-bluegray-1">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="text-title1 text-text-black truncate">
          {title}
        </h3>

        <p className="mt-1 text-callout1 text-text-gray3 line-clamp-2">
          {subtitle}
        </p>
      </div>
    </button>
  );
}
