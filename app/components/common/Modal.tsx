interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children, className = "" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* 배경 레이어 */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      {/* 모달 본체 */}
      <div className={`relative bg-white rounded-[24px] shadow-xl animate-in fade-in zoom-in duration-200 ${className}`}>

        {children}
      </div>
    </div>
  );
}