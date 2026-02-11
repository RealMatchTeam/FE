import MainIcon from "../../assets/MainIcon.png";
import Button from "./Button";

interface EmptyMatchStateProps {
  message?: string;
  showButton?: boolean;
  buttonText?: string;
  contentClassName?: string;
}

export default function EmptyMatchState({
  message = "매칭된 기업이 없어요",
  showButton = false,
  buttonText = "매칭률 검사하기",
  contentClassName,
}: EmptyMatchStateProps) {
  return (
    <div className="relative h-full bg-gradient-to-b from-[#F6F7FF] to-white overflow-hidden">
      {/* Body */}
      <main className={`flex flex-col items-center justify-center text-center h-full ${contentClassName ?? ""}`}>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center px-6">
            {/* 일러스트 */}
            <img
              src={MainIcon}
              alt="매칭 없음"
              className="h-auto w-[160px] select-none"
              draggable={false}
            />

            {/* 문구 */}
            <p className="text-title3 text-text-gray2 text-center whitespace-pre-line mt-6">
              {message}
            </p>
          </div>
        </div>
      </main>

      {/* 고정 하단 버튼 */}
      {showButton && (
        <div className="absolute bottom-0 w-full px-6 pb-6 pt-4">
          <Button variant="primary" size="lg" fullWidth withLogo to="/matching/test/step1">
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}
