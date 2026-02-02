import { useNavigate } from "react-router";
import { useMatchResultStore } from "../../../../stores/matching-result";
import MatchResultHeader from "../../../../components/common/RealmatchHeader";
import MainIcon from "../../../../assets/MainIcon.svg";
import Button from "../../../../components/common/Button";

export default function MatchingResultContent() {
  const navigate = useNavigate();
  const result = useMatchResultStore((s) => s.result);

  // 결과가 없으면 매칭 테스트로 리다이렉트
  if (!result) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F6F7FF] to-white flex flex-col items-center justify-center px-6">
        <p className="text-[16px] text-[#5B5D6B] mb-4">매칭 결과가 없습니다.</p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/matching/test/step1")}
        >
          매칭 테스트 하기
        </Button>
      </div>
    );
  }

  const { summary, apiResult } = result;
  const brands = apiResult?.highMatchingBrandList.brands || [];
  const topBrands = brands.slice(0, 3);

  const onStart = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F6F7FF] to-white">
      <MatchResultHeader />

      <main className="flex w-full flex-col items-center px-6 text-center">
        <div className="mt-[84px] mb-[24px]" />
        <p className="text-[14px] font-medium text-[#404252]">매칭 결과</p>

        <h1
          className="
            text-[24px]
            font-extrabold
            tracking-[-0.02em]
            bg-[radial-gradient(circle_at_top,#5D5DFF_0%,#382FE4_45%,#3915DA_100%)]
            bg-clip-text
            text-transparent"
        >
          <span className="mr-1">{summary.userName}</span> 크리에이터
        </h1>

        <p className="mt-[30px] text-[12px] font-medium text-[#5B5D6B]">
          나의 특성
        </p>

        <div className="mt-3 space-y-2">
          {apiResult?.typeTag.map((tag, index) => (
            <p key={index} className="text-[14px] font-semibold text-[#5B63FF]">
              {tag}
            </p>
          ))}
        </div>

        {topBrands.length > 0 && (
          <>
            <div className="mt-8 space-y-[8px]">
              <p className="text-[12px] font-medium text-[#8C91A7]">
                나와 어울리는 브랜드 TOP {topBrands.length}
              </p>

              <div className="mt-2 space-y-2">
                {topBrands.map((brand, index) => (
                  <div key={brand.brandId} className="flex items-center justify-center gap-2">
                    <span className="text-[14px] font-medium text-[#8C91A7]">
                      {index + 1}.
                    </span>
                    <span className="text-[16px] font-bold text-[#5B63FF]">
                      {brand.brandName}
                    </span>
                    <span className="text-[12px] font-medium text-[#5B63FF]">
                      ({brand.matchingRatio}% 매칭)
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[16px] font-medium text-[#8C91A7]">
                잘 어울릴 것으로 보여요
              </p>
            </div>
          </>
        )}

        <div className="mt-16 flex items-center justify-center">
          <img
            src={MainIcon}
            alt="메인 아이콘"
            className="h-auto w-[170px] select-none"
            draggable={false}
          />
        </div>

        <div className="h-10" />
      </main>

      <div className="sticky bottom-0 w-full bg-white/70 px-6 pb-8 pt-4 backdrop-blur">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          withLogo
          type="button"
          onClick={onStart}
        >
          RealMatch 시작하기
        </Button>
      </div>
    </div>
  );
}
