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

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 6L11 12L17 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 6L5 12L11 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 6L13 12L7 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BrandDetailContent({ data }: Props) {
  const heroUrl = data.brandImages?.[0] ?? data.heroImageUrl;
  const [isHearted, setIsHearted] = useState<boolean>(data.isLiked ?? false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const brandId = Number(searchParams.get("brandId"));

  const handleChat = () => {
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
    } catch {
      setIsHearted(prev);
    }
  };

  const PAGE_SIZE = 4;
  const GROUP_SIZE = 4;

  const histories = data.histories ?? [];
  const hasNext = !!data.historiesHasNext;

  const [page, setPage] = useState(1);

  const knownPages = Math.max(1, Math.ceil(histories.length / PAGE_SIZE));
  const totalPages = hasNext ? Math.max(knownPages, page + 1) : knownPages;

  const groupIndex = Math.floor((page - 1) / GROUP_SIZE);
  const groupStart = groupIndex * GROUP_SIZE + 1;

  const displayPages = Array.from(
    { length: GROUP_SIZE },
    (_, i) => groupStart + i,
  );

  const canPrevGroup = groupStart > 1;

  const goPrevGroup = () => {
    if (!canPrevGroup) return;
    goPage(groupStart - GROUP_SIZE);
  };

  const canPrev = page > 1;
  const canNext = hasNext || page < totalPages;
  const canNextGroup = hasNext || groupStart + GROUP_SIZE <= totalPages;

  const startIdx = (page - 1) * PAGE_SIZE;
  const pageItems = histories.slice(startIdx, startIdx + PAGE_SIZE);

  const goPage = (p: number) => {
    if (p < 1) return;
    setPage(p);
  };

  const goPrev = () => {
    if (!canPrev) return;
    goPage(page - 1);
  };

  const goNext = () => {
    if (!canNext) return;
    goPage(page + 1);
  };

  const goNextGroup = () => {
    if (!canNextGroup) return;
    goPage(groupStart + GROUP_SIZE);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen max-w-[430px] bg-white">
        <BrandHero
          heroImageUrl={heroUrl}
          logoImageUrl={data.logoImageUrl}
          logoText={data.logoText ?? ""}
        />
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
            onSuggest={() => {}}
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
              <div key={`${sec.title}-${idx}`} className={idx ? "mt-6" : ""}>
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
            onMore={() => {}}
          />

          <DividerBlock />

          <section className="py-5">
            <div className="flex items-center justify-between">
              <div className="text-title7 text-text-black">협찬 가능 제품</div>
              <button type="button" className="text-[18px] text-text-gray3">
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

            {histories.length === 0 ? (
              <div className="flex h-[220px] items-center justify-center">
                <div className="text-[16px] font-medium text-text-gray3">
                  진행한 캠페인이 없어요
                </div>
              </div>
            ) : (
              <>
                <div className="mt-3">
                  {pageItems.map((h) => (
                    <HistoryRow key={h.id} item={h} />
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-center gap-3">
                  {/* << 그룹 이전 */}
                  {page > GROUP_SIZE && (
                    <button
                      type="button"
                      onClick={goPrevGroup}
                      className="h-7 w-7 grid place-items-center text-text-gray3"
                    >
                      <DoubleArrowLeftIcon />
                    </button>
                  )}

                  {/* < 이전 페이지 */}
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="h-7 w-7 grid place-items-center text-text-gray3 disabled:opacity-30"
                  >
                    <ArrowLeftIcon />
                  </button>

                  {/* 숫자 */}
                  <div className="flex items-center gap-3">
                    {displayPages.map((p) => {
                      const disabledPage = p > totalPages && !hasNext;
                      const active = p === page;

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => !disabledPage && goPage(p)}
                          disabled={disabledPage}
                          className={
                            active
                              ? "h-7 w-7 rounded-md text-[13px] font-semibold text-white"
                              : "h-7 w-7 rounded-md text-[13px] font-medium text-text-gray3 disabled:opacity-30"
                          }
                          style={
                            active ? { backgroundColor: "#A9ADFF" } : undefined
                          }
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  {/* > 다음 페이지 */}
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="h-7 w-7 grid place-items-center text-text-gray3 disabled:opacity-30"
                  >
                    <ArrowRightIcon />
                  </button>

                  {/* >> 그룹 다음 */}
                  <button
                    type="button"
                    onClick={goNextGroup}
                    disabled={!canNextGroup}
                    className="h-7 w-7 grid place-items-center text-text-gray3 disabled:opacity-30"
                  >
                    <DoubleArrowRightIcon />
                  </button>
                </div>
              </>
            )}
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
