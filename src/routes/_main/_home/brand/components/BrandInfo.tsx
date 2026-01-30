const PRIMARY = "#6666E5";

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
      <div className="flex items-start justify-between">
        <div className="text-[20px] font-semibold tracking-tight text-text-black">
          {name}
        </div>

        {/* ✅ 기존 한 줄 유지 + 숫자만 크게 */}
        <div
          className="text-[14px] font-semibold leading-none"
          style={{ color: PRIMARY }}
        >
          <span>매칭률 </span>
          <span className="text-[24px] font-extrabold tracking-tight">
            {matchRate}%
          </span>
        </div>
      </div>

      <div className="mt-1 text-[12px] text-text-gray3">
        {hashtags.join(" ")}
      </div>

      <div className="mt-2 text-[12px] leading-5 text-text-gray2">
        {description}
      </div>
    </div>
  );
}
