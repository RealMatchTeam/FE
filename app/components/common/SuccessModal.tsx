import Modal from "./Modal";
import Button from "./Button";
import CheckCircleIcon from "../../assets/icon/icon-check-circle.svg";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonLabel?: string;
};

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  buttonLabel = "완료하기",
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[310px] h-[310px] p-6">
      <div className="flex flex-col items-center h-full">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <img src={CheckCircleIcon} alt="" className="w-16 h-16 mb-6" />

          <h3 className="text-callout3 text-text-black text-center">{title}</h3>

          {description ? (
            <p className="text-title7 text-text-gray3 text-center mt-2 whitespace-pre-wrap">
              {description}
            </p>
          ) : null}
        </div>

        <div className="w-full mt-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="h-11 text-title7 rounded-xl"
            onClick={onClose}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
