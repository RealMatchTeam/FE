import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Button from "../../../components/common/Button";
import ProfileSelector from "../components/ProfileSelector";
import TextArea from "../../../components/form/TextArea";
import ProposalModal from "../components/ProposalModal";
import { useCampaignProposalStore } from "../../../stores/campaign-proposal";
import { useAuthStore } from "../../../stores/auth-store";
import { applyToCampaign } from "../api/matching";

export default function MatchingApplyContent() {
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const proposalData = useCampaignProposalStore((state) => state.proposalData);
    const snsAccount = useCampaignProposalStore((state) => state.snsAccount);
    const me = useAuthStore((state) => state.me);

    const handleApplyClick = () => {
        if (!reason.trim()) {
            toast.warning("지원이유를 입력해주세요.");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleConfirmApply = async () => {
        if (!proposalData?.campaignId) {
            toast.error("캠페인 정보가 없습니다.");
            return;
        }

        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);

        try {
            await applyToCampaign(proposalData.campaignId, reason);
        } catch (error) {
            console.error("지원 실패:", error);
            toast.error("캠페인 지원에 실패했습니다. 다시 시도해주세요.");
            setIsSuccessModalOpen(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSuccessClose = () => {
        setIsSuccessModalOpen(false);
        navigate("/business/calendar");
    };

    return (
        <div className="flex flex-col flex-1 h-full px-5 pt-10 pb-[36px] gap-8">
            {/* 캠페인 제목 */}
            <h2 className="text-title8 text-text-black">
                {proposalData?.campaignTitle ? `‘${proposalData.campaignTitle}’ 지원` : "캠페인 지원"}
            </h2>

            {/* 제출 프로필 섹션 */}
            <div className="flex flex-col gap-3">
                <label className="text-title3 text-text-black">제출 프로필</label>
                <ProfileSelector
                    username={snsAccount ? `@${snsAccount}` : (me?.roleText ?? me?.name ?? "@unknown")}
                    onClick={() => navigate("/mypage/profileCard")}
                />
            </div>

            {/* 지원이유 섹션 */}
            <div className="flex flex-col gap-3">
                <label className="text-title3 text-text-black">지원이유</label>
                <div className="bg-white/80 rounded-md">
                    <TextArea
                        placeholder="캠페인 제안 내용을 자세히 입력해주세요"
                        maxLength={500}
                        value={reason}
                        onChange={setReason}
                    />
                </div>
            </div>

            {/* 푸터 버튼 */}
            <div className="flex gap-3 mt-auto">
                <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-core-1 text-core-1 text-title7"
                    onClick={handleCancel}
                >
                    취소하기
                </Button>
                <Button
                    variant="primary"
                    size="lg"
                    className="flex-[3] text-title7"
                    withLogo
                    onClick={handleApplyClick}
                >
                    지원하기
                </Button>
            </div>

            {/* 제안 확인 모달 */}
            <ProposalModal
                isOpen={isConfirmModalOpen}
                type="confirm"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmApply}
            />

            {/* 완료 모달 */}
            <ProposalModal
                isOpen={isSuccessModalOpen}
                type="success"
                onClose={handleSuccessClose}
            />
        </div>
    );
}
