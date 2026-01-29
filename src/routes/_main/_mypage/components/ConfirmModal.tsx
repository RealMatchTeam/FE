export default function ConfirmModal({
  title,
  desc,
  primaryText,
  onClose,
  onPrimary,
}: {
  title: string;
  desc?: string;
  primaryText: string;
  onClose: () => void;
  onPrimary: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      {/* dim */}
      <div className="absolute inset-0 bg-[#17171833]" />

      {/* modal */}
      <div
        className="
          absolute left-1/2 top-1/2
          w-[343px] h-[214px]
          -translate-x-1/2 -translate-y-1/2
          rounded-[10px] bg-white shadow-xl
          flex flex-col
        "
      >
        {/* content */}
        <div className="flex-1 px-5 flex flex-col justify-center">
          <div className="text-center text-[20px] leading-[24px] font-semibold text-black">
            {title}
          </div>

          {desc ? (
            <div className="mt-4 text-center text-[14px] leading-[20px] text-[#6B6B73]">
              {desc}
            </div>
          ) : null}
        </div>

        {/* buttons */}
        <div className="mt-auto px-5 pb-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                h-11 flex-1 rounded-[12px]
                border border-[#C8CCFF]
                bg-white text-[14px] leading-[18px]
                font-semibold text-[#6666E5]
                transition-colors active:bg-[#F3F4FF]
              "
            >
              취소
            </button>

            <button
              type="button"
              onClick={onPrimary}
              className="
                h-11 flex-1 rounded-[12px]
                bg-[#6666E5] text-[14px] leading-[18px]
                font-semibold text-white
                transition-colors active:bg-[#3F40C2]
              "
            >
              {primaryText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
