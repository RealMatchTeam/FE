import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../../../api/axios";

type Collaboration = {
  campaignId?: number | null;
  proposalId?: number | null;
  brandName?: string | null;
  thumbnailUrl?: string | null;
  title?: string | null;
  status?: "NONE" | "REVIEWING" | "MATCHED" | "REJECTED" | null;
  startDate?: string | null;
  endDate?: string | null;
  type?: "APPLIED" | "SENT" | "RECEIVED" | null;
};

type CollaborationResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Collaboration[];
};

const PAGE_SIZE = 3;

const typeLabelMap: Record<string, string> = {
  APPLIED: "지원",
  SENT: "보낸 제안",
  RECEIVED: "받은 제안",
};

const statusLabelMap: Record<string, string> = {
  NONE: "",
  REVIEWING: "검토중",
  MATCHED: "완료",
  REJECTED: "거절",
};

const formatDate = (date?: string | null) => {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  if (!y || !m || !d) return date;
  return `${m}/${d}/${y.slice(2)}`;
};

export default function CampaignsSection() {
  const [items, setItems] = useState<Collaboration[]>([]);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res =
          await axiosInstance.get<CollaborationResponse>("/api/v1/campaigns/collaborations/me");
        if (!isMounted) return;
        setItems(res.data?.isSuccess ? res.data.result ?? [] : []);
      } catch (error) {
        console.error("캠페인 조회 실패:", error);
        if (!isMounted) return;
        setItems([]);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, safePage]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(safePage - 1, totalPages - 3));
    return [start, start + 1, start + 2, start + 3];
  }, [safePage, totalPages]);

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-[12px]">
        <div className="text-[14px] font-semibold text-black/80">진행한 캠페인</div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="진행한 캠페인 펼치기/접기"
          className="text-black/30"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={isOpen ? "" : "rotate-180"}
          >
            <path
              d="M6 15L12 9L18 15"
              stroke="#9B9BA1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div>
          <div className="divide-y divide-[#E8E8FB]">
            {pageItems.map((item, idx) => {
              const typeLabel = item.type ? typeLabelMap[item.type] : "";
              const statusLabel = item.status ? statusLabelMap[item.status] : "";
              const dateLabel = formatDate(item.endDate ?? item.startDate ?? undefined);
              const rightLabel = [dateLabel, statusLabel].filter(Boolean).join(" ");
              const title = item.title ?? "";
              const brand = item.brandName ? `${item.brandName} - ` : "";

              return (
                <div key={`${item.proposalId ?? item.campaignId ?? idx}`} className="flex items-center gap-3 py-3">
                  <div className="min-w-[72px] text-[#4A4DFF] underline underline-offset-2 text-[12px] font-semibold">
                    {typeLabel}
                  </div>
                  <div className="flex-1 text-[12px] text-[#5B5D6B] truncate">
                    {brand}
                    {title}
                  </div>
                  <div className="text-[12px] text-[#9B9BA1] shrink-0">
                    {rightLabel}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              className="text-[#5B5D6B] px-1"
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              aria-label="첫 페이지"
            >
              «
            </button>
            <button
              type="button"
              className="text-[#5B5D6B] px-1"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="이전 페이지"
            >
              ‹
            </button>

            {pageNumbers.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={[
                  "w-7 h-7 rounded-full text-[12px]",
                  n === safePage ? "bg-[#B7B7F3] text-white" : "text-[#5B5D6B]",
                ].join(" ")}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              className="text-[#5B5D6B] px-1"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="다음 페이지"
            >
              ›
            </button>
            <button
              type="button"
              className="text-[#5B5D6B] px-1"
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              aria-label="마지막 페이지"
            >
              »
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
