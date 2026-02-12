import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import Modal from "../../../../components/common/Modal";
import checkIcon from "../../../../assets/icon/icon-check-circle.svg";
import closeIcon from "../../../../assets/icon/icon-close.svg";
import { approveCampaignProposal, rejectCampaignProposal } from "../../../../routes/business/proposal/api/proposal";

type BaseProps = {
  createdAt?: string;
  avatarSrc?: string;
  campaignName: string;
  bodyText: string;
  proposalDirection: "NONE" | "BRAND_TO_CREATOR" | "CREATOR_TO_BRAND";
};

type ProposalCardProps = BaseProps & {
  kind: "PROPOSAL_CARD" | "RE_PROPOSAL_CARD";
  proposalId: number;
};

type ApplyCardProps = BaseProps & {
  kind: "APPLY_CARD";
  applyId: number;
};

type Props = ProposalCardProps | ApplyCardProps;

type ModalType = "none" | "confirm" | "success" | "reject" | "rejectSuccess";

export default function ProposalMessage(props: Props) {

  const {
    kind,
    createdAt,
    avatarSrc,
    campaignName,
    bodyText,
    proposalDirection,
  } = props;

  const timeText = createdAt ?? "";
  const navigate = useNavigate();

  const proposalId = useMemo(() => {
    if (props.kind === "APPLY_CARD") return null;
    return props.proposalId;
  }, [props]);

  const [modalType, setModalType] = useState<ModalType>("none");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const closeModal = () => {
    setModalType("none");
    setRejectReason("");
  };

  const handleAcceptClick = () => {
    if (!proposalId) return;
    setModalType("confirm");
  };

  const handleConfirmAccept = async () => {
    if (!proposalId) return;

    try {
      setIsProcessing(true);
      const res = await approveCampaignProposal(String(proposalId));

      if (res.isSuccess) {
        setModalType("success");
      } else {
        alert(res.message || "수락 처리 중 오류가 발생했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("서버와 통신 중 에러가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = () => {
    if (!proposalId) return;
    setModalType("reject");
  };

  const handleRejectSubmit = async () => {
    if (!proposalId) return;
    // ReceivedProposalContent는 reason 필수였는데, UI 문구는 "선택사항"이었죠.
    // 공란도 허용하려면 trim 체크를 제거
    try {
      setIsProcessing(true);
      const res = await rejectCampaignProposal(String(proposalId), rejectReason);

      if (res.isSuccess) {
        setModalType("rejectSuccess");
      } else {
        alert(res.message || "거절 처리 중 오류가 발생했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("서버와 통신 중 에러가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };


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
      <>
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
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
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

                {/* 수락 거절 */}
                <div className="flex items-center gap-[9px]">
                  <button
                    type="button"
                    onClick={handleAcceptClick}
                    disabled={!proposalId || isProcessing}
                    className="h-[32px] flex-1 rounded-[6px] bg-[#6666E5] text-white text-[14px] leading-[20px] font-Medium disabled:opacity-50"
                  >
                    {isProcessing ? "처리 중" : "제안 수락하기"}
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectClick}
                    disabled={!proposalId || isProcessing}
                    className="w-[72px] h-[32px] rounded-[6px] bg-white text-[#6666E5] text-[14px] leading-[20px] style-Medium border border-[#B7B7F3] disabled:opacity-50"
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

        {/* 모달 */}
        <Modal
          isOpen={modalType !== "none"}
          onClose={closeModal}
          className="w-full max-w-[340px] p-8 px-6"
        >
          {modalType === "confirm" && (
            <div className="flex flex-col items-center text-center">
              <button onClick={closeModal} className="absolute top-6 left-6">
                <img src={closeIcon} alt="close" className="w-5 h-5 opacity-40" />
              </button>
              <div className="mt-8 mb-6">
                <img src={checkIcon} alt="check" className="w-[80px] h-[80px]" />
              </div>
              <h3 className="text-[20px] font-bold text-text-black mb-10">
                제안을 수락하시겠습니까?
              </h3>
              <div className="flex w-full gap-3">
                <button
                  onClick={closeModal}
                  disabled={isProcessing}
                  className="w-[90px] py-4 border border-core-3 rounded-[16px] text-core-1 font-bold disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmAccept}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-core-1 rounded-[16px] text-white font-bold disabled:opacity-50"
                >
                  {isProcessing ? "처리 중..." : "수락하기"}
                </button>
              </div>
            </div>
          )}

          {modalType === "success" && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="mb-6">
                <img src={checkIcon} alt="check" className="w-[80px] h-[80px]" />
              </div>
              <h3 className="text-[22px] font-bold text-text-black mb-2">수락하기 완료</h3>
              <p className="text-[16px] text-text-gray3 mb-10 leading-snug">
                브랜드와 채팅방에서<br />
                협업을 진행해주세요
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-core-1 rounded-[16px] text-white font-bold"
              >
                완료하기
              </button>
            </div>
          )}

          {modalType === "reject" && (
            <div className="flex flex-col w-full">
              <h3 className="text-[18px] font-bold text-text-black mb-6">
                {campaignName}
              </h3>

              <div className="flex flex-col gap-2 mb-8">
                <label className="text-[16px] font-bold text-text-black">거절 이유</label>
                <div className="relative">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value.slice(0, 500))}
                    placeholder="거절 이유를 입력해주세요"
                    className="w-full h-[160px] p-4 bg-white border border-text-gray5 rounded-[12px] text-body1 resize-none focus:outline-none focus:border-core-1"
                  />
                  <span className="absolute bottom-3 right-4 text-[12px] text-text-gray4">
                    {rejectReason.length}/500
                  </span>
                </div>
                <p className="text-[12px] text-text-gray3">*거절 이유 작성은 선택사항 입니다</p>
              </div>

              <div className="flex w-full gap-3">
                <button
                  onClick={closeModal}
                  disabled={isProcessing}
                  className="w-[90px] py-4 border border-core-3 rounded-[16px] text-core-1 font-bold disabled:opacity-50"
                >
                  취소하기
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-core-1 rounded-[16px] text-white font-bold disabled:bg-text-gray5"
                >
                  {isProcessing ? "처리 중..." : "거절하기"}
                </button>
              </div>
            </div>
          )}

          {modalType === "rejectSuccess" && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="mb-6">
                <img src={checkIcon} alt="check" className="w-[80px] h-[80px]" />
              </div>
              <h3 className="text-[22px] font-bold text-text-black mb-2">거절하기 완료</h3>
              <p className="text-[16px] text-text-gray3 mb-10">다른 협업을 확인해주세요</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-core-1 rounded-[16px] text-white font-bold"
              >
                완료하기
              </button>
            </div>
          )}
        </Modal>
      </>
    );
  }

  return null;
}