import Modal from "./Modal";
import Button from "./Button";
import CheckCircleIcon from "../../assets/icon/icon-check-circle.svg";
import closeIcon from "../../assets/icon/icon-close.svg";


type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;    
  onConfirm: () => void; 
  title: string;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[310px] h-[310px] rounded-[10px] p-6 relative">
      {/* 상단 좌측 X 아이콘 추가 */}
      <button 
        onClick={onClose}
        className="absolute top-5 left-5 p-1 active:opacity-50 transition-opacity"
      >
        <img src={closeIcon} alt="close" className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center h-full">
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
          {/* 이미지 섹션 */}
          <img src={CheckCircleIcon} alt="" className="w-[64px] h-[64px] mb-8" />

          {/* 문구 섹션 */}
          <h3 className="text-callout3 text-text-black text-center leading-tight">
            {title}
          </h3>
        </div>

        {/* 버튼 섹션 */}
        <div className="w-full flex gap-3 mt-auto">
          {/* '예' 버튼 */}
          <Button
            variant="outline"
            className="w-[76px] h-[44px] text-[18px] font-semibold rounded-[16px] border-[#C5C7F9] text-[#6366F1] bg-white"
            onClick={onConfirm}
          >
            예
          </Button>
          
          {/* '아니오' 버튼 */}
          <Button
            variant="primary"
            className="w-[186px] h-[44px] text-[18px] font-semibold rounded-[16px] bg-[#6366F1] text-white border-none"
            onClick={onClose}
          >
            아니오
          </Button>
        </div>
      </div>
    </Modal>
  );
}