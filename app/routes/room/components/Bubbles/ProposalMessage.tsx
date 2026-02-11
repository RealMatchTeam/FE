import { useNavigate } from "react-router";

type BaseProps = {
  createdAt?: string;
  avatarSrc?: string;
  campaignName: string;
  bodyText: string;
  proposalDirection: "NONE" | "BRAND_TO_CREATOR" | "CREATOR_TO_BRAND";
};

type ProposalCardProps = BaseProps & {
  kind: "PROPOSAL_CARD" | "RE_PROPOSAL_CARD";
  proposalId: string;
};

type ApplyCardProps = BaseProps & {
  kind: "APPLY_CARD";
  applyId: string;
};

type Props = ProposalCardProps | ApplyCardProps;

export default function ProposalMessage({
  kind,
  createdAt,
  avatarSrc,
  campaignName, 
  bodyText,
  proposalDirection,
}: Props) {
  const timeText = createdAt ?? "";
  const navigate = useNavigate();

  if (proposalDirection == "CREATOR_TO_BRAND") {
    return (
      <div className="flex w-full justify-end">
        <div className="inline-flex items-end gap-[8px]">
          {timeText ? (
            <div className="text-[10px] leading-[12px] text-[#9B9BA1] text-right whitespace-pre-line">
              {timeText}
            </div>
          ) : null}

          <div className="w-[214px] rounded-[10px] bg-[#B7B7F380] px-[10px] py-[10px] text-left break-words whitespace-pre-line gap-[10px] flex flex-col">
            <div className="gap-[2px]">
              <div className="text-[10px] leading-[14px] style-Medium text-[#6666E5]">
                {kind === "RE_PROPOSAL_CARD" ? "재제안" : "제안"}
              </div>

              <div className="gap-[5px]">
                <div className="text-[12px] leading-[16px] style-Medium text-black">
                  캠페인 명
                </div>

                <div className="flex items-center">
                  <div className="min-w-0 text-[14px] leading-[20px] style-Medium text-[#404252] truncate">
                    {campaignName}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/proposal?type=sent")}
                    className="w-6 h-6 grid place-items-center text-gray2"
                    aria-label="expand"
                  >
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.552734 12.5068L6.05273 6.50684L0.552734 0.506836" stroke="#5B5D6B" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[12px] leading-[16px] style-Medium text-black">
                캠페인 내용
              </div>

              <div className="mt-[2px] text-[10px] leading-[14px] text-[#404252] truncate">
                {bodyText}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (proposalDirection == "BRAND_TO_CREATOR") {
    return (
      <div className="flex justify-start">
        <div className="w-fit flex items-start gap-[10px] max-w-full">
          {/* avatar */}
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

          {/* bubble + time */}
          <div className="flex items-end gap-[8px] max-w-[calc(100%-48px)]">
            {/* 왼쪽 제안 카드 */}
            <div className="w-[240px] rounded-[10px] bg-[#FFFFFFCC] px-[10px] py-[10px] text-left break-words whitespace-pre-line gap-[10px] flex flex-col">
              <div className="gap-[2px]">
                <div className="text-[10px] leading-[14px] style-Medium text-[#6666E5]">
                  제안
                </div>

                <div className="gap-[10px]">
                  <div className="text-[12px] leading-[16px] style-Medium text-black">
                    캠페인 명
                  </div>

                  <div className="flex items-center">
                    <div className="min-w-0 text-[14px] leading-[20px] style-Medium text-[#404252] truncate">
                      {campaignName}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/proposal?type=received")}
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
                </div>
              </div>

              <div>
                <div className="text-[12px] leading-[16px] style-Medium text-black">
                  캠페인 내용
                </div>

                <div className="mt-[2px] text-[10px] leading-[14px] text-[#404252] truncate">
                  {bodyText}
                </div>
              </div>

              <div className="flex items-center gap-[9px]">
                {/* accept */}
                <button
                  type="button"
                  onClick={() => {}} // TODO: 제안 수락
                  className="h-[32px] flex-1 rounded-[6px] bg-[#6666E5] text-white text-[14px] leading-[20px] font-Medium"
                >
                  제안 수락하기
                </button>

                {/* reject */}
                <button
                  type="button"
                  onClick={() => {}} // TODO: 제안 거절
                  className="w-[72px] h-[32px] rounded-[6px] bg-white text-[#6666E5] text-[14px] leading-[20px] style-Medium border border-[#B7B7F3]"
                >
                  거절하기
                </button>
              </div>
            </div>

            {timeText ? (
              <div className="shrink-0 text-[10px] leading-[12px] text-[#9B9BA1] whitespace-pre-line">
                {timeText}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return null;
}