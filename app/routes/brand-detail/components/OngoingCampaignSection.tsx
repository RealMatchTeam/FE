import { useNavigate, useSearchParams } from "react-router-dom";
import CampaignCard from "../../home/components/CampaignCard";
import { toCampaignItem } from "./toCampaignItem";
import type { BrandOngoingCampaign } from "../types";

type Props = {
  campaigns: BrandOngoingCampaign[];
  onMore?: () => void;
};

export default function OngoingCampaignSection({ campaigns, onMore }: Props) {
  const isEmpty = campaigns.length === 0;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleCampaignClick = (campaignId: number) => {
    const brandId = searchParams.get("brandId");
    const domain = searchParams.get("domain");

    const params = new URLSearchParams();
    if (brandId) params.set("brandId", brandId);
    if (domain) params.set("domain", domain);
    params.set("campaignId", String(campaignId));

    navigate(`/campaign?${params.toString()}`);
  };

  return (
    <section className="pt-9 pb-9">
      {isEmpty ? (
        <div className="inline-flex w-full flex-col items-start gap-2 bg-white px-5 py-9">
          <div className="self-stretch text-title1 text-text-black">
            캠페인 내역
          </div>

          <div className="flex h-[126px] w-full flex-col justify-center items-start">
            <div className="flex w-full flex-col items-start gap-[14px] pt-[50px] pb-[60px]">
              <div className="flex w-full flex-col items-center justify-center gap-[10px]">
                <div className="w-[113px] text-center text-[12px] font-medium leading-[16px] text-text-gray2">
                  진행한 캠페인이 없어요
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-title1 text-text-black">진행 중인 캠페인</div>

            {onMore ? (
              <button
                type="button"
                onClick={onMore}
                className="grid h-8 w-8 place-items-center rounded-full text-text-gray2"
                aria-label="more"
              >
                <span className="text-[18px] leading-none">›</span>
              </button>
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>

          <div className="mt-4 -mx-5 overflow-x-auto px-5 scrollbar-hide">
            <div className="flex gap-3">
              {campaigns.map((c) => (
                <CampaignCard
                  key={c.campaignId}
                  item={toCampaignItem(c)}
                  onClick={() => handleCampaignClick(c.campaignId)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
