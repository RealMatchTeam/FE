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

const short5 = (s: string) => (s.length > 5 ? `${s.slice(0, 5)}...` : s);

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
    <div className="h-full w-full overflow-hidden bg-[linear-gradient(180deg,#EAEAFF_0%,#EFEFFE_39%,#FAFAFD_100%)]">
      <div className="mx-auto h-full w-full max-w-md">
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div
            className="flex min-h-0 flex-1 flex-col items-center px-4"
            style={{
              paddingTop: "clamp(3.5rem, 14dvh, 7rem)",
              paddingBottom: "clamp(1rem, 2.5dvh, 1.5rem)",
            }}
          >
            <div
              className="flex w-full flex-1 min-h-0 flex-col items-center"
              style={{ gap: "clamp(1.25rem, 3dvh, 2rem)" }}
            >
              <div
                className="flex w-full flex-col items-center"
                style={{ gap: "clamp(0.75rem, 2dvh, 1rem)" }}
              >
                <div className="flex w-full flex-col gap-2">
                  <p className="text-center text-title3 text-text-gray1">
                    <span className="text-title3 text-core-1">
                      {data.userName}
                    </span>{" "}
                    님의 매칭 결과
                  </p>
                  <h1 className="text-center text-headline1 bg-[linear-gradient(90deg,#382FE4_0%,#5D5DFF_48%,#3915DA_95%)] bg-clip-text text-transparent font-extrabold">
                    {data.userType}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-bluegray-2 bg-white/80 px-3 py-1 text-callout1 text-text-gray2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-1 min-h-0 items-center justify-center">
                <div
                  className={[
                    "relative aspect-[7/6] w-[min(56vw,13.125rem)]",
                    "[@media(max-height:700px)]:w-[min(50vw,11.5rem)]",
                    "[@media(max-height:667px)]:w-[min(46vw,10.5rem)]",
                  ].join(" ")}
                >
                  <img
                    src={userTypeIconSrc}
                    alt={data.userType}
                    className={[
                      "absolute left-0 w-full select-none object-contain",
                      "top-[-12%] h-[112%]",
                      "[@media(max-height:700px)]:top-0",
                      "[@media(max-height:700px)]:h-full",
                      "[@media(max-height:667px)]:w-full",
                      "[@media(max-height:667px)]:top-0",
                      "[@media(max-height:667px)]:h-full",
                      "[@media(max-height:667px)]:translate-y-[3px]",
                    ].join(" ")}
                    style={{
                      imageRendering: "auto",
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                      WebkitFontSmoothing: "antialiased",
                    }}
                    draggable={false}
                  />
                </div>
              </div>

              <div
                className="flex w-full flex-col items-center"
                style={{ gap: "clamp(0.5rem, 1.5dvh, 0.75rem)" }}
              >
                {loading ? (
                  <p className="text-callout1 text-text-gray2">불러오는 중…</p>
                ) : null}
                {error ? (
                  <p className="text-callout1 text-red-500">{error}</p>
                ) : null}

                <p className="text-center text-title3 text-text-gray2">
                  나와 어울리는 TOP3 브랜드
                </p>

                <div className="flex items-start justify-center gap-3">
                  {data.brands.map((b) => (
                    <div key={b.brandId} className="w-[min(22vw,5rem)]">
                      <div className="aspect-square w-full rounded-[5px] bg-bluegray-2 p-[1px]">
                        <div className="h-full w-full overflow-hidden rounded-[4px] bg-white">
                          {b.logoUrl ? (
                            <img
                              src={b.logoUrl}
                              alt={b.brandName}
                              className="h-full w-full object-cover"
                              draggable={false}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center px-1 text-center text-title7 text-text-gray2">
                              {short5(b.brandName)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="min-w-0 truncate pr-1 text-callout2 text-text-gray1">
                          {short5(b.brandName)}
                        </span>
                        <span className="shrink-0 text-callout2 text-core-1">
                          {b.matchingRatio}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full px-4 pt-6 pb-2">
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

                <div style={{ height: "clamp(1rem, 2.5dvh, 2rem)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
