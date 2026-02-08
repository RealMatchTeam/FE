import { useEffect, useMemo, useState } from "react";
import { getExistingCampaigns } from "../api/api";
import type { ExistingCampaignItem } from "../types";
import HistoryRow from "./HistoryRow";

const PAGE_SIZE = 4;

export default function CampaignHistorySection({
  brandId,
}: {
  brandId: number;
}) {
  const [campaigns, setCampaigns] = useState<ExistingCampaignItem[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;

    (async () => {
      const list = await getExistingCampaigns(brandId);
      if (!alive) return;
      setCampaigns(list);
      setPage(1);
    })().catch((e) => {
      console.error(e);
      if (!alive) return;
      setCampaigns([]);
      setPage(1);
    });

    return () => {
      alive = false;
    };
  }, [brandId]);

  const totalPages = Math.max(1, Math.ceil(campaigns.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return campaigns.slice(start, start + PAGE_SIZE);
  }, [campaigns, page]);

  return (
    <section className="py-5">
      <div className="text-title7 text-text-black">캠페인 내역</div>

      <div className="mt-3">
        {pageItems.map((c) => (
          <HistoryRow
            key={c.campaignId}
            item={{
              id: String(c.campaignId),
              title: c.title,
              rightText: "",
            }}
          />
        ))}

        {campaigns.length > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 disabled:opacity-40"
              aria-label="first page"
            >
              {"<<"}
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 disabled:opacity-40"
              aria-label="prev page"
            >
              {"<"}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={[
                  "h-8 w-8 rounded",
                  p === page
                    ? "bg-[#E8E8FB] text-[#4A4DFF]"
                    : "text-text-black",
                ].join(" ")}
                aria-label={`page-${p}`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 disabled:opacity-40"
              aria-label="next page"
            >
              {">"}
            </button>

            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 disabled:opacity-40"
              aria-label="last page"
            >
              {">>"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
