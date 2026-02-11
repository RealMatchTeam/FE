import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMatchResultStore } from "../../../../stores/matching-result";
import { useAuthStore } from "../../../../stores/auth-store";
import Button from "../../../../components/common/Button";
import { getMatchAnalysis } from "../../api/matching";

import engineerIcon from "../../../../assets/usertype/engineer.svg";
import directorIcon from "../../../../assets/usertype/director.svg";
import storytellerIcon from "../../../../assets/usertype/storyteller.svg";
import experimentorIcon from "../../../../assets/usertype/experimentor.svg";

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

const userTypeToIcon: Record<string, string> = {
  "섬세한 설계자": engineerIcon,
  "유연한 연출가": directorIcon,
  "재치있는 스토리텔러": storytellerIcon,
  "도전적인 실험가": experimentorIcon,
};

export default function MatchingResultContent() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState | null };
  const setResult = useMatchResultStore((s) => s.setResult);
  const setMe = useAuthStore((s) => s.setMe);

  const [apiResult, setApiResult] = useState<ApiResult | null>(
    location.state?.apiResult ?? null,
  );
  const [loading, setLoading] = useState(!location.state?.apiResult);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiResult) return;

    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const r = await getMatchAnalysis();
        if (ac.signal.aborted) return;

        setApiResult(r as unknown as ApiResult);
      } catch (err) {
        if (ac.signal.aborted) return;
        if (err instanceof DOMException && err.name === "AbortError") return;

        console.error("getMatchAnalysis failed:", err);
        setError("매칭 결과를 불러오지 못했어요.");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [apiResult]);

  const data = useMemo(() => {
    const r = apiResult;

    const fallback = {
      userName: "비비",
      userType: "유연한 연출가",
      tags: ["연출유연", "트렌드적응", "브랜드이해도"],
      brands: top3([
        { brandId: 1, brandName: "이즈앤트리", matchingRatio: 98 },
        { brandId: 2, brandName: "비플레인", matchingRatio: 95 },
        { brandId: 3, brandName: "마녀공장", matchingRatio: 90 },
      ]),
    };

    if (!r) return fallback;

    return {
      userName: r.username,
      userType: r.userType,
      tags: (r.typeTag ?? []).slice(0, 3),
      brands: top3(r.highMatchingBrandList?.brands ?? []),
    };
  }, [apiResult]);

  const userTypeIconSrc = userTypeToIcon[data.userType] ?? directorIcon;

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

    setMe({ matchingTestDone: true });
    navigate("/", { state: { refresh: Date.now() }, replace: true });
  };

  return (
    <div className="w-full bg-[linear-gradient(180deg,#EAEAFF_0%,#EFEFFE_39%,#FAFAFD_100%)] min-h-[calc(100dvh-80px-67px)] flex">
      <div className="mx-auto w-full max-w-[560px] flex flex-col flex-1">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 md:px-8">
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full flex flex-col items-center gap-[14px]">
                <div className="w-full flex flex-col gap-2">
                  <p className="text-center text-[clamp(13px,2.8vw,14px)] leading-5 font-medium text-text-gray2">
                    <span className="font-semibold text-core-1">
                      {data.userName}
                    </span>{" "}
                    님의 매칭 결과
                  </p>
                  <h1 className="text-center text-[clamp(22px,5.8vw,28px)] leading-[1.07] font-extrabold text-[#382FE4]">
                    {data.userType}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-bluegray-2 bg-white/80 px-2 py-1 text-[clamp(11px,2.6vw,12px)] leading-4 font-medium text-text-gray2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative w-[min(56vw,210px)] aspect-[7/6]">
                <img
                  src={userTypeIconSrc}
                  alt={data.userType}
                  className="absolute left-0 top-[-12%] h-[112%] w-full select-none object-contain"
                  draggable={false}
                />
              </div>

              {loading ? (
                <p className="text-[clamp(11px,2.6vw,12px)] leading-4 font-medium text-text-gray2">
                  불러오는 중…
                </p>
              ) : null}
              {error ? (
                <p className="text-[clamp(11px,2.6vw,12px)] leading-4 font-medium text-red-500">
                  {error}
                </p>
              ) : null}

              <div className="w-full flex flex-col items-center gap-2">
                <p className="text-center text-[clamp(13px,2.8vw,14px)] leading-[18px] font-semibold text-text-gray2">
                  나와 어울리는 TOP3 브랜드
                </p>

                <div className="flex items-start justify-center gap-2 sm:gap-3">
                  {data.brands.map((b) => (
                    <div
                      key={b.brandId}
                      className="w-[clamp(64px,18vw,72px)] p-[1px]"
                    >
                      <div className="h-[clamp(64px,18vw,72px)] w-full overflow-hidden rounded-[5px] border border-bluegray-2 bg-white">
                        {b.logoUrl ? (
                          <img
                            src={b.logoUrl}
                            alt={b.brandName}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center px-1 text-center text-[clamp(9px,2.2vw,10px)] font-semibold text-text-black">
                            {b.brandName}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="min-w-0 truncate pr-1 text-[clamp(9px,2.2vw,10px)] leading-3 font-semibold text-text-gray2">
                          {b.brandName}
                        </span>
                        <span className="shrink-0 text-[clamp(9px,2.2vw,10px)] leading-3 font-semibold text-core-1">
                          {b.matchingRatio}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full mt-[30px] px-[20px] pb-[20px]">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    withLogo
                    onClick={onStart}
                    disabled={loading}
                    className="h-[44px] rounded-[12px]"
                  >
                    RealMatch 시작하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
