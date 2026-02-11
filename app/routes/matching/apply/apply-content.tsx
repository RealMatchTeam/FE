import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../../components/common/Button";
import ProfileSelector from "../components/ProfileSelector";
import TextArea from "../../../components/form/TextArea";
import ProposalModal from "../components/ProposalModal";

export default function MatchingApplyContent() {
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleApplyClick = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmApply = () => {
        // TODO: 지원하기 API 호출 로직 구현
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSuccessClose = () => {
        setIsSuccessModalOpen(false);
        navigate("/business/calendar"); // 성공 후 이동할 페이지 (디자인 참고)
    };

    return (
        <div className="flex flex-col flex-1 h-full px-5 pt-10 pb-[36px] gap-8">
            {/* 캠페인 제목 */}
            <h2 className="text-title8 text-text-black">
                ‘글로우 쿠션’ 신제품 론칭 리뷰 지원
            </h2>

            {/* 제출 프로필 섹션 */}
            <div className="flex flex-col gap-3">
                <label className="text-title3 text-text-black">제출 프로필</label>
                <ProfileSelector username="@ivveeee" onClick={() => console.log("프로필 변경")} />
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
