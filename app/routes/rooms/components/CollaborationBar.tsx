type Props = {
  thumbnailUrl?: string;
  title: string;
  subtitle: string;
};

export default function CollaborationSummaryBar({
  thumbnailUrl,
  title,
  subtitle,
}: Props) {
  return (
    <div>
      <div className="w-full max-w-[430px] h-[64px] bg-white flex items-center gap-3 px-3.5">
        {/* 썸네일 */}
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F3F4F8] flex items-center justify-center overflow-hidden shrink-0">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt=""
              className="w-[36px] h-[36px] object-cover rounded-[8px]"
            />
          ) : null}
        </div>

        {/* 텍스트 영역 */}
        <div className="min-w-0 flex flex-col justify-center gap-[2px]">
          <div className="flex items-center gap-2">
            <span
              className="
                bg-[#E6E6F3] text-[#6666E5] text-[10px] leading-[14px] px-[6px] py-[2px] rounded-[6px] shrink-0"
            >
              협업 중
            </span>

            <div className="text-[14px] leading-[20px] text-[#111] font-semibold truncate">
              {title}
            </div>
          </div>

          <div className="mt-[2px] text-[12px] leading-[16px] text-[#5B5D6B] truncate">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}