import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { reRequestCampaignProposal } from "../../matching/api/matching";
import { fetchBrandDetail } from "../../brand-detail/api/api";
import { type BrandDetailData } from "../../brand-detail/types";
import { tokenStorage } from "../../../lib/token";
import { useCampaignProposalStore } from "../../../stores/campaign-proposal";
import { useAuthStore } from "../../../stores/auth-store";
import Button from "../../../components/common/Button";
import NavigationHeader from "../../../components/common/NavigateHeader";
import {
    TextInput,
    TextArea,
    SelectField,
    DateField,
    FeeInput,
} from "../../../components/form";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import { useHideHeader } from "../../../hooks/useHideHeader";
import ProfileSelector from "../../matching/components/ProfileSelector";
import SelectBottomSheet from "../../matching/suggest/create/components/SelectBottomSheet";
import DatePickerBottomSheet from "../../matching/suggest/create/components/DatePickerBottomSheet";
import ProposalModal from "../../matching/components/ProposalModal";
import {
    campaignFormSchema,
    defaultCampaignFormValues,
    type CampaignFormData,
} from "../../matching/suggest/create/schema";
import {
    CONTENT_FILTER,
} from "../../../data/filter";
import { TAG_NAME_BY_ID } from "../../../data/tagNameById";

export default function ReSuggestContent() {
    const navigate = useNavigate();
    const proposalData = useCampaignProposalStore((state) => state.proposalData);
    const snsAccount = useCampaignProposalStore((state) => state.snsAccount);
    const me = useAuthStore((state) => state.me);

    useHideHeader(true);

    // 각 필드별 바텀시트 상태
    const [isFormatSheetOpen, setIsFormatSheetOpen] = useState(false);
    const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
    const [isToneSheetOpen, setIsToneSheetOpen] = useState(false);
    const [isInvolvementSheetOpen, setIsInvolvementSheetOpen] = useState(false);
    const [isUsageScopeSheetOpen, setIsUsageScopeSheetOpen] = useState(false);
    const [isSponsorProductSheetOpen, setIsSponsorProductSheetOpen] = useState(false);
    const [isStartDateSheetOpen, setIsStartDateSheetOpen] = useState(false);
    const [isEndDateSheetOpen, setIsEndDateSheetOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [brandDetail, setBrandDetail] = useState<BrandDetailData | null>(null);

    // 바텀탭 숨기기
    const anySheetOpen = isFormatSheetOpen || isCategorySheetOpen ||
        isToneSheetOpen || isInvolvementSheetOpen || isUsageScopeSheetOpen || isSponsorProductSheetOpen ||
        isStartDateSheetOpen || isEndDateSheetOpen || isConfirmDialogOpen || isSuccessModalOpen;
    useHideBottomTab(anySheetOpen);

    // react-hook-form + zod
    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<CampaignFormData>({
        resolver: zodResolver(campaignFormSchema),
        defaultValues: defaultCampaignFormValues,
        mode: "onChange",
    });

    // 태그 이름으로 ID를 찾는 맵 생성
    const ID_BY_TAG_NAME: Record<string, number> = Object.entries(TAG_NAME_BY_ID).reduce(
        (acc, [id, name]) => ({ ...acc, [name]: Number(id) }),
        {}
    );

    // 태그 매핑 보정
    const getMappedId = (name: string) => {
        if (name === "인스타 포스트" || name === "인스타 포스터") return 172;
        if (name === "스토리&썰" || name === "스토리/썰") return 178;
        if (name === "가이드만 제공" || name === "가이드 라인만 제공") return 187;
        return ID_BY_TAG_NAME[name];
    };

    // 초기 값 채우기
    useEffect(() => {
        if (proposalData) {
            setValue("campaignName", proposalData.campaignTitle || "");
            setValue("description", proposalData.campaignDescription || "");

            if (proposalData.contentTags?.formats && proposalData.contentTags.formats.length > 0) {
                const t = proposalData.contentTags.formats[0];
                const id = t.id ?? getMappedId(t.name);
                if (id) setValue("format", String(id));
            }
            if (proposalData.contentTags?.categories && proposalData.contentTags.categories.length > 0) {
                const t = proposalData.contentTags.categories[0];
                const id = t.id ?? getMappedId(t.name);
                if (id) setValue("category", String(id));
            }
            if (proposalData.contentTags?.tones && proposalData.contentTags.tones.length > 0) {
                const t = proposalData.contentTags.tones[0];
                const id = t.id ?? getMappedId(t.name);
                if (id) setValue("tone", String(id));
            }
            if (proposalData.contentTags?.involvements && proposalData.contentTags.involvements.length > 0) {
                const t = proposalData.contentTags.involvements[0];
                const id = t.id ?? getMappedId(t.name);
                if (id) setValue("involvement", String(id));
            }
            if (proposalData.contentTags?.usageRanges && proposalData.contentTags.usageRanges.length > 0) {
                const t = proposalData.contentTags.usageRanges[0];
                const id = t.id ?? getMappedId(t.name);
                if (id) setValue("usageScope", String(id));
            }

            setValue("fee", proposalData.rewardAmount?.toString() || "");
            const productIdValue = proposalData.productId && proposalData.productId > 0
                ? proposalData.productId.toString()
                : (proposalData.product || "");
            setValue("sponsorProduct", productIdValue || "");
            setValue("startDate", proposalData.startDate || "");
            setValue("endDate", proposalData.endDate || "");
        }
    }, [proposalData, setValue]);

    // 브랜드 정보 가져오기
    useEffect(() => {
        if (proposalData?.brandId) {
            fetchBrandDetail({ brandId: String(proposalData.brandId) })
                .then(setBrandDetail)
                .catch((err) => console.error("브랜드 정보 로드 실패:", err));
        }
    }, [proposalData?.brandId]);

    const formValues = useWatch({ control, defaultValue: defaultCampaignFormValues });

    const getOptions = (filterKeys: readonly string[]) => {
        return filterKeys.map((name) => ({
            value: String(getMappedId(name) || name),
            label: name,
        }));
    };

    const formatOptions = getOptions(CONTENT_FILTER.형식);
    const categoryOptions = getOptions(CONTENT_FILTER.종류);
    const toneOptions = getOptions(CONTENT_FILTER.톤);
    const involvementOptions = getOptions(CONTENT_FILTER.관여도);
    const usageScopeOptions = getOptions(CONTENT_FILTER["활용 범위"]);

    const sponsorProductOptions = proposalData?.product
        ? [{ value: proposalData.product, label: proposalData.product }]
        : (proposalData?.products ?? []).map((p) => ({ value: String(p.id), label: p.name }));

    const findLabel = (options: { value: string; label: string }[], value?: string) => {
        if (!value) return undefined;
        const option = options.find((opt) => opt.value === value);
        if (option) return option.label;

        // Fallback to global tag mapping if value is a numeric ID
        const numericId = Number(value);
        if (!isNaN(numericId) && TAG_NAME_BY_ID[numericId]) {
            return TAG_NAME_BY_ID[numericId];
        }

        return "";
    };

    const onSubmit = () => {
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmSubmit = () => {
        const formData = formValues;
        const userId = tokenStorage.getUserId();

        if (!userId) {
            toast.error("로그인이 필요합니다.");
            return;
        }

        const requestData = {
            brandId: proposalData?.brandId || 1,
            creatorId: Number(userId),
            campaignId: proposalData?.campaignId || null,
            campaignName: formData.campaignName || "",
            description: formData.description || "",
            formats: formData.format ? [{ id: Number(formData.format) }] : [],
            categories: formData.category ? [{ id: Number(formData.category) }] : [],
            tones: formData.tone ? [{ id: Number(formData.tone) }] : [],
            involvements: formData.involvement ? [{ id: Number(formData.involvement) }] : [],
            usageRanges: formData.usageScope ? [{ id: Number(formData.usageScope) }] : [],
            rewardAmount: Number(formData.fee) || 0,
            productId: Number(formData.sponsorProduct) || 0,
            startDate: formData.startDate || "",
            endDate: formData.endDate || "",
        };

        setIsConfirmDialogOpen(false);
        setIsSuccessModalOpen(true);

        reRequestCampaignProposal(proposalData!.proposalId!, requestData).catch((error: unknown) => {
            console.error("캠페인 재제안 실패:", error);
            toast.error("캠페인 재제안에 실패했습니다. 다시 시도해주세요.");
        });
    };
    return (
        <div className="flex flex-col h-full bg-white">
            <NavigationHeader title="제안 하기" onBack={() => navigate(-1)} />

            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4">
                {/* 커스텀 브랜드 카드 디자인 */}
                <div className="flex justify-between items-start w-full py-4 mb-2">
                    <div className="flex gap-4">
                        {/* 로고 영역 */}
                        <div className="w-[84px] h-[84px] rounded-[12px] border border-bluegray-2 overflow-hidden bg-white flex items-center justify-center p-2.5">
                            <img
                                src={brandDetail?.logoImageUrl || ""}
                                className="w-full h-full object-contain"
                                alt="logo"
                            />
                        </div>

                        {/* 정보 영역 */}
                        <div className="flex flex-col justify-center gap-1.5">
                            <div className="flex items-center gap-1.5">
                                <span className="text-title7 text-text-black">
                                    {brandDetail?.name || proposalData?.brandName || ""}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="flex flex-wrap gap-1">
                                    {(brandDetail?.hashtags || []).map((tag) => (
                                        <span key={tag} className="text-callout1 text-text-gray3">#{tag}</span>
                                    ))}
                                </div>
                                <span className="text-callout1 text-[#A7B8FC] tracking-tight">검토 중</span>
                            </div>
                        </div>
                    </div>

                    {/* 매칭률 영역 */}
                    <div className="flex items-baseline gap-0.5 pt-2">
                        <span className="text-callout2 text-core-1">매칭률</span>
                        <span className="text-title1 text-core-1">{brandDetail?.matchRate ?? 99}%</span>
                    </div>
                </div>

                <div className="pb-6">
                    <h2 className="text-title1 text-text-black mt-6 mb-4">재 제안하기</h2>

                    {/* 제안 프로필 */}
                    <div className="mb-8 w-[calc(100%+16px)] -mx-2 px-3">
                        <label className="text-title3 text-text-gray1 mb-1 block">
                            제안 프로필
                        </label>
                        <ProfileSelector
                            username={snsAccount ? `@${snsAccount}` : (me?.roleText ?? me?.name)}
                            onClick={() => navigate("/mypage/profileCard")}
                        />
                    </div>

                    <div className="flex flex-col items-start w-[calc(100%+16px)] -mx-2 px-3 py-6 bg-bluegray-1 gap-8 rounded-[6px]">
                        {/* 캠페인명 */}
                        <div className="w-full">
                            <label className="text-title3 text-text-black mb-2 block ml-2">
                                캠페인명<span className="text-error text-base">*</span>
                            </label>
                            <TextInput
                                placeholder="캠페인 제안 내용을 자세히 입력해주세요"
                                maxLength={30}
                                value={formValues.campaignName ?? ""}
                                onChange={(v) => setValue("campaignName", v, { shouldValidate: true })}
                            />
                            {errors.campaignName && (
                                <p className="text-callout1 text-error mt-1 ml-1">
                                    {errors.campaignName.message}
                                </p>
                            )}
                        </div>

                        {/* 캠페인 내용 */}
                        <div className="w-full">
                            <label className="text-title3 text-text-black mb-2 block ml-2">
                                캠페인 내용<span className="text-error text-base">*</span>
                            </label>

                            <p className="text-callout1 text-text-gray2 mb-2 w-full ml-2">설명</p>
                            <TextArea
                                placeholder="캠페인 제안 내용을 자세히 입력해주세요"
                                maxLength={300}
                                value={formValues.description ?? ""}
                                onChange={(v) => setValue("description", v, { shouldValidate: true })}
                            />
                            {errors.description && (
                                <p className="text-callout1 text-error mt-1 ml-1">
                                    {errors.description.message}
                                </p>
                            )}

                            <p className="text-callout1 text-text-gray2 mt-4 mb-2 ml-2">형식</p>
                            <SelectField
                                placeholder="형식 선택"
                                value={findLabel(formatOptions, formValues.format)}
                                onClick={() => setIsFormatSheetOpen(true)}
                            />

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div>
                                    <p className="text-callout1 text-text-gray2 mb-2 ml-2">종류</p>
                                    <SelectField
                                        placeholder="종류 선택"
                                        value={findLabel(categoryOptions, formValues.category)}
                                        onClick={() => setIsCategorySheetOpen(true)}
                                    />
                                </div>
                                <div>
                                    <p className="text-callout1 text-text-gray2 mb-2 ml-2">톤</p>
                                    <SelectField
                                        placeholder="톤 선택"
                                        value={findLabel(toneOptions, formValues.tone)}
                                        onClick={() => setIsToneSheetOpen(true)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div>
                                    <p className="text-callout1 text-text-gray2 mb-2 ml-2">관여도</p>
                                    <SelectField
                                        placeholder="관여도 선택"
                                        value={findLabel(involvementOptions, formValues.involvement)}
                                        onClick={() => setIsInvolvementSheetOpen(true)}
                                    />
                                </div>
                                <div>
                                    <p className="text-callout1 text-text-gray2 mb-2 ml-2">활용 범위</p>
                                    <SelectField
                                        placeholder="활용 범위 선택"
                                        value={findLabel(usageScopeOptions, formValues.usageScope)}
                                        onClick={() => setIsUsageScopeSheetOpen(true)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 협찬품 / 원고료 */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div>
                                <label className="text-title3 text-text-black mb-2 block ml-2">
                                    협찬품<span className="text-error text-base">*</span>
                                </label>
                                <SelectField
                                    placeholder="협찬품 선택"
                                    value={findLabel(sponsorProductOptions, formValues.sponsorProduct)}
                                    onClick={() => setIsSponsorProductSheetOpen(true)}
                                />
                            </div>
                            <div>
                                <label className="text-title3 text-text-black mb-2 block ml-2">
                                    원고료<span className="text-error text-base">*</span>
                                </label>
                                <FeeInput
                                    value={formValues.fee ?? ""}
                                    onChange={(v) => setValue("fee", v, { shouldValidate: true })}
                                />
                            </div>
                        </div>

                        {/* 제작 기간 */}
                        <div className="w-full">
                            <label className="text-title3 text-text-black mb-2 block ml-2">
                                제작 기간<span className="text-error text-base">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <DateField
                                    placeholder="시작 날짜"
                                    value={formValues.startDate}
                                    onClick={() => setIsStartDateSheetOpen(true)}
                                />
                                <span className="text-text-gray3 font-bold">~</span>
                                <DateField
                                    placeholder="끝 날짜"
                                    value={formValues.endDate}
                                    onClick={() => setIsEndDateSheetOpen(true)}
                                />
                            </div>
                        </div>

                    </div>

                    {/* 버튼 */}
                    <div className="w-full mt-6 pb-10">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            withLogo
                            onClick={handleSubmit(onSubmit, () => toast.error("모두 입력해주세요"))}
                        >
                            다시 제안하기
                        </Button>
                    </div>
                </div>
            </div>

            {/* 바텀시트들 */}
            <SelectBottomSheet
                isOpen={isFormatSheetOpen}
                onClose={() => setIsFormatSheetOpen(false)}
                title="형식"
                options={formatOptions}
                selectedValues={formValues.format ? [formValues.format] : []}
                onSubmit={(values) => setValue("format", values[0] || "", { shouldValidate: true })}
                multiSelect={false}
            />
            <SelectBottomSheet
                isOpen={isCategorySheetOpen}
                onClose={() => setIsCategorySheetOpen(false)}
                title="종류"
                options={categoryOptions}
                selectedValues={formValues.category ? [formValues.category] : []}
                onSubmit={(values) => setValue("category", values[0] || "", { shouldValidate: true })}
                multiSelect={false}
            />
            <SelectBottomSheet
                isOpen={isToneSheetOpen}
                onClose={() => setIsToneSheetOpen(false)}
                title="톤"
                options={toneOptions}
                selectedValues={formValues.tone ? [formValues.tone] : []}
                onSubmit={(values) => setValue("tone", values[0] || "", { shouldValidate: true })}
                multiSelect={false}
            />
            <SelectBottomSheet
                isOpen={isInvolvementSheetOpen}
                onClose={() => setIsInvolvementSheetOpen(false)}
                title="관여도"
                options={involvementOptions}
                selectedValues={formValues.involvement ? [formValues.involvement] : []}
                onSubmit={(values) => setValue("involvement", values[0] || "", { shouldValidate: true })}
                multiSelect={false}
            />
            <SelectBottomSheet
                isOpen={isUsageScopeSheetOpen}
                onClose={() => setIsUsageScopeSheetOpen(false)}
                title="활용 범위"
                options={usageScopeOptions}
                selectedValues={formValues.usageScope ? [formValues.usageScope] : []}
                onSubmit={(values) => setValue("usageScope", values[0] || "", { shouldValidate: true })}
                multiSelect={false}
            />
            <SelectBottomSheet
                isOpen={isSponsorProductSheetOpen}
                onClose={() => setIsSponsorProductSheetOpen(false)}
                title="협찬품 선택"
                options={sponsorProductOptions}
                selectedValues={formValues.sponsorProduct ? [formValues.sponsorProduct] : []}
                onSubmit={(values) => setValue("sponsorProduct", values[0] || "", { shouldValidate: true })}
                multiSelect={false}
            />
            <DatePickerBottomSheet
                isOpen={isStartDateSheetOpen}
                onClose={() => setIsStartDateSheetOpen(false)}
                initialValue={formValues.startDate}
                onSelect={(date) => setValue("startDate", date, { shouldValidate: true })}
            />
            <DatePickerBottomSheet
                isOpen={isEndDateSheetOpen}
                onClose={() => setIsEndDateSheetOpen(false)}
                initialValue={formValues.endDate}
                onSelect={(date) => setValue("endDate", date, { shouldValidate: true })}
            />
            <ProposalModal
                isOpen={isConfirmDialogOpen}
                type="confirm"
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmSubmit}
            />
            <ProposalModal
                isOpen={isSuccessModalOpen}
                type="success"
                onClose={() => navigate("/business/calendar")}
            />
        </div>
    );
}
