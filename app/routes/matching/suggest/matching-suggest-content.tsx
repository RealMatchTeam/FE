import { useNavigate } from "react-router";
import { useState } from "react";
import Button from "../../../components/common/Button";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import { CheckIcon } from "../../auth/components/CheckIcon";
import NewSuggestIcon from "../../../assets/icon/new-suggest.svg";
import ExistSuggestIcon from "../../../assets/icon/exist-suggest.svg";
import { useCampaignProposalStore } from "../../../stores/campaign-proposal";
import {
  getRecruitingCampaigns,
  type RecruitingCampaign,
} from "../api/matching";
import { toast } from "sonner";

export default function MatchingSuggestContent() {
  const navigate = useNavigate();
  const proposalData = useCampaignProposalStore((state) => state.proposalData);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [recruitingCampaigns, setRecruitingCampaigns] = useState<
    RecruitingCampaign[]
  >([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleNewCampaign = () => {
    navigate("/matching/suggest/create?type=new");
  };

  const handleExistingCampaign = async () => {
    if (proposalData?.brandId) {
      setIsLoading(true);
      setIsSheetOpen(true);

      try {
        const campaigns = await getRecruitingCampaigns(proposalData.brandId);
        setRecruitingCampaigns(campaigns);
      } catch (error) {
        console.error("모집중인 캠페인 조회 실패:", error);
        toast.error("캠페인 목록을 불러오지 못했습니다");
        setRecruitingCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(
        "브랜드 정보가 없습니다. 캠페인 상세 페이지에서 제안하기를 눌러주세요",
      );
    }
  };

  const handleToggleCampaign = (id: number) => {
    setSelectedCampaignId(id);
  };

  const handleSheetSubmit = () => {
    if (!selectedCampaignId) {
      toast.error("캠페인을 선택해주세요");
      return;
    }

    const selectedCampaign = recruitingCampaigns.find(
      (c) => c.campaignId === selectedCampaignId,
    );
    if (!selectedCampaign || !proposalData) return;

    // 선택한 캠페인 정보와 함께 페이지 이동
    navigate(
      `/matching/suggest/create?type=existing&brandId=${proposalData.brandId}&campaignId=${selectedCampaignId}&domain=${proposalData.domain}`,
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
        {/* 헤더 */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <img src={ExistSuggestIcon} alt="" className="w-6 h-6" />
            <h3 className="text-title2 text-text-black">기존 캠페인 제안</h3>
          </div>
        </div>
        <div className="w-[90%] mx-auto border-b border-core-2" />

        {/* 캠페인 목록 */}
        <div className="px-5 pt-2.5 pb-20 flex flex-col gap-2.5">
          {isLoading ? (
            <div className="text-center py-8 text-text-gray2">로딩 중</div>
          ) : recruitingCampaigns.length === 0 ? (
            <div className="text-center py-8 text-text-gray2">
              모집중인 캠페인이 없습니다
            </div>
          ) : (
            recruitingCampaigns.map((campaign) => (
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

        {/* 선택 완료 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-4 bg-white">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSheetSubmit}
            className="text-title7 w-[327px] h-[44px] flex items-center justify-center gap-[10px]"
          >
            선택 완료
          </Button>
        </div>
      </FilterBottomSheet>
    </>
  );
}
