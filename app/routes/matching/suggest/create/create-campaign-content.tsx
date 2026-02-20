import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createCampaignProposal } from "../../api/matching";
import { tokenStorage } from "../../../../lib/token";
import { useCampaignProposalStore } from "../../../../stores/campaign-proposal";
import { useAuthStore } from "../../../../stores/auth-store";
import Button from "../../../../components/common/Button";
import { axiosInstance } from "../../../../api/axios";

import {
  TextInput,
  TextArea,
  SelectField,
  DateField,
  FeeInput,
} from "../../../../components/form";
import { useHideBottomTab } from "../../../../hooks/useHideBottomTab";
import ProfileSelector from "../../components/ProfileSelector";
import SelectBottomSheet from "./components/SelectBottomSheet";
import DatePickerBottomSheet from "./components/DatePickerBottomSheet";
import ProposalModal from "../../components/ProposalModal";
import {
  FORMAT_TAGS,
  CATEGORY_TAGS,
  TONE_TAGS,
  INVOLVEMENT_TAGS,
  USAGE_RANGE_TAGS,
  type ProposalTag,
} from "../../../../data/proposalTags";
import {
  campaignFormSchema,
  defaultCampaignFormValues,
  type CampaignFormData,
} from "./schema";

export default function CreateCampaignContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const proposalData = useCampaignProposalStore((state) => state.proposalData);
  const me = useAuthStore((state) => state.me);

  // 프로필 정보 상태
  const [userSnsAccount, setUserSnsAccount] = useState<string | null>(null);

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

  // 바텀탭 숨기기 (바텀시트 열렸을 때)
  const anySheetOpen = isFormatSheetOpen || isCategorySheetOpen ||
    isToneSheetOpen || isInvolvementSheetOpen || isUsageScopeSheetOpen || isSponsorProductSheetOpen ||
    isStartDateSheetOpen || isEndDateSheetOpen || isConfirmDialogOpen || isSuccessModalOpen;
  useHideBottomTab(anySheetOpen);

  // react-hook-form + zod
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: defaultCampaignFormValues,
  });

  // 프로필 정보 가져오기
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get<{
          isSuccess: boolean;
          result: { snsAccount?: string | null };
        }>("/api/v1/users/me/profile-card");

        if (!isMounted) return;

        if (response.data?.isSuccess && response.data.result?.snsAccount) {
          setUserSnsAccount(response.data.result.snsAccount);
        }
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    reset(defaultCampaignFormValues);
  }, [type, reset]);

  const formValues = useWatch({ control, defaultValue: defaultCampaignFormValues });

  const toOptions = (defaultTags: ProposalTag[]) => {
    return defaultTags.map((t) => ({ value: String(t.id), label: t.name }));
  };

  const formatOptions = toOptions(FORMAT_TAGS);
  const categoryOptions = toOptions(CATEGORY_TAGS);
  const toneOptions = toOptions(TONE_TAGS);
  const involvementOptions = toOptions(INVOLVEMENT_TAGS);
  const usageScopeOptions = toOptions(USAGE_RANGE_TAGS);

  const sponsorProductOptions = useMemo(() => {
    // 이전 페이지에서 받아온 협찬품 목록 표시
    const baseOptions = (proposalData?.products ?? [])
      .filter((p) => p.id && p.name && String(p.id) !== "0" && p.name !== "0")
      .map((p) => ({ value: String(p.id), label: p.name }));

    if (proposalData?.product && proposalData.product !== "0" && !baseOptions.find(opt => opt.label === proposalData.product)) {
      baseOptions.unshift({ value: proposalData.product, label: proposalData.product });
    }

    const missingOptions = (formValues.sponsorProduct || [])
      .filter(sp => sp !== "0" && !baseOptions.find(opt => opt.value === sp))
      .map(sp => ({ value: sp, label: sp }));

    return [...baseOptions, ...missingOptions];
  }, [proposalData, formValues.sponsorProduct]);

  // ID 배열로 label들 찾기 헬퍼 함수
  const findLabels = (options: { value: string; label: string }[], values?: string[]) => {
    if (!values || values.length === 0) return undefined;
    const labels = values
      .map(value => {
        const found = options.find((opt) => opt.value === value);
        return found?.label || value;
      })
      .filter(Boolean);
    return labels.length > 0 ? labels.join(", ") : undefined;
  };

  const onSubmit = () => {
    // 폼 검증 후 확인 다이얼로그 표시
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    const formData = formValues;
    const userId = tokenStorage.getUserId();

    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const brandIdParam = searchParams.get("brandId");
    const campaignIdParam = searchParams.get("campaignId");

    const brandId = brandIdParam
      ? Number(brandIdParam)
      : proposalData?.brandId ?? 0;

    if (brandId == null) {
      toast.error("브랜드 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    const campaignId = type === "existing"
      ? (campaignIdParam ? Number(campaignIdParam) : (proposalData?.campaignId || null))
      : null;

    // campaignId가 0이면 null로 변환 (광고 캠페인은 실제 캠페인이 아니므로)
    const finalCampaignId = campaignId === 0 ? null : campaignId;

    // 중복 제거 헬퍼 함수
    const uniqueTagIds = (tags?: string[]) => {
      if (!tags) return [];
      const uniqueIds = Array.from(new Set(tags.map(t => Number(t)))).filter(id => Number.isFinite(id));
      return uniqueIds.map(id => ({ id }));
    };

    const requestData = {
      brandId,
      creatorId: Number(userId),
      campaignId: finalCampaignId,
      campaignName: formData.campaignName || "",
      description: formData.description || "",
      formats: uniqueTagIds(formData.format),
      categories: uniqueTagIds(formData.category),
      tones: uniqueTagIds(formData.tone),
      involvements: uniqueTagIds(formData.involvement),
      usageRanges: uniqueTagIds(formData.usageScope),
      rewardAmount: Number(formData.fee) || 0,
      productId: Number(formData.sponsorProduct?.[0]) || 0,
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
    };

    setIsConfirmDialogOpen(false);
    setIsSuccessModalOpen(true);

    createCampaignProposal(requestData).catch((error) => {
      console.error("캠페인 제안 실패:", error);
      toast.error("캠페인 제안에 실패했습니다. 다시 시도해주세요.");
    });
  };

  // 선택된 캠페인 이름 가져오기
  const selectedCampaignName = formValues.campaignName;

  const title =
    type === "existing" && selectedCampaignName
      ? selectedCampaignName
      : type === "existing"
        ? "기존 캠페인 제안하기"
        : "신규 캠페인 제안하기";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* 스크롤 영역 */}
      <form
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-5"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors);
          toast.error("모두 입력해주세요");
        })}
      >
        {/* 제목 */}
        <h2 className="text-[16px] font-semibold text-text-black mt-4 mb-1">{title}</h2>

        {/* 제안 프로필 */}
        <div className="mb-6">
          <label className="text-title3 text-text-gray1 mb-1 block ml-2">
            제안 프로필<span className="text-error text-base">*</span>
          </label>
          <ProfileSelector username={userSnsAccount ? `@${userSnsAccount}` : (me?.roleText ?? me?.name ?? undefined)} onClick={() => navigate("/mypage/profileCard")} />
        </div>


        <div className="flex flex-col items-start w-[calc(100%+40px)] -mx-5 px-5 py-4 bg-bluegray-1 gap-6">

          <div className="w-full h-auto">
            <label className="text-title3 text-text-black mb-2 block ml-2">
              캠페인명<span className="text-error text-base">*</span>
            </label>
            <TextInput
              placeholder="캠페인 제안 내용을 자세히 입력해주세요"
              maxLength={30}
              value={formValues.campaignName ?? ""}
              onChange={(v) => setValue("campaignName", v)}
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

            {/* 설명 */}
            <p className="text-callout1 text-text-gray2 mb-2 w-full ml-2">설명</p>
            <TextArea
              placeholder="캠페인 제안 내용을 자세히 입력해주세요"
              maxLength={300}
              value={formValues.description ?? ""}
              onChange={(v) => setValue("description", v)}
            />
            {errors.description && (
              <p className="text-callout1 text-error mt-1 ml-1">
                {errors.description.message}
              </p>
            )}

            {/* 형식 */}
            <p className="text-callout1 text-text-gray2 mt-4 mb-2 ml-2">형식</p>
            <SelectField
              placeholder="형식 선택"
              value={findLabels(formatOptions, formValues.format)}
              onClick={() => setIsFormatSheetOpen(true)}
              noTruncate={true}
            />

            {/* 종류 / 톤 */}
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              <div>
                <p className="text-callout1 text-text-gray2 mb-2 ml-2">종류</p>
                <SelectField
                  placeholder="종류 선택"
                  value={findLabels(categoryOptions, formValues.category)}
                  onClick={() => setIsCategorySheetOpen(true)}
                />
              </div>
              <div>
                <p className="text-callout1 text-text-gray2 mb-2 ml-2">톤</p>
                <SelectField
                  placeholder="톤 선택"
                  value={findLabels(toneOptions, formValues.tone)}
                  onClick={() => setIsToneSheetOpen(true)}
                />
              </div>
            </div>

            {/* 관여도 / 활용 범위 */}
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              <div>
                <p className="text-callout1 text-text-gray2 mb-2 ml-2">관여도</p>
                <SelectField
                  placeholder="관여도 선택"
                  value={findLabels(involvementOptions, formValues.involvement)}
                  onClick={() => setIsInvolvementSheetOpen(true)}
                />
              </div>
              <div>
                <p className="text-callout1 text-text-gray2 mb-2 ml-2">활용 범위</p>
                <SelectField
                  placeholder="활용 범위 선택"
                  value={findLabels(usageScopeOptions, formValues.usageScope)}
                  onClick={() => setIsUsageScopeSheetOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* 협찬품 / 원고료 */}
          <div className="grid grid-cols-2 gap-3 w-full h-auto">
            <div className="h-auto">
              <label className="text-title3 text-text-black mb-2 block ml-2">
                협찬품<span className="text-error text-base">*</span>
              </label>
              <SelectField
                placeholder="협찬품 선택"
                value={findLabels(sponsorProductOptions, formValues.sponsorProduct)}
                onClick={() => setIsSponsorProductSheetOpen(true)}
              />
            </div>
            <div className="h-auto">
              <label className="text-title3 text-text-black mb-2 block ml-2">
                원고료<span className="text-error text-base">*</span>
              </label>
              <FeeInput
                value={formValues.fee ?? ""}
                onChange={(v) => setValue("fee", v)}
                maxAmount={10000000}
              />
              {errors.fee && (
                <p className="text-callout1 text-error mt-1 ml-1">
                  {errors.fee.message}
                </p>
              )}
            </div>
          </div>

          {/* 제작 기간 */}
          <div className="w-full h-auto">
            <label className="text-title3 text-text-black mb-2 block ml-2">
              제작 기간<span className="text-error text-base">*</span>
            </label>
            <div className="flex items-center gap-2 w-full">
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

        {/* 하단 버튼 */}
        <div className="p-5">
          <Button variant="primary" size="lg" fullWidth withLogo onClick={handleSubmit(onSubmit, () => toast.error("모두 입력해주세요"))} className="shadow-none">
            캠페인 제안하기
          </Button>
        </div>
      </form>

      {/* 바텀시트 */}
      {/* 형식 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isFormatSheetOpen}
        onClose={() => setIsFormatSheetOpen(false)}
        title="형식"
        options={formatOptions}
        selectedValues={formValues.format || []}
        onSubmit={(values) => setValue("format", values)}
        multiSelect={true}
      />

      {/* 종류 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        title="종류"
        options={categoryOptions}
        selectedValues={formValues.category || []}
        onSubmit={(values) => setValue("category", values)}
        multiSelect={true}
      />

      {/* 톤 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isToneSheetOpen}
        onClose={() => setIsToneSheetOpen(false)}
        title="톤"
        options={toneOptions}
        selectedValues={formValues.tone || []}
        onSubmit={(values) => setValue("tone", values)}
        multiSelect={true}
      />

      {/* 관여도 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isInvolvementSheetOpen}
        onClose={() => setIsInvolvementSheetOpen(false)}
        title="관여도"
        options={involvementOptions}
        selectedValues={formValues.involvement || []}
        onSubmit={(values) => setValue("involvement", values)}
        multiSelect={true}
      />

      {/* 활용 범위 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isUsageScopeSheetOpen}
        onClose={() => setIsUsageScopeSheetOpen(false)}
        title="활용 범위"
        options={usageScopeOptions}
        selectedValues={formValues.usageScope || []}
        onSubmit={(values) => setValue("usageScope", values)}
        multiSelect={true}
      />

      {/* 협찬품 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isSponsorProductSheetOpen}
        onClose={() => setIsSponsorProductSheetOpen(false)}
        title="협찬품 선택"
        options={sponsorProductOptions}
        selectedValues={formValues.sponsorProduct || []}
        onSubmit={(values) => setValue("sponsorProduct", values)}
        multiSelect={true}
        hasCustomInput={true}
      />

      {/* 시작 날짜 선택 바텀시트 */}
      <DatePickerBottomSheet
        isOpen={isStartDateSheetOpen}
        onClose={() => setIsStartDateSheetOpen(false)}
        initialValue={formValues.startDate}
        onSelect={(date) => setValue("startDate", date)}
      />

      {/* 끝 날짜 선택 바텀시트 */}
      <DatePickerBottomSheet
        isOpen={isEndDateSheetOpen}
        onClose={() => setIsEndDateSheetOpen(false)}
        initialValue={formValues.endDate}
        onSelect={(date) => setValue("endDate", date)}
      />

      {/* 제안 확인 모달 */}
      <ProposalModal
        isOpen={isConfirmDialogOpen}
        type="confirm"
        variant="suggest"
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* 완료 모달 */}
      <ProposalModal
        isOpen={isSuccessModalOpen}
        type="success"
        variant="suggest"
        onClose={() => navigate("/business/calendar")}
      />
    </div>
  );
}
