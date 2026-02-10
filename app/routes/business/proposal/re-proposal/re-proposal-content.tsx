import { useState, useEffect } from "react";
import { useSearchParams} from "react-router-dom";
import { getProposalDetail, type ProposalDetail } from "../api/proposal";
import { getBrandSummary, type BrandSummary } from "../api/brand";
import { getProfileCard, type ProfileCard } from "../api/user";
import { toast } from "sonner";
import Header from "../../../../components/layout/Header";
import ProfileSelector from "../../../matching/suggest/components/ProfileSelector";
import Button from "../../../../components/common/Button";
import CampaignInfoGroup from "../../components/CampaignInfoGroup";

export default function ReProposalContent() {
    const [searchParams] = useSearchParams();
    const proposalId = searchParams.get("proposalId");

    const [data, setData] = useState<ProposalDetail | null>(null);
    const [brand, setBrand] = useState<BrandSummary | null>(null);
    const [profileCard, setProfileCard] = useState<ProfileCard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!proposalId) return;

            try {
                setIsLoading(true);
                const proposalResult = await getProposalDetail(proposalId);
                setData(proposalResult);

                if (proposalResult.brandId) {
                    const brandResult = await getBrandSummary(proposalResult.brandId);
                    setBrand(brandResult);
                }

                const profileResult = await getProfileCard();
                setProfileCard(profileResult);
            } catch (error) {
                console.error("제안 상세 조회 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [proposalId]);

    if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
    if (!data) return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="재 제안하기" />

            <main className="flex flex-col pb-24">
                <div className="px-4 py-6">
                    <div className="flex items-center gap-3">
                        <img src={brand?.brandImageUrl} alt="brand" className="w-12 h-12 rounded-full" />
                        <div>
                            <h2 className="text-title1 text-text-black">{data.title}</h2>
                            <p className="text-text-gray2">{data.status}</p>
                            <span className="text-callout1 text-text-gray1">@{profileCard?.snsAccount || "unknown"}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-title3 text-text-gray2">캠페인 내용</p>
                        <div className="w-full p-4 bg-bluegray-2 rounded-lg">
                            <p>{data.description}</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-5 flex flex-col gap-4">
                    <ProfileSelector username={profileCard?.snsAccount} onClick={() => {/* 프로필 선택 로직 */ }} />
                    <CampaignInfoGroup label="형식">
                        <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                            {data.contentTags.formats.map((format) => format.name).join(", ")}
                        </div>
                    </CampaignInfoGroup>

                    <CampaignInfoGroup label="원고료">
                        <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                            {data.rewardAmount.toLocaleString()} <span className="text-text-black">원</span>
                        </div>
                    </CampaignInfoGroup>

                    <CampaignInfoGroup label="제작 기간">
                        <div className="flex items-center gap-2 text-text-gray1">
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1">
                                {(data.startDate || "").replace(/-/g, '. ')}
                            </div>
                            <span className="text-text-gray3">~</span>
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1">
                                {(data.endDate || "").replace(/-/g, '. ')}
                            </div>
                        </div>
                    </CampaignInfoGroup>
                </div>

                <div className="px-4 py-5 flex justify-end bg-bg-w">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => toast.success("재 제안하기가 완료되었습니다!")}
                    >
                        다시 제안하기
                    </Button>
                </div>
            </main>
        </div>
    );
}