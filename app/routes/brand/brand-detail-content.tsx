import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import BrandHero from "./components/BrandHero";
import BrandInfo from "./components/BrandInfo";
import BrandActionBar from "./components/BrandActionBar";
import PillChip from "./components/PillChip";
import TagGroup from "./components/TagGroup";
import OngoingCampaignSection from "./components/OngoingCampaignSection";
import ProductMiniCard from "./components/ProductMiniCard";
import HistoryRow from "./components/HistoryRow";

import { tokenStorage } from "../../lib/token";
import { toggleBrandLike } from "../matching/api/matching";

import type { BrandDetailData } from "./types";

type Props = { data: BrandDetailData };

export default function BrandDetailContent({ data }: Props) {
  const heroUrl = data.brandImages?.[0] ?? data.heroImageUrl;

  const [historyLimit, setHistoryLimit] = useState(4);
  const [isHearted, setIsHearted] = useState<boolean>(data.isLiked ?? false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const brandId = Number(searchParams.get("brandId"));

  const handleLoadMoreHistory = () => setHistoryLimit((prev) => prev + 4);

  const handleChat = () => {
    console.log("go:", `/rooms/brand/${brandId}`);

    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
      return;
    }

    if (!Number.isFinite(brandId) || brandId <= 0) return;

    navigate(`/rooms/brand/${brandId}`);
  };

  const handleToggleHeart = async () => {
    if (!Number.isFinite(brandId) || brandId <= 0) return;

    const prev = isHearted;
    const next = !prev;

    setIsHearted(next);

    try {
      const serverStatus = await toggleBrandLike(brandId);
      setIsHearted(serverStatus);
    } catch (e) {
      setIsHearted(prev);
      console.error("brand like toggle failed:", e);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen max-w-[430px] bg-white">
        <BrandHero heroImageUrl={heroUrl} logoText={data.logoText ?? ""} />
        <div className="px-5 pb-10">
          <BrandInfo
            name={data.name}
            matchRate={data.matchRate}
            hashtags={(data.hashtags ?? []).slice(0, 2)}
            description={data.description}
          />

          <BrandActionBar
            isHearted={isHearted}
            onChat={handleChat}
            onSuggest={() => console.log("제안하기")}
            onToggleHeart={handleToggleHeart}
          />

          <div className="my-4 h-[1px] w-full bg-gray-200" />

          <section className="py-5">
            <div className="text-title7 text-text-black">카테고리</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(data.categories ?? []).map((c) => (
                <PillChip key={c} variant="filled">
                  {c}
                </PillChip>
              ))}
            </div>
          </section>

          <div className="h-px bg-bluegray-2" />

          <section className="py-5">
            {(data.tagSections ?? []).map((sec, idx) => (
              <div
                key={`${sec.title}-${idx}`}
                className={idx === 0 ? "" : "mt-6"}
              >
                <div className="text-title7 text-text-black">{sec.title}</div>
                <div className="mt-4 space-y-4">
                  {sec.groups.map((g) => (
                    <TagGroup
                      key={`${sec.title}-${g.label}`}
                      label={g.label}
                      chips={g.chips}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>

          <DividerBlock />

          <OngoingCampaignSection
            campaigns={data.ongoingCampaigns}
            onMore={() => console.log("캠페인 더보기")}
          />

          <DividerBlock />

          <section className="py-5">
            <div className="flex items-center justify-between">
              <div className="text-title7 text-text-black">협찬 가능 제품</div>
              <button
                type="button"
                className="text-[18px] text-text-gray3"
                aria-label="more"
              >
                ›
              </button>
            </div>

            <div className="mt-4 -mx-5 overflow-x-auto px-5 scrollbar-hide">
              <div className="flex gap-3">
                {(data.products ?? []).map((p) => (
                  <ProductMiniCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          </section>

          <DividerBlock />

          <section className="py-5">
            <div className="text-title7 text-text-black">캠페인 내역</div>

            <div className="mt-3">
              {(data.histories ?? []).slice(0, historyLimit).map((h) => (
                <HistoryRow key={h.id} item={h} />
              ))}

              {historyLimit < (data.histories ?? []).length && (
                <div className="flex items-center border-t border-bluegray-2 py-3">
                  <div className="flex-1" />
                  <div className="w-[140px] shrink-0 text-right">
                    <button
                      type="button"
                      onClick={handleLoadMoreHistory}
                      className="inline-block bg-transparent p-0 text-[13px] font-medium text-text-gray3 outline-none"
                      aria-label="캠페인 내역 더보기"
                    >
                      + 더보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DividerBlock() {
  return (
    <div className="relative left-1/2 mt-5 h-2 w-screen -translate-x-1/2 bg-bluegray-1" />
  );
}
