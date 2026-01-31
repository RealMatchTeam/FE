import { type ChatMessage } from "./TextMessageTypes";
import { useNavigate } from "@tanstack/react-router";
import MessageStatus from "./MessageStatus";

type Props = {
  message: ChatMessage;
};
//onRetry: (id: string) => void;
//onDelete: (id: string) => void;

export default function MatchedCampaignMessage({ message, }: Props) {
  const timeText = message.time ?? "";
  const avatarSize = 38;
  const avatarSrc = undefined;
  const navigate = useNavigate();

  return (
    <div className="flex justify-start">
      <div className="w-fit flex items-start gap-[10px] max-w-full">
        {/* avatar */}
        <div
          className="shrink-0 rounded-[10px] bg-white overflow-hidden"
          style={{ width: avatarSize, height: avatarSize }}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-[12px] text-[#5B5D6B]">
              logo
            </div>
          )}
        </div>

        {/* bubble + time */}
        <div className="flex items-end gap-[4px] max-w-[calc(100%-48px)]">
          <div className="p-[1px] rounded-[12px] bg-gradient-to-r from-[#CBCBF5] via-[#6666E5] to-[#CBCBF5]">
            <div className="w-[240px] rounded-[12px] bg-[#FFFFFF] px-[10px] py-[10px] flex flex-col gap-[8px]">
              <div className="text-[12px] leading-[16px] style-Medium text-[#6666E5]">
                매칭된 캠페인
              </div>

              <div className="flex items-center">
                <div className="min-w-0 text-[14px] leading-[20px] style-Medium text-[#404252] truncate">
                  {message.campaignName}
                </div>

                <button
                  type="button"
                  onClick={() => navigate({to: "/campaign"})} // 캠페인 상세 보기
                  className="w-6 h-6 grid place-items-center text-gray2"
                  aria-label="expand"
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.552734 12.5068L6.05273 6.50684L0.552734 0.506836" stroke="#5B5D6B" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>

              <div>
                <div className="text-[12px] leading-[16px] style-Medium text-black">
                  결제 금액
                </div>
                <div className="text-[14px] leading-[20px] style-Medium text-[#6666E5]">
                  {message.price?.toLocaleString()} 원
                </div>
                <div className="text-[10px] leading-[12px] text-[#9B9BA1]">
                  *결제 대금은 캠페인 종료 후 크리에이터에게 전달됩니다
                </div>
              </div>

              <div className="text-[12px] leading-[16px] style-Medium text-[#404252]">
                주문 번호 {message.orderId}
              </div>
            </div>
          </div>
          <MessageStatus
            message={message}
            timeText={timeText}
            onRetry={() => {}}//Todo: onRetry
            onDelete={() => {}}// Todo: onDelete
          />
        </div>
      </div>
    </div>
  );
}