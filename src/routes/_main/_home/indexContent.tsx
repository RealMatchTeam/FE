import StartMatchingTestButton from "./StartRMButton";
import MainIcon from "../../../assets/MainIcon.svg";

export default function HomeContent() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F6F7FF] to-white">
      {/* ✅ Header: 좌/중/우 3칸으로 '진짜 중앙' 고정 */}
      <header className="h-[56px] w-full bg-white">
        <div className="grid h-full w-full grid-cols-3 items-center px-4">
          {/* Left: back */}
          <div className="flex items-center">
            <button
              type="button"
              aria-label="뒤로가기"
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-black/5"
              onClick={() => window.history.back()}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14.5 5.5L8.5 12l6 6.5"
                  stroke="#5B63FF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Center: logo + text (정중앙) */}
          <div className="flex items-center justify-center gap-2">
            {/* 홈 로고도 SVG import를 쓰고 있으니 동일하게 */}
            <img
              src={MainIcon}
              alt="Real Match"
              className="h-6 w-6"
              draggable={false}
            />
            <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#5B63FF]">
              Real Match
            </span>
          </div>

          {/* Right: spacer (중앙 고정용) */}
          <div />
        </div>
        <div className="h-px w-full bg-black/5" />
      </header>

      {/* Body */}
      <main className="flex w-full flex-col items-center px-6 text-center">
        {/* ✅ mt-30은 적용 안 될 수 있어서 픽셀로 확정 */}
        <div className="mt-[90px]" />

        {/* 일러스트 */}
        <img
          src={MainIcon}
          alt="매칭 없음"
          className="h-auto w-[260px] select-none"
          draggable={false}
        />

        {/* 문구 */}
        <div className="mt-10">
          <p className="text-[14px] font-semibold text-[#2F2F2F]">
            매칭된 기업이 없어요
          </p>
          <p className="mt-1 text-[14px] font-semibold text-[#2F2F2F]">
            매칭 검사를 먼저 진행해주세요
          </p>
        </div>

        {/* 버튼 (기존 유지) */}
        <div className="mt-12 w-full">
          <StartMatchingTestButton />
        </div>

        {/* 탭바 여유 */}
        <div className="h-16" />
      </main>
    </div>
  );
}
