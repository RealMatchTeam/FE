import { useState } from "react";
import { useNavigate } from "react-router";
import { approveCampaignProposal } from "../../../business/proposal/api/proposal";

type BaseProps = {
  createdAt?: string;
  avatarSrc?: string;
  campaignName: string;
  bodyText: string;
  proposalDirection: "NONE" | "BRAND_TO_CREATOR" | "CREATOR_TO_BRAND";
  proposalStatus?: string;
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

const CheckIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="#6666E5" />
    <path d="M24 40L35 51L56 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProposalMessage(props: Props) {
  const {
    kind,
    createdAt,
    avatarSrc,
    campaignName,
    bodyText,
    proposalDirection,
    proposalStatus,
  } = props;
  const proposalId = kind === "APPLY_CARD" ? (props as ApplyCardProps).applyId : (props as ProposalCardProps).proposalId;
  const timeText = createdAt ?? "";
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDone, setActionDone] = useState<"accepted" | "rejected" | null>(null);
  const [modalState, setModalState] = useState<"confirm" | "success" | null>(null);

  const isAlreadyProcessed = proposalStatus === "MATCHED" || proposalStatus === "REJECTED" || proposalStatus === "CANCELED";
  const showButtons = proposalDirection === "BRAND_TO_CREATOR" && !isAlreadyProcessed && !actionDone;

  const handleAcceptClick = () => {
    if (isProcessing) return;
    setModalState("confirm");
  };

  const handleConfirmAccept = async () => {
    try {
      setIsProcessing(true);
      const response = await approveCampaignProposal(proposalId);
      if (response.isSuccess) {
        setModalState("success");
        setActionDone("accepted");
      } else {
        setModalState(null);
        alert(response.message || "수락 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("제안 수락 실패:", error);
      setModalState(null);
      alert("서버와 통신 중 에러가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    navigate(`/business/proposal?type=received&proposalId=${proposalId}`, {
      state: { openReject: true },
    });
  };

  const AcceptModal = () => {
    if (!modalState) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => !isProcessing && setModalState(null)}
        />

        <div className="relative bg-white rounded-[20px] w-[calc(100%-48px)] max-w-[400px] px-6 pt-6 pb-8 flex flex-col items-center">
          {modalState === "confirm" && (
            <button
              type="button"
              onClick={() => setModalState(null)}
              className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L14 14M14 2L2 14" stroke="#5B5D6B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <div className="mt-10 mb-8">
            <CheckIcon />
          </div>

          {modalState === "confirm" ? (
            <>
              <div className="text-[22px] leading-[30px] font-medium text-[#111] text-callout3 mb-10">
                제안을 수락하시겠습니까?
              </div>

              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalState(null)}
                  className="w-[120px] h-[54px] rounded-[14px] border border-[#B7B7F3] text-[#6666E5] text-[17px] font-semibold shrink-0"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAccept}
                  disabled={isProcessing}
                  className="flex-1 h-[54px] rounded-[14px] bg-[#6666E5] text-white text-[17px] font-semibold disabled:opacity-50"
                >
                  {isProcessing ? "처리 중..." : "수락하기"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-[22px] leading-[30px] font-bold text-[#111] text-center mb-3">
                수락하기 완료
              </div>
              <div className="text-[15px] leading-[22px] text-[#9B9BA1] text-center whitespace-pre-line mb-10">
                {"브랜드와 채팅방에서\n협업을 진행해주세요"}
              </div>

              <button
                type="button"
                onClick={() => setModalState(null)}
                className="w-full h-[54px] rounded-[14px] bg-[#6666E5] text-white text-[17px] font-semibold"
              >
                완료하기
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const ArrowButton = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-6 h-6 grid place-items-center text-gray2"
      aria-label="expand"
    >
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.552734 12.5068L6.05273 6.50684L0.552734 0.506836" stroke="#5B5D6B" strokeWidth="1.5"/>
      </svg>
    </button>
  );

  if (proposalDirection == "CREATOR_TO_BRAND") {
    return (
      <div className="flex w-full justify-end">
        <div className="inline-flex items-end gap-[8px]">
          {timeText ? (
            <div className="text-[10px] leading-[12px] text-[#9B9BA1] text-right whitespace-pre-line">
              {timeText}
            </div>
          ) : null}

          <div className="max-w-[214px] w-full rounded-[10px] bg-[#B7B7F380] px-[10px] py-[10px] text-left break-words whitespace-pre-line gap-[10px] flex flex-col">
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
                  <ArrowButton onClick={() => navigate(`/business/proposal?type=sent&proposalId=${proposalId}`)} />
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
      <>
      <AcceptModal />
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
            <div className="max-w-[240px] w-full rounded-[10px] bg-[#FFFFFFCC] px-[10px] py-[10px] text-left break-words whitespace-pre-line gap-[10px] flex flex-col">
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

                    <ArrowButton onClick={() => navigate(`/business/proposal?type=received&proposalId=${proposalId}`)} />
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

              {/* 수락/거절 버튼 */}
              {showButtons && (
                <div className="flex items-center gap-[9px]">
                  <button
                    type="button"
                    onClick={handleAcceptClick}
                    disabled={isProcessing}
                    className="h-[32px] flex-1 rounded-[6px] bg-[#6666E5] text-white text-[14px] leading-[20px] font-Medium disabled:opacity-50"
                  >
                    {isProcessing ? "처리 중..." : "제안 수락하기"}
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="w-[72px] h-[32px] rounded-[6px] bg-white text-[#6666E5] text-[14px] leading-[20px] style-Medium border border-[#B7B7F3] disabled:opacity-50"
                  >
                    거절하기
                  </button>
                </div>
              )}

              {/* 처리 완료 상태 표시 */}
              {actionDone === "accepted" && (
                <div className="text-[12px] text-[#6666E5] style-Medium text-center">수락 완료</div>
              )}
              {actionDone === "rejected" && (
                <div className="text-[12px] text-[#9B9BA1] style-Medium text-center">거절 완료</div>
              )}
            </div>

            {timeText ? (
              <div className="shrink-0 text-[10px] leading-[12px] text-[#9B9BA1] whitespace-pre-line">
                {timeText}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      </>
    );
  }

  return null;
}
