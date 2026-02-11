import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import CheckCircleIcon from "../../../assets/icon/icon-check-circle.svg";

interface ProposalModalProps {
    isOpen: boolean;
    type: "confirm" | "success";
    onClose: () => void;
    onConfirm?: () => void;
}

export default function ProposalModal({
    isOpen,
    type,
    onClose,
    onConfirm,
}: ProposalModalProps) {
    const isConfirm = type === "confirm";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-[310px] h-[310px] p-6"
        >
            <div className="flex flex-col items-center h-full relative">
                {isConfirm && (
                    <button
                        type="button"
                        className="absolute -top-1 -left-1 z-10"
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 16L11 11L16 16M16 6L10.999 11L6 6" stroke="#5B5D6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <img src={CheckCircleIcon} alt="" className="w-16 h-16 mb-6" />

                    <h3 className="text-callout3 text-text-black text-center">
                        {isConfirm ? "지원하시겠습니까?" : "지원 완료"}
                    </h3>

                    {!isConfirm && (
                        <p className="text-title7 text-text-gray3 text-center mt-2 whitespace-pre-wrap">
                            비즈니스 메뉴에서{"\n"}지원정보를 확인해 주세요
                        </p>
                    )}
                </div>

                <div className="flex gap-3 w-full mt-auto">
                    {isConfirm ? (
                        <>
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-[1] h-11 text-title7 text-core1 border-core3 rounded-xl"
                                onClick={onClose}
                            >
                                취소
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                className="flex-[4] h-11 text-title7 rounded-xl"
                                onClick={onConfirm}
                            >
                                지원하기
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            className="h-11 text-title7 rounded-xl"
                            onClick={onClose}
                        >
                            완료하기
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
