import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createCampaignProposal, getCampaignDetail } from "../../api/matching";
import { tokenStorage } from "../../../../lib/token";
import { useCampaignProposalStore } from "../../../../stores/campaign-proposal";
import { useAuthStore } from "../../../../stores/auth-store";
import Button from "../../../../components/common/Button";

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
  PROPOSAL_TAG_ID_BY_NAME,
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
  const snsAccount = useCampaignProposalStore((state) => state.snsAccount);
  const me = useAuthStore((state) => state.me);

  // 바텀시트 상태

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

  useEffect(() => {
    // 신규 제안 시 폼 초기화
    if (type !== "existing") {
      reset(defaultCampaignFormValues);
      return;
    }

    let alive = true;

    // proposalData가 있으면 우선 사용
    if (proposalData) {
      if (proposalData.campaignTitle) setValue("campaignName", proposalData.campaignTitle);
      if (proposalData.campaignDescription) setValue("description", proposalData.campaignDescription);

      // 태그 매핑 (ID를 문자열로 변환하여 사용)
      if (proposalData.contentTags?.formats && proposalData.contentTags.formats.length > 0) {
        setValue("format", String(proposalData.contentTags.formats[0].id));
      }
      if (proposalData.contentTags?.categories && proposalData.contentTags.categories.length > 0) {
        setValue("category", String(proposalData.contentTags.categories[0].id));
      }
      if (proposalData.contentTags?.tones && proposalData.contentTags.tones.length > 0) {
        setValue("tone", String(proposalData.contentTags.tones[0].id));
      }
      if (proposalData.contentTags?.involvements && proposalData.contentTags.involvements.length > 0) {
        setValue("involvement", String(proposalData.contentTags.involvements[0].id));
      }
      if (proposalData.contentTags?.usageRanges && proposalData.contentTags.usageRanges.length > 0) {
        setValue("usageScope", String(proposalData.contentTags.usageRanges[0].id));
      }

      const reward = proposalData.rewardAmount?.toString();
      if (reward) setValue("fee", reward);

      if (proposalData.product) setValue("sponsorProduct", proposalData.product);
      if (proposalData.startDate) setValue("startDate", proposalData.startDate);
      if (proposalData.endDate) setValue("endDate", proposalData.endDate);
      return;
    }

    // URL 파라미터로 캠페인 조회 (기존 캠페인 제안 시)
    const campaignIdParam = searchParams.get("campaignId");

    if (campaignIdParam) {
      const campaignId = Number(campaignIdParam);

      if (Number.isFinite(campaignId) && campaignId > 0) {
        (async () => {
          try {
            const detail = await getCampaignDetail(campaignId);
            if (!alive) return;

            setValue("campaignName", detail.title);
            setValue("description", detail.description);
            setValue("fee", detail.rewardAmount.toString());
            setValue("sponsorProduct", detail.product);
            if (detail.startDate) setValue("startDate", detail.startDate);
            if (detail.endDate) setValue("endDate", detail.endDate);

            if (detail.contentTags?.formats?.length > 0) {
              setValue("format", String(detail.contentTags.formats[0].id));
            }
            if (detail.contentTags?.categories?.length > 0) {
              setValue("category", String(detail.contentTags.categories[0].id));
            }
            if (detail.contentTags?.tones?.length > 0) {
              setValue("tone", String(detail.contentTags.tones[0].id));
            }
            if (detail.contentTags?.involvements?.length > 0) {
              setValue("involvement", String(detail.contentTags.involvements[0].id));
            }
            if (detail.contentTags?.usageRanges?.length > 0) {
              setValue("usageScope", String(detail.contentTags.usageRanges[0].id));
            }
          } catch (error) {
            console.error("캠페인 상세 조회 실패:", error);
            toast.error("캠페인 정보를 불러오지 못했습니다");
          }
        })();
      }
    }

    return () => {
      alive = false;
    };
  }, [type, proposalData, searchParams, setValue, reset]);

  const formValues = useWatch({ control, defaultValue: defaultCampaignFormValues });

  const tags = type === "new" ? undefined : proposalData?.contentTags;

  const toOptions = (defaultTags: ProposalTag[], campaignTags?: { id?: number; name: string }[]) => {
    if (campaignTags && campaignTags.length > 0) {
      return campaignTags.map((t) => ({
        value: String(t.id ?? PROPOSAL_TAG_ID_BY_NAME[t.name] ?? t.name),
        label: t.name,
      }));
    }
    return defaultTags.map((t) => ({ value: String(t.id), label: t.name }));
  };

  const formatOptions = toOptions(FORMAT_TAGS, tags?.formats);
  const categoryOptions = toOptions(CATEGORY_TAGS, tags?.categories);
  const toneOptions = toOptions(TONE_TAGS, tags?.tones);
  const involvementOptions = toOptions(INVOLVEMENT_TAGS, tags?.involvements);
  const usageScopeOptions = toOptions(USAGE_RANGE_TAGS, tags?.usageRanges);

  const sponsorProductOptions = proposalData?.product
    ? [{ value: proposalData.product, label: proposalData.product }]
    : type === "new"
      ? []
      : (proposalData?.products ?? [])
        .filter((p) => String(p.id).trim() && String(p.name).trim())
        .map((p) => ({ value: String(p.id), label: String(p.name).trim() }));

  // ID로 label 찾기 헬퍼 함수
  const findLabel = (options: { value: string; label: string }[], value?: string) => {
    if (!value) return undefined;
    const found = options.find((opt) => opt.value === value);
    return found?.label || value;
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
      : proposalData?.brandId || 1;

    const campaignId = type === "existing"
      ? (campaignIdParam ? Number(campaignIdParam) : (proposalData?.campaignId || null))
      : null;

    const requestData = {
      brandId,
      creatorId: Number(userId),
      campaignId,
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
          <ProfileSelector username={snsAccount ? `@${snsAccount}` : (me?.roleText ?? me?.name ?? undefined)} onClick={() => navigate("/mypage/profileCard")} />
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
              value={findLabel(formatOptions, formValues.format)}
              onClick={() => setIsFormatSheetOpen(true)}
            />

            {/* 종류 / 톤 */}
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
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

            {/* 관여도 / 활용 범위 */}
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
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
          <div className="grid grid-cols-2 gap-3 w-full h-auto">
            <div className="h-auto">
              <label className="text-title3 text-text-black mb-2 block ml-2">
                협찬품<span className="text-error text-base">*</span>
              </label>
              <SelectField
                placeholder="협찬품 선택"
                value={findLabel(sponsorProductOptions, formValues.sponsorProduct)}
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
        selectedValues={formValues.format ? [formValues.format] : []}
        onSubmit={(values) => setValue("format", values[0] || "")}
        multiSelect={false}
      />

      {/* 종류 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        title="종류"
        options={categoryOptions}
        selectedValues={formValues.category ? [formValues.category] : []}
        onSubmit={(values) => setValue("category", values[0] || "")}
        multiSelect={false}
      />

      {/* 톤 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isToneSheetOpen}
        onClose={() => setIsToneSheetOpen(false)}
        title="톤"
        options={toneOptions}
        selectedValues={formValues.tone ? [formValues.tone] : []}
        onSubmit={(values) => setValue("tone", values[0] || "")}
        multiSelect={false}
      />

      {/* 관여도 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isInvolvementSheetOpen}
        onClose={() => setIsInvolvementSheetOpen(false)}
        title="관여도"
        options={involvementOptions}
        selectedValues={formValues.involvement ? [formValues.involvement] : []}
        onSubmit={(values) => setValue("involvement", values[0] || "")}
        multiSelect={false}
      />

      {/* 활용 범위 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isUsageScopeSheetOpen}
        onClose={() => setIsUsageScopeSheetOpen(false)}
        title="활용 범위"
        options={usageScopeOptions}
        selectedValues={formValues.usageScope ? [formValues.usageScope] : []}
        onSubmit={(values) => setValue("usageScope", values[0] || "")}
        multiSelect={false}
      />

      {/* 협찬품 선택 바텀시트 */}
      <SelectBottomSheet
        isOpen={isSponsorProductSheetOpen}
        onClose={() => setIsSponsorProductSheetOpen(false)}
        title="협찬품 선택"
        options={sponsorProductOptions}
        selectedValues={formValues.sponsorProduct ? [formValues.sponsorProduct] : []}
        onSubmit={(values) => setValue("sponsorProduct", values[0] || "")}
        multiSelect={false}
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
