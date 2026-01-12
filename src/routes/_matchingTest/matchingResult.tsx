import { createFileRoute, useNavigate } from "@tanstack/react-router";
import MatchResultHeader from "../../components/common/RealmatchHeader";
import MainIcon from "../../assets/MainIcon.svg";
import WhiteLogo from "../../assets/whitelogo.svg"


type Step4Search = {
  userName?: string; // "OO" 자리
  fitTraits?: string;
  styleTraits?: string;
  moodTraits?: string;
  recommendedBrand?: string; // "00한 브랜드와" 자리
};

export const Route = createFileRoute("/_matchingTest/matchingResult")({
  component: Step4,
  validateSearch: (search: Record<string, unknown>): Step4Search => ({
    userName: typeof search.userName === "string" ? search.userName : undefined,
    fitTraits: typeof search.fitTraits === "string" ? search.fitTraits : undefined,
    styleTraits:
      typeof search.styleTraits === "string" ? search.styleTraits : undefined,
    moodTraits:
      typeof search.moodTraits === "string" ? search.moodTraits : undefined,
    recommendedBrand:
      typeof search.recommendedBrand === "string"
        ? search.recommendedBrand
        : undefined,
  }),
});

function Step4() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  // ✅ 백엔드/step3에서 전달될 값(없으면 더미)
  const resultData = {
    userName: search.userName ?? "OO",
    beautyTraits: search.fitTraits ?? "00 핏 특성들",
    styleTraits: search.styleTraits ?? "00 패션 특성들",
    contentTraits: search.moodTraits ?? "00 콘텐츠 특성들",
    recommendedBrand: search.recommendedBrand ?? "00한 브랜드와",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F7FF] to-white">
      {/* ✅ 상단 헤더(스크린샷 스타일) */}
      <MatchResultHeader />

      {/* ✅ 중앙 컨텐츠 (폭 제한 제거) */}
      <main className="flex w-full flex-col items-center px-6 text-center">
        <div className="mt-[84px] mb-[24px]" />
        <p className="text-[14px] font-medium text-[#404252]">매칭 결과</p>
        <h1 className="
    text-[24px]
    font-extrabold
    tracking-[-0.02em]
    bg-[radial-gradient(circle_at_top,_#5D5DFF_0%,_#382FE4_45%,_#3915DA_100%)]
    bg-clip-text
    text-transparent">
          <span className="mr-1">{resultData.userName}</span>
한 크리에이터        </h1>

        <p className="mt-[30px] text-[12px] font-medium text-[#5B5D6B]">
          {resultData.userName}님의 특성
        </p>

        <div className="mt-3 space-y-2">
          <p className="text-[14px] font-semibold text-[#5B63FF]">
            {resultData.beautyTraits}
          </p>
          <p className="text-[14px] font-semibold text-[#5B63FF]">
            {resultData.styleTraits}
          </p>
          <p className="text-[14px] font-semibold text-[#5B63FF]">
            {resultData.contentTraits}
          </p>
        </div>

        <div className="mt-8 space-y-[8px]">
          <p className="text-[12px] font-medium text-[#8C91A7]">
            {resultData.userName}님과 어울리는 브랜드
          </p>

          <p className="mt-2 text-[16px] font-bold text-[#5B63FF]">
            {resultData.recommendedBrand}
          </p>

          <p className="mt-2 text-[16px] font-medium text-[#8C91A7]">
            잘 어울릴 것으로 보여요
          </p>
        </div>

        {/* 일러스트 */}
        <div className="mt-16 flex items-center justify-center">
          <img
            src= {MainIcon}
            alt="메인 아이콘"
            className="h-auto w-[170px] select-none"
            draggable={false}
          />
        </div>

        {/* sticky footer와 겹치지 않게 여유 */}
        <div className="h-10" />
      </main>

      {/* ✅ 하단 버튼: fixed 대신 sticky로 (컨테이너 폭에 맞춰 “max”로 보임) */}
      <div className="sticky bottom-0 w-full bg-white/70 px-6 pb-8 pt-4 backdrop-blur">
        <button
          className="flex h-[56px] w-full items-center justify-center gap-[6px] rounded-2xl bg-[#5B63FF] text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(91,99,255,0.28)] active:scale-[0.99]"
          onClick={() => navigate({ to: "/" })}
        >

          <img
            src= {WhiteLogo}
            alt="흰색 로고"
            className="h-auto w-[26px] select-none"
            draggable={false}
          />
            <path
              d="M13.8 10.2a4 4 0 0 1 0 5.6l-2 2a4 4 0 1 1-5.6-5.6l.9-.9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
             RealMatch 시작하기
        </button>
      </div>
    </div>
  );
}
