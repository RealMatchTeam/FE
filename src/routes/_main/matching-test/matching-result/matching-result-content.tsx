import { useNavigate } from "@tanstack/react-router";
import { Route } from "./route";
import MainIcon from "../../../../assets/MainIcon.svg";
import WhiteLogo from "../../../../assets/whitelogo.svg";
import { useMatchResultStore } from "../../../../stores/matching-result";

export default function MatchingResultContent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const setResult = useMatchResultStore((s) => s.setResult);

  const resultData = {
    userName: search.userName ?? "OO",
    beautyTraits: search.fitTraits ?? "00 핏 특성들",
    styleTraits: search.styleTraits ?? "00 패션 특성들",
    contentTraits: search.moodTraits ?? "00 콘텐츠 특성들",
    recommendedBrand: search.recommendedBrand ?? "00한 브랜드와",
  };

  const onGoHome = () => {
    setResult({
      completed: true,
      updatedAt: Date.now(),
      summary: {
        userName: resultData.userName,
        traits: {
          beauty: resultData.beautyTraits,
          style: resultData.styleTraits,
          content: resultData.contentTraits,
        },
        recommendedBrand: resultData.recommendedBrand,
      },
    });
    navigate({ to: "/" });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#F6F7FF] to-white">
      {/* ===== CONTENT ===== */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-[14px] font-medium text-[#404252]">매칭 결과</p>

        <h1
          className="
            mt-1
            text-[24px] font-extrabold tracking-[-0.02em]
            bg-[radial-gradient(circle_at_top,_#5D5DFF_0%,_#382FE4_45%,_#3915DA_100%)]
            bg-clip-text text-transparent
          "
        >
          <span className="mr-1">{resultData.userName}</span>
          한 크리에이터
        </h1>

        <p className="mt-4 text-[12px] font-medium text-[#5B5D6B]">
          {resultData.userName}님의 특성
        </p>

        <div className="mt-2 space-y-1">
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

        <div className="mt-4 space-y-1">
          <p className="text-[12px] font-medium text-[#8C91A7]">
            {resultData.userName}님과 어울리는 브랜드
          </p>
          <p className="text-[16px] font-bold text-[#5B63FF]">
            {resultData.recommendedBrand}
          </p>
          <p className="text-[16px] font-medium text-[#8C91A7]">
            잘 어울릴 것으로 보여요
          </p>
        </div>

        <div className="mt-6">
          <img
            src={MainIcon}
            alt="메인 아이콘"
            className="w-[150px] select-none"
            draggable={false}
          />
        </div>
      </main>

      {/* ===== BUTTON ===== */}
      <div className="px-6 pb-4 pt-2">
        <button
          onClick={onGoHome}
          className="
            flex h-[56px] w-full items-center justify-center gap-[6px]
            rounded-2xl bg-[#5B63FF]
            text-[15px] font-semibold text-white
            shadow-[0_10px_24px_rgba(91,99,255,0.28)]
            active:scale-[0.99]
          "
        >
          <img src={WhiteLogo} alt="" className="w-[26px]" />
          RealMatch 시작하기
        </button>
      </div>
    </div>
  );
}
