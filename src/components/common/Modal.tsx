interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      {/* 배경 레이어 */}
      <div 
        className="absolute inset-0 bg-black/30" 
        onClick={onClose} 
      />
      {/* 모달 본체 */}
      <div className="relative w-full max-w-[327px] bg-white rounded-[10px] p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        {children}
      </div>
    </div>
  );
}