type Props = {
  fileName: string;
  type: "IMAGE" | "FILE";
};

export default function UploadingMessage({ fileName, type }: Props) {
  const label = type === "IMAGE" ? "이미지" : "파일";

  return (
    <div className="flex w-full justify-end">
      <div className="inline-flex items-end gap-[8px]">
        <div className="w-fit max-w-[240px] px-[10px] py-[10px] rounded-[10px] bg-[#B7B7F380] text-[12px] leading-[16px] break-words">
          <div className="flex items-center gap-2 text-[#5B5D6B]">
            <svg
              className="w-4 h-4 animate-spin shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#9B9BA1"
                strokeWidth="3"
                strokeDasharray="50 20"
                strokeLinecap="round"
              />
            </svg>
            <span className="truncate">
              {label} 전송중...
            </span>
          </div>
          <div className="mt-1 text-[10px] text-[#9B9BA1] truncate">
            {fileName}
          </div>
        </div>
      </div>
    </div>
  );
}
