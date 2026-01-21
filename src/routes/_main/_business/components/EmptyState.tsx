import emptyIcon from "../../../../assets/empty.png"; // 보라색 이미지 경로

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-20">
      {/* 중앙 보라색 이미지 */}
      <img 
        src={emptyIcon} 
        alt="Empty state" 
        className="w-[180px] h-auto mb-6" 
      />
      
      <p className="text-body1 text-[var(--color-text-gray3)]">
        {message}
      </p>
    </div>
  );
}
