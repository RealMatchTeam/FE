import { useEffect, useState } from "react";
import SelectBottomSheet from "../../matching/suggest/create/components/SelectBottomSheet";
import { getMyCollaborations, type CampaignCollaboration } from "../../business/calendar/api/calendar";
import { getProposalDetail } from "../../business/proposal/api/proposal";
import { type ProposalDetail } from "../../matching/api/matching";
import { toast } from "sonner";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (detail: ProposalDetail) => void;
    brandId?: number;
}

export default function CampaignProposalBottomSheet({ isOpen, onClose, onSelect, brandId }: Props) {
    const [campaigns, setCampaigns] = useState<CampaignCollaboration[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchCampaigns = async () => {
                setLoading(true);
                try {
                    const today = new Date().toISOString().split("T")[0];
                    const data = await getMyCollaborations({
                        type: "SENT",
                        status: "REVIEWING",
                        endDate: today,
                    });
                    const filtered = brandId
                        ? (data || []).filter((c) => c.brandId === brandId)
                        : (data || []);
                    setCampaigns(filtered);
                } catch (error) {
                    console.error("Failed to fetch campaigns:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCampaigns();
        }
    }, [isOpen, brandId]);

    const options = campaigns
        .filter((c) => c.proposalId)
        .map((c) => ({
            value: String(c.proposalId!),
            label: c.title,
        }));

    const handleSubmit = async (values: string[]) => {
        const proposalId = values[0];
        if (!proposalId) return;

        const originalCampaign = campaigns.find(c => String(c.proposalId) === proposalId);
        if (!originalCampaign) return;

        setLoadingDetail(true);
        try {
            const detail = await getProposalDetail(proposalId);

            const result: ProposalDetail = {
                ...detail,
                campaignId: originalCampaign.campaignId
            };

            onSelect(result);
        } catch (error) {
            console.error("Failed to fetch proposal detail:", error);
            toast.error("상세 정보를 불러오는 데 실패했습니다.");
        } finally {
            setLoadingDetail(false);
            onClose();
        }
    };

    if (loading || loadingDetail) {
        return (
            <FilterBottomSheet isOpen={isOpen} onClose={onClose} className="h-[60%]">
                <LoadingSpinner className="h-full" />
            </FilterBottomSheet>
        );
    }

    return (
        <SelectBottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="재제안 선택"
            options={options}
            selectedValues={[]}
            onSubmit={handleSubmit}
            multiSelect={false}
        />
    );
}
