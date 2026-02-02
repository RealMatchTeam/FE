import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMatchResultStore } from "../../../../stores/matching-result";
import MainIcon from "../../../../assets/MainIcon.svg";
import Button from "../../../../components/common/Button";

type Brand = {
  brandId: number;
  brandName: string;
  matchingRatio: number;
  logoUrl?: string;
};

export default function MatchingResultContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setResult = useMatchResultStore((s) => s.setResult);

  const data = useMemo(() => {
    const userName = searchParams.get("userName") ?? "비비";
    const userType = searchParams.get("userType") ?? "섬세한 설계자";

    const tags = searchParams
      .get("typeTag")
      ?.split(",")
      .map((v) => v.trim()) ?? ["기획중심", "구조탄탄", "디테일중심"];

    const brands: Brand[] = [
      { brandId: 1, brandName: "beplain", matchingRatio: 98 },
      { brandId: 2, brandName: "isntree", matchingRatio: 96 },
      { brandId: 3, brandName: "ma:nyo", matchingRatio: 91 },
    ];

    return { userName, userType, tags: tags.slice(0, 3), brands };
  }, [searchParams]);

  const onStart = () => {
    setResult({
      completed: true,
      updatedAt: Date.now(),
      summary: {
        userName: data.userName,
        traits: {
          beauty: data.tags[0],
          style: data.tags[1],
          content: data.tags[2],
        },
        recommendedBrand: data.brands[0].brandName,
      },
    });

    navigate("/");
  };

  return (
    <div className="bg-linear-to-b from-[#E6E6F3]">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="mx-auto flex w-full max-w-[370px] flex-col px-5 text-center">
          <div className="h-[64px]" />

          <p className="text-[13px] font-medium text-[#5B5D6B]">
            <span className="font-semibold text-[#4A4CFF]">
              {data.userName}
            </span>{" "}
            님의 매칭 결과
          </p>

          <h1 className="mt-[8px] text-[30px] font-extrabold tracking-[-0.02em] text-[#4A4CFF]">
            {data.userType}
          </h1>

          <div className="mt-[14px] flex justify-center gap-2">
            {data.tags.map((tag) => (
              <span
                className="
    rounded-full border border-[#D9DDF5] bg-white/75
    px-[12px] py-[4px]
    text-[12px] font-medium text-[#5B5D6B]
    shadow-[0_4px_12px_rgba(90,95,160,0.10)]
  "
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-[26px] flex justify-center">
            <img
              src={MainIcon}
              alt="매칭 결과 아이콘"
              className="w-[220px] select-none"
              draggable={false}
            />
          </div>

          <p className="mt-[30px] text-[15px] font-semibold text-[#5B5D6B]">
            나와 어울리는 TOP3 브랜드
          </p>

          <div className="mt-[12px] flex w-full justify-center gap-[12px]">
            {data.brands.map((b) => (
              <div key={b.brandId} className="w-[88px]">
                <div
                  className="
          flex aspect-square w-full items-center justify-center
          rounded-[12px] border border-[#E6E8F5] bg-white
          shadow-[0_6px_14px_rgba(39,56,146,0.10)]
        "
                >
                  {b.logoUrl ? (
                    <img
                      src={b.logoUrl}
                      alt={b.brandName}
                      className="max-h-[28px] max-w-[78%] object-contain"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-[12.5px] font-bold text-[#1F2330]">
                      {b.brandName}
                    </span>
                  )}
                </div>

                <div className="mt-[6px] flex justify-between text-[12px]">
                  <span className="font-medium text-[#5B5D6B] ml-[4px]">
                    {b.brandName}
                  </span>
                  <span className="font-bold text-[#4A4CFF]">
                    {b.matchingRatio}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 버튼 밀어내기 */}

          <div className="mt-[50px] pb-[22px]">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              withLogo
              onClick={onStart}
            >
              RealMatch 시작하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
