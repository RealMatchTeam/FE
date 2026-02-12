type Props = {
  name: string;
  matchRate: number;
  hashtags: string[];
  description: string;
};

export default function BrandInfo({
  name,
  matchRate,
  hashtags,
  description,
}: Props) {
  return (
    <div className="pt-10">
      <div className="flex items-center justify-between">
        <div className="text-title text-text-black">{name}</div>

        <div className="flex items-center gap-2">
          <span className="text-callout1 text-core-1 leading-none">매칭률</span>

          <span className="text-title text-core-1 leading-none">
            {matchRate}%
          </span>
        </div>
      </div>

      <div className=" text-title3 text-text-gray3">
        {hashtags
          .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
          .join(" ")}
      </div>

      <div className="mt-2 text-title3 text-text-gray1 mb-3.5">{description}</div>
    </div>
  );
}
