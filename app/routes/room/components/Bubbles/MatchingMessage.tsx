import { useNavigate } from "react-router";
import MessageMeta from "./MessageStatus";

type Props = {
  campaignName: string;
  amount: number;
  orderNumber: string;
  createdAt?: string;
  avatarSrc?: string;
  proposalDirection: "NONE" | "BRAND_TO_CREATOR" | "CREATOR_TO_BRAND"
};

export default function MatchedCampaignMessage({
  campaignName,
  amount,
  orderNumber,
  createdAt,
  avatarSrc,
  proposalDirection,
}: Props) {
  const timeText = createdAt ?? "";
  const navigate = useNavigate();
  const isMine = proposalDirection === "CREATOR_TO_BRAND";

  return (
    <div className={isMine ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "w-fit flex items-start gap-[10px] max-w-full",
          isMine ? "flex-row-reverse" : "flex-row",
        ].join(" ")}
      >
        {/* avatar */}
        {!isMine && (
          <div
            className="shrink-0 rounded-[10px] bg-white overflow-hidden"
            style={{ width: 38, height: 38 }}
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
        )}

        {/* bubble + time */}
        <div
          className={[
            "flex items-end gap-[4px] max-w-[calc(100%-48px)]",
            isMine ? "flex-row-reverse" : "flex-row",
          ].join(" ")}
        >
          <div className="p-[1px] rounded-[12px] bg-gradient-to-r from-[#CBCBF5] via-[#6666E5] to-[#CBCBF5]">
            <div className="max-w-[240px] w-full rounded-[12px] bg-[#FFFFFF] px-[10px] py-[10px] flex flex-col gap-[8px]">
              <div className="text-[12px] leading-[16px] style-Medium text-[#6666E5]">
                매칭된 캠페인
              </div>

              <div className="flex items-center">
                <div className="min-w-0 text-[14px] leading-[20px] style-Medium text-[#404252] truncate">
                  {campaignName}
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/campaign")}
                  className="w-6 h-6 grid place-items-center text-gray2"
                  aria-label="expand"
                >
                  <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.552734 12.5068L6.05273 6.50684L0.552734 0.506836"
                      stroke="#5B5D6B"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <div className="text-[12px] leading-[16px] style-Medium text-black">
                  결제 금액
                </div>
                <div className="text-[14px] leading-[20px] style-Medium text-[#6666E5]">
                  {amount.toLocaleString()} 원
                </div>
                <div className="text-[10px] leading-[12px] text-[#9B9BA1]">
                  *결제 대금은 캠페인 종료 후 크리에이터에게 전달됩니다
                </div>
              </div>

              <div className="text-[12px] leading-[16px] style-Medium text-[#404252]">
                주문 번호 {orderNumber}
              </div>
            </div>
          </div>

          <MessageMeta
            timeText={timeText}
            onRetry={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
