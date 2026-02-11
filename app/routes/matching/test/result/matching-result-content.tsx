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

    return () => {
      ac.abort();
    };
  }, [apiResult]);

  const data = useMemo(() => {
    const r = apiResult;

    const fallback = {
      userName: "비비",
      userType: "유연한 연출가",
      tags: ["연출유연", "트렌드적응", "브랜딩애호"],
      brands: top3([
        { brandId: 1, brandName: "isntree", matchingRatio: 98 },
        { brandId: 2, brandName: "beplain", matchingRatio: 95 },
        { brandId: 3, brandName: "ma:nyo", matchingRatio: 90 },
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
    <div className="min-h-full w-full bg-grad-auth-reverse">
      <div className="mx-auto min-h-full w-full pb-30">
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
                src={userTypeIconSrc}
                alt={data.userType}
                className="w-[230px] select-none"
                draggable={false}
              />
            </div>

            {loading ? (
              <p className="mt-3 text-caption1 text-text-gray2">불러오는 중…</p>
            ) : null}
            {error ? (
              <p className="mt-3 text-caption1 text-red-500">{error}</p>
            ) : null}

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
                    <span className="truncate text-text-gray2">
                      {b.brandName}
                    </span>
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
              disabled={loading}
            >
              RealMatch 시작하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
