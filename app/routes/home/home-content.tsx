import StartMatchingTestButton from "./components/StartRMButton";
import MainIcon from "../../assets/MainIcon.svg";

export default function HomeContent() {
  return (
    <div className="flex h-full w-full flex-col bg-grad-auth">
      
      {/* 중앙 컨텐츠 */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        
        {/* 일러스트 */}
        <img
          src={MainIcon}
          alt="매칭 없음"
          className="w-[280px] select-none"
          draggable={false}
        />

        {/* 텍스트 영역 */}
        <div className="mt-[28px] space-y-[6px]">
          <p className="text-title2 text-text-gray1 leading-[20px]">
            매칭된 기업이 없어요
          </p>
          <p className="text-title2 text-text-gray1 leading-[20px]">
            매칭 검사를 먼저 진행해주세요
          </p>
        </div>
      </main>

      {/* 하단 버튼 영역 */}
      <div className="shrink-0 px-6 pt-[20px] pb-[34px] backdrop-blur">
        <StartMatchingTestButton />
      </div>
    </div>
  );
}
