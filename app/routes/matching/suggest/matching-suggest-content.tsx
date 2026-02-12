import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import Button from "../../../components/common/Button";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import { CheckIcon } from "../../auth/components/CheckIcon";
import NewSuggestIcon from "../../../assets/icon/new-suggest.svg";
import ExistSuggestIcon from "../../../assets/icon/exist-suggest.svg";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useCampaignProposalStore } from "../../../stores/campaign-proposal";
import { apiClient } from "../../../api/axios";
import { toast } from "sonner";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";

interface CampaignTag {
  id: number;
  name: string;
}

interface CampaignDetailApiResponse {
  isSuccess: boolean;
  result: {
    campaignId: number;
    title: string;
    description: string;
    product: string;
    rewardAmount: number;
    startDate: string;
    endDate: string;
    contentTags: {
      formats?: CampaignTag[];
      categories?: CampaignTag[];
      tones?: CampaignTag[];
      involvements?: CampaignTag[];
      usageRanges?: CampaignTag[];
    };
  };
}

/** API 태그 데이터를 그대로 전달 (ID 매핑은 create 폼에서 처리) */
function mapTag(tag: CampaignTag): { id: number; name: string } {
  return { id: tag.id, name: tag.name };
}

export default function MatchingSuggestContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const brandId = searchParams.get("brandId");
  const campaignId = searchParams.get("campaignId");
  const productId = searchParams.get("productId");
  const domain = searchParams.get("domain") || "beauty";

  const proposalData = useCampaignProposalStore((state) => state.proposalData);
  const brandCampaigns = useCampaignProposalStore((state) => state.brandCampaigns);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useHideBottomTab(isSheetOpen);

  const handleNewCampaign = () => {
    navigate(`/matching/suggest/create?type=new&brandId=${brandId || proposalData?.brandId || ""}&domain=${domain}`);
  };

  const handleExistingCampaign = () => {
    const activeBrandId = brandId || proposalData?.brandId;
    if (!activeBrandId) {
      toast.error(
        "브랜드 정보가 없습니다. 브랜드 상세 페이지에서 제안하기를 눌러주세요",
      );
      return;
    }

    if (brandCampaigns.length === 0) {
      toast.error("해당 브랜드에 캠페인이 없습니다");
      return;
    }

    setIsSheetOpen(true);
  };

  const handleToggleCampaign = (id: number) => {
    setSelectedCampaignId(id);
  };

  const handleSheetSubmit = async () => {
    if (!selectedCampaignId) {
      toast.error("캠페인을 선택해주세요");
      return;
    }

    const selectedCampaign = brandCampaigns.find(
      (c) => c.campaignId === selectedCampaignId,
    );
    if (!selectedCampaign || !proposalData) return;

    setIsLoading(true);

    try {
      const res = await apiClient.get<CampaignDetailApiResponse>(
        `/api/v1/campaigns/${selectedCampaignId}`,
      );

      const setProposalData = useCampaignProposalStore.getState().setProposalData;

      if (res.data?.isSuccess && res.data.result) {
        const c = res.data.result;
        const tags = c.contentTags;

        setProposalData({
          ...proposalData,
          campaignId: selectedCampaignId,
          campaignTitle: c.title || selectedCampaign.title,
          campaignDescription: c.description || "",
          rewardAmount: c.rewardAmount || 0,
          product: c.product || "",
          startDate: c.startDate || "",
          endDate: c.endDate || "",
          contentTags: {
            formats: (tags?.formats ?? []).map(mapTag),
            categories: (tags?.categories ?? []).map(mapTag),
            tones: (tags?.tones ?? []).map(mapTag),
            involvements: (tags?.involvements ?? []).map(mapTag),
            usageRanges: (tags?.usageRanges ?? []).map(mapTag),
          },
        });
      } else {
        setProposalData({
          ...proposalData,
          campaignId: selectedCampaignId,
          campaignTitle: selectedCampaign.title,
        });
      }
    } catch {
      const setProposalData = useCampaignProposalStore.getState().setProposalData;
      setProposalData({
        ...proposalData,
        campaignId: selectedCampaignId,
        campaignTitle: selectedCampaign.title,
      });
    } finally {
      setIsLoading(false);
    }

    navigate(
      `/matching/suggest/create?type=existing&brandId=${brandId || proposalData.brandId}&campaignId=${selectedCampaignId}&domain=${domain}`,
    );
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setSelectedCampaignId(null);
  };

  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center px-5 py-20 gap-17">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="text-title1"
          onClick={handleNewCampaign}
        >
          <img src={NewSuggestIcon} alt="" className="w-6 h-6 mr-2" />
          신규 캠페인 제안
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="text-title1"
          onClick={handleExistingCampaign}
        >
          <img
            src={ExistSuggestIcon}
            alt=""
            className="w-6 h-6 mr-2 brightness-0 invert"
          />
          기존 캠페인 제안
        </Button>
      </div>

      {/* 기존 캠페인 선택 바텀시트 */}
      <FilterBottomSheet
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        className="h-[50%]"
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center gap-2">
              <img src={ExistSuggestIcon} alt="" className="w-6 h-6" />
              <h3 className="text-title2 text-text-black">기존 캠페인 제안</h3>
            </div>
          </div>
          <div className="w-[90%] mx-auto border-b border-core-2" />

          {/* 캠페인 목록 (스크롤 영역) */}
          <div className="flex-1 overflow-y-auto px-5 pt-2.5 pb-4 flex flex-col gap-2.5">
            {brandCampaigns.length === 0 ? (
              <div className="text-center py-8 text-text-gray2">
                캠페인이 없습니다
              </div>
            ) : (
              brandCampaigns.map((campaign) => (
                <label
                  key={campaign.campaignId}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <div onClick={() => handleToggleCampaign(campaign.campaignId)}>
                    <CheckIcon
                      checked={selectedCampaignId === campaign.campaignId}
                    />
                  </div>
                  <span className="text-title3 text-text-gray1">
                    {campaign.title}
                  </span>
                </label>
              ))
            )}
          </div>

          {/* 선택 완료 버튼 (바닥 고정) */}
          <div className="flex items-center justify-center py-4 px-5 bg-white">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSheetSubmit}
              disabled={isLoading}
              className="text-title7 w-full h-[44px] flex items-center justify-center gap-[10px]"
            >
              {isLoading ? <LoadingSpinner size={24} /> : "선택 완료"}
            </Button>
          </div>
        </div>
      </FilterBottomSheet>
    </>
  );
}
