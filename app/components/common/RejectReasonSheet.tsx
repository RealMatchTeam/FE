type RejectReasonSheetProps = {
  open: boolean;
  target: {
    brandName: string;
    campaignName: string;
    matchRate?: number;
  } | null;

  value: string;
  maxLength: number;
  isSubmitting?: boolean;

  onChange: (v: string) => void;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function RejectReasonSheet({
  open,
  target,
  value,
  maxLength,
  isSubmitting,
  onChange,
  onClose,
  onCancel,
  onConfirm,
}: RejectReasonSheetProps) {
  const len = value.length;
  const disabled = isSubmitting || value.trim().length === 0;
  console.log("RejectReasonSheet render");

  return (
    <>
      {/* Overlay */}
      <div
        className={[
            "fixed inset-0 z-[60] transition-opacity",
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        >
        <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
        />
      </div>

      {/* Sheet */}
      <div
        className={[
            "fixed left-0 right-0 bottom-0 z-[60]",
            "transition-transform duration-300 ease-out",
            open ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* 실제 375~430 컨테이너 안에서 꽉 차게 */}
        <div className="bg-white rounded-t-[18px] shadow-[0_-10px_30px_rgba(19,20,38,0.18)] border-t border-[#EEF0FF]">
          {/* 드래그 핸들 */}
          <div className="pt-3 pb-2 flex justify-center">
            <div className="w-[44px] h-[4px] rounded-full bg-[#D9D9E8]" />
          </div>

          {/* 헤더 */}
          <div className="px-4 pb-3 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#111]">제안 보기</div>
            {/* 필요하면 닫기 버튼 */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#777]"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* 브랜드 요약 영역 (스샷 상단 회색 박스 느낌) */}
          <div className="mx-4 bg-[#F2F3F7] rounded-[12px] p-3 flex items-center gap-3">
            <div className="w-[44px] h-[44px] rounded-[10px] bg-white border border-[#E6E6F3] flex items-center justify-center text-[10px] text-[#666] font-semibold">
              ROUND
              <br />
              LAB
            </div>

            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[#111] leading-[18px]">
                {target?.brandName ?? "-"}
              </div>
              <div className="mt-1 text-[11px] text-[#7A7A7A] leading-[14px]">
                #청정 자극 #저자극 #심플한 감성
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[#7A7A7A]">매칭률</div>
              <div className="text-[14px] font-semibold text-[#6666E5]">
                {target?.matchRate ?? "--"}%
              </div>
              <div className="text-[11px] text-[#7A7A7A] mt-1">검토 중</div>
            </div>
          </div>

          {/* 본문 */}
          <div className="px-4 pt-4 pb-4">
            <div className="text-[14px] text-[#666] font-semibold mb-2">
              브랜드 제안 캠페인
            </div>

            <div className="bg-[#F2F3F7] rounded-[12px] p-3">
              <div className="text-[12px] text-[#7A7A7A] mb-2">캠페인명</div>
              <div className="text-[16px] font-semibold text-[#111] leading-[22px]">
                {target?.campaignName ?? "-"}
              </div>

              <div className="mt-4 text-[13px] font-semibold text-[#111]">
                거절 이유
              </div>

              <div className="mt-2 bg-white rounded-[10px] border border-[#E6E6F3] p-3">
                <textarea
                  value={value}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (next.length > maxLength) return;
                    onChange(next);
                  }}
                  placeholder="거절 이유를 입력해주세요"
                  className="w-full min-h-[92px] resize-none outline-none text-[13px] leading-[18px] text-[#111] placeholder:text-[#B0B0C3]"
                />
                <div className="mt-1 flex justify-end text-[11px] text-[#9A9AB1]">
                  {len}/{maxLength}
                </div>
              </div>

              <div className="mt-2 text-[11px] text-[#9A9AB1]">
                *거절 이유 작성은 선택사항 입니다
              </div>
            </div>
          </div>

          {/* 하단 버튼 영역 (스샷처럼) */}
          <div className="px-4 pb-4">
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 h-[46px] rounded-[12px] bg-white border border-[#CFCFF4] text-[#6666E5] text-[14px] font-semibold"
                disabled={isSubmitting}
              >
                취소하기
              </button>

              <button
                onClick={onConfirm}
                className={[
                  "flex-1 h-[46px] rounded-[12px] text-[14px] font-semibold",
                  disabled ? "bg-[#CFCFF4] text-white" : "bg-[#6666E5] text-white",
                ].join(" ")}
                disabled={disabled}
              >
                {isSubmitting ? "처리 중..." : "거절하기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}