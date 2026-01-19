import StartMatchingTestButton from "./components/StartRMButton";
import RMLOGO from "../../../assets/RealMatchLogo_ex.svg";
import MainIcon from "../../../assets/MainIcon.svg";


export default function HomeContent() {
  return (
    <div className="w-full bg-gradient-to-b from-[#F6F7FF] to-white">
      {/* ✅ Header: 좌/중/우 3칸으로 '진짜 중앙' 고정 */}
      <header className="h-[60px] w-full bg-white">
        <div className="grid h-full w-full grid-cols-3 items-center">
          {/* Left: back */}
          <div className="flex items-center">
          </div>

          {/* Center: logo + text (정중앙) */}
          <div className="flex items-center justify-center">
            <img
              src={RMLOGO}
              alt="Real Match"
              draggable={false}
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex w-full flex-col items-center px-6 text-center pt-[160px]">
        <div className="my-[64px]">

          {/* 일러스트 */}
          <img
            src={MainIcon}
            alt="매칭 없음"
            className="h-auto w-[210px] select-none"
            draggable={false}
          />

          {/* 문구 */}
          <div className="px-[10px] gap-[10px]">
            <p className="text-[14px] font-semibold text-[#2F2F2F]">
              매칭된 기업이 없어요
            </p>
            <p className="mt-1 text-[14px] font-semibold text-[#2F2F2F]">
              매칭 검사를 먼저 진행해주세요
            </p>
          </div>
        </div>
        {/* 버튼 (기존 유지) */}
        <div className="sticky  bottom-0 w-full bg-white/70 px-[24px] pt-[24px] pb-[40px] backdrop-blur">
          <StartMatchingTestButton />
        </div>
      </main>
    </div>
  );
}
