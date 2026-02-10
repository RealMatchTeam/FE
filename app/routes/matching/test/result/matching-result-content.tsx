import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMatchResultStore } from "../../../../stores/matching-result";
import { useAuthStore } from "../../../../stores/auth-store";
import MainIcon from "../../../../assets/MainIcon.svg";
import Button from "../../../../components/common/Button";

type Brand = {
  brandId: number;
  brandName: string;
  matchingRatio: number;
  logoUrl?: string;
};

type ApiResult = {
  username: string;
  userType: string;
  userTypeImage?: string;
  typeTag: string[];
  highMatchingBrandList: {
    count: number;
    brands: Brand[];
  };
};

type LocationState = {
  apiResult?: ApiResult;
};

export default function MatchingResultContent() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState | null };
  const [searchParams] = useSearchParams();
  const setResult = useMatchResultStore((s) => s.setResult);
  const setMe = useAuthStore((s) => s.setMe);

  const data = useMemo(() => {
    const apiResult = location.state?.apiResult;

    if (apiResult) {
      console.log("[result] apiResult exists:", !!apiResult);
      console.log(
        "[result] first brand:",
        apiResult?.highMatchingBrandList?.brands?.[0],
      );
      const userName = apiResult.username;
      const userType = apiResult.userType;
      const tags = apiResult.typeTag.slice(0, 3);
      const brands = [...apiResult.highMatchingBrandList.brands]
        .sort((a, b) => b.matchingRatio - a.matchingRatio)
        .slice(0, 3);

      return {
        userName,
        userType,
        tags,
        brands,
        userTypeImage: apiResult.userTypeImage,
      };
    }

    // fallback (직접 진입/새로고침으로 state 사라진 경우)
    const userName =
      searchParams.get("username") ?? searchParams.get("userName") ?? "비비";
    const userType = searchParams.get("userType") ?? "섬세한 설계자";

    const tags = searchParams
      .get("typeTag")
      ?.split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 3) ?? ["기획중심", "구조탄탄", "디테일중심"];

    const brands: Brand[] = [
      { brandId: 1, brandName: "beplain", matchingRatio: 98 },
      { brandId: 2, brandName: "isntree", matchingRatio: 96 },
      { brandId: 3, brandName: "ma:nyo", matchingRatio: 91 },
    ];

    return { userName, userType, tags, brands, userTypeImage: undefined };
  }, [location.state, searchParams]);

  const onStart = () => {
    setResult({
      completed: true,
      updatedAt: Date.now(),
      summary: {
        userName: data.userName,
        traits: {
          beauty: data.tags[0] ?? "",
          style: data.tags[1] ?? "",
          content: data.tags[2] ?? "",
        },
        recommendedBrand: data.brands[0]?.brandName ?? "",
      },
    });

    // 매칭 테스트 완료 상태 업데이트
    setMe({ matchingTestDone: true });

    // 강제로 리프레시하기 위해 state 전달
    navigate("/", { state: { refresh: Date.now() }, replace: true });
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
                key={tag}
                className="rounded-full border border-[#D9DDF5] bg-white/75 px-[12px] py-[4px] text-[12px] font-medium text-[#5B5D6B] shadow-[0_4px_12px_rgba(90,95,160,0.10)]"
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
                <div className="flex aspect-square w-full items-center justify-center rounded-[12px] border border-[#E6E8F5] bg-white shadow-[0_6px_14px_rgba(39,56,146,0.10)]">
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
                  <span className="ml-[4px] font-medium text-[#5B5D6B]">
                    {b.brandName}
                  </span>
                  <span className="font-bold text-[#4A4CFF]">
                    {b.matchingRatio}%
                  </span>
                </div>
              </div>
            ))}
          </div>

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
