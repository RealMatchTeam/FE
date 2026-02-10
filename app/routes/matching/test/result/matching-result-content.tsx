import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMatchResultStore } from "../../../../stores/matching-result";
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
  highMatchingBrandList: { count: number; brands: Brand[] };
};

type LocationState = { apiResult?: ApiResult };

const top3 = (brands: Brand[]) =>
  [...brands].sort((a, b) => b.matchingRatio - a.matchingRatio).slice(0, 3);

export default function MatchingResultContent() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState | null };
  const [searchParams] = useSearchParams();
  const setResult = useMatchResultStore((s) => s.setResult);

  const data = useMemo(() => {
    const apiResult = location.state?.apiResult;

    if (apiResult) {
      const brands = top3(apiResult.highMatchingBrandList.brands);
      return {
        userName: apiResult.username,
        userType: apiResult.userType,
        tags: apiResult.typeTag.slice(0, 3),
        brands,
      };
    }

    const userName =
      searchParams.get("username") ?? searchParams.get("userName") ?? "비비";
    const userType = searchParams.get("userType") ?? "유연한 연출가";

    const tags =
      searchParams
        .get("typeTag")
        ?.split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .slice(0, 3) ?? ["연출유연", "트렌드적응", "브랜딩애호"];

    const brands: Brand[] = [
      { brandId: 1, brandName: "isntree", matchingRatio: 98 },
      { brandId: 2, brandName: "beplain", matchingRatio: 95 },
      { brandId: 3, brandName: "ma:nyo", matchingRatio: 90 },
    ];

    return { userName, userType, tags, brands: top3(brands) };
  }, [location.state, searchParams]);

  const onStart = () => {
    setResult({
      completed: true,
      updatedAt: Date.now(),
      summary: {
        userName: data.userName,
        userType: data.userType,
        traits: {
          beauty: data.tags[0] ?? "",
          style: data.tags[1] ?? "",
          content: data.tags[2] ?? "",
        },
        recommendedBrand: data.brands[0]?.brandName ?? "",
      },
    });

    navigate("/home");
  };

  return (
    <div className="min-h-full w-full bg-grad-auth-reverse">
      <div className="mx-auto min-h-full w-full max-w-[430px]">
        <div className="min-h-full w-full px-6 pt-[120px] pb-[22px] flex flex-col">
          <div className="text-center">
            <p className="text-callout1 text-text-gray2">
              <span className="font-semibold text-core-1">{data.userName}</span>{" "}
              님의 매칭 결과
            </p>

            <h1 className="mt-[8px] text-headline1 text-core-1 tracking-[-0.02em]">
              {data.userType}
            </h1>

            <div className="mt-[12px] flex justify-center gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-bluegray-2 bg-bg-w-80 px-[12px] py-[4px] text-callout1 text-text-gray2 shadow-[0_8px_18px_rgba(40,60,150,0.08)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-[32px] flex justify-center">
              <img
                src={MainIcon}
                alt="매칭 결과"
                className="w-[230px] select-none"
                draggable={false}
              />
            </div>

            <p className="mt-[32px] text-title3 text-text-gray2">
              나와 어울리는 TOP3 브랜드
            </p>

            <div className="mt-[12px] flex justify-center gap-[12px]">
              {data.brands.map((b) => (
                <div key={b.brandId} className="w-[86px]">
                  <div className="flex h-[76px] w-full items-center justify-center rounded-2xl border border-bluegray-2 bg-white shadow-[0_6px_14px_rgba(40,60,150,0.10)]">
                    {b.logoUrl ? (
                      <img
                        src={b.logoUrl}
                        alt={b.brandName}
                        className="max-h-[22px] max-w-[78%] object-contain"
                        draggable={false}
                      />
                    ) : (
                      <span className="text-caption1 font-semibold text-text-black">
                        {b.brandName}
                      </span>
                    )}
                  </div>

                  <div className="mt-[6px] flex justify-between text-caption2">
                    <span className="truncate text-text-gray2">{b.brandName}</span>
                    <span className="font-semibold text-core-1">
                      {b.matchingRatio}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-[40px]">
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
