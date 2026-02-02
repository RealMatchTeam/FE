export default function ConfirmModal({
  title,
  desc,
  primaryText,
  onClose,
  onPrimary,

  showCloseIcon = false,
  icon = null,
  closeOnDim = false,
  widthClassName = "w-[343px]",
  heightClassName = "h-[214px]",
  containerClassName = "",
  dimClassName = "bg-[#17171833]",
  titleClassName = "text-[20px] leading-[24px]",
  descClassName = "text-[14px] leading-[20px] text-[#6B6B73]",
}: {
  title: React.ReactNode;
  desc?: React.ReactNode;
  primaryText: string;
  onClose: () => void;
  onPrimary: () => void;

  showCloseIcon?: boolean;      // 왼쪽 상단 X
  icon?: React.ReactNode;       // 상단 아이콘(느낌표)
  closeOnDim?: boolean;         // 딤 클릭 시 닫기
  widthClassName?: string;      // 모달 너비
  heightClassName?: string;     // 모달 높이
  containerClassName?: string;  // 모달 박스 추가 클래스
  dimClassName?: string;        // 딤 색
  titleClassName?: string;      // 타이틀 스타일
  descClassName?: string;       // 설명 스타일
}) {
  return (
    <div className="fixed inset-0 z-50">
      {/* dim */}
      {closeOnDim ? (
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={`absolute inset-0 ${dimClassName}`}
        />
      ) : (
        <div className={`absolute inset-0 ${dimClassName}`} />
      )}

      {/* modal */}
      <div
        className={[
          "absolute left-1/2 top-1/2",
          widthClassName,
          heightClassName,
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-[10px] bg-white shadow-xl",
          "flex flex-col",
          containerClassName,
        ].join(" ")}
      >
        {/* close icon */}
        {showCloseIcon ? (
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="absolute left-3 top-3 grid place-items-center w-8 h-8 rounded-full text-[#7B7D8A] active:bg-black/5"
          >
            <span className="text-[22px] leading-none">×</span>
          </button>
        ) : null}

        {/* content */}
        <div className="flex-1 px-5 flex flex-col justify-center">
          {/* icon */}
          {icon ? <div className="flex justify-center mb-4">{icon}</div> : null}

          <div className={`text-center font-semibold text-black ${titleClassName}`}>
            {title}
          </div>

          {desc ? (
            <div className={`mt-4 text-center ${descClassName}`}>
              {desc}
            </div>
          ) : null}
        </div>

        {/* buttons – bottom */}
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