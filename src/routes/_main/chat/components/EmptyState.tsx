export function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h3 className="text-title text-text-gray2 mb-2">채팅방이 없어요</h3>
      <p className="text-body1 text-text-gray3 text-center">
        매칭이 성사되면 채팅을 시작할 수 있어요
      </p>
    </div>
  );
}