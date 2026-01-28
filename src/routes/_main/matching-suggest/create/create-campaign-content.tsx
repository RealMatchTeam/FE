import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/common/Button";
import FilterBottomSheet from "../../../../components/common/FilterBottomSheet";
import {
  TextInput,
  TextArea,
  SelectField,
  DateField,
  FeeInput,
} from "../../../../components/form";
import { useHideBottomTab } from "../../../../hooks/useHideBottomTab";
import { CheckIcon } from "../../../_auth/components/CheckIcon";
import ExistSuggestIcon from "../../../../assets/icon/exist-suggest.svg";
import MiniLogo from "../../../../assets/logo/mini-logo.svg";
import { existingCampaigns } from "../../../../data/existing-campaigns";
import ProfileSelector from "../components/ProfileSelector";
import SelectBottomSheet from "./components/SelectBottomSheet";
import {
  formatOptions,
  categoryOptions,
  toneOptions,
  involvementOptions,
  usageScopeOptions,
  sponsorProductOptions,
} from "./campaignOptions";
import {
  campaignFormSchema,
  defaultCampaignFormValues,
  type CampaignFormData,
} from "./schema";

export default function CreateCampaignContent() {
  const navigate = useNavigate();
  const { type } = useSearch({ from: "/_main/matching-suggest/create" });

  // 바텀시트 상태 (기존 캠페인일 때만 열림)
  const [isSheetOpen, setIsSheetOpen] = useState(type === "existing");
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([1]);

  // 각 필드별 바텀시트 상태
  const [isFormatSheetOpen, setIsFormatSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isToneSheetOpen, setIsToneSheetOpen] = useState(false);
  const [isInvolvementSheetOpen, setIsInvolvementSheetOpen] = useState(false);
  const [isUsageScopeSheetOpen, setIsUsageScopeSheetOpen] = useState(false);
  const [isSponsorProductSheetOpen, setIsSponsorProductSheetOpen] = useState(false);

  // 바텀탭 숨기기 (바텀시트 열렸을 때)
  const anySheetOpen = isSheetOpen || isFormatSheetOpen || isCategorySheetOpen || 
    isToneSheetOpen || isInvolvementSheetOpen || isUsageScopeSheetOpen || isSponsorProductSheetOpen;
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
  });

  const formValues = useWatch({ control, defaultValue: defaultCampaignFormValues });

  const handleToggleCampaign = (id: number) => {
    setSelectedCampaignIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSheetSubmit = () => {
    console.log("선택된 캠페인:", selectedCampaignIds);
    setIsSheetOpen(false);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    navigate({ to: "/matching-suggest" });
  };

  const onSubmit = (data: CampaignFormData) => {
    console.log("캠페인 제안하기", { type, selectedCampaignIds, data });
  };

  // 선택된 캠페인 이름 가져오기
  const selectedCampaignName = existingCampaigns.find(
    (c) => selectedCampaignIds.includes(c.id)
  )?.name;

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
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 제목 */}
        <h2 className="text-title7 text-text-black mt-4 mb-2">{title}</h2>

        {/* 제안 프로필 */}
        <div className="mb-6">
          <label className="text-title3 text-text-gray1 mb-1 block">
            제안 프로필<span className="text-error">*</span>
          </label>
          <ProfileSelector />
        </div>

        {/* 폼 필드 컨테이너 */}
        <div className="flex flex-col items-start w-[calc(100%+40px)] -mx-5 px-5 py-4 bg-bluegray-1 gap-6">
          {/* 캠페인명 */}
          <div className="w-full h-auto">
            <label className="text-title3 text-text-black mb-2 block">
              캠페인명<span className="text-error">*</span>
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
            <label className="text-title3 text-text-black mb-2 block">
              캠페인 내용<span className="text-error">*</span>
            </label>

            {/* 설명 */}
            <p className="text-callout1 text-text-gray2 mb-2 w-full">설명</p>
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
            <p className="text-callout1 text-text-gray2 mt-4 mb-2">형식</p>
            <SelectField
              placeholder="형식 선택"
              value={formValues.format}
              onClick={() => setIsFormatSheetOpen(true)}
            />

            {/* 종류 / 톤 */}
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              <div>
                <p className="text-callout1 text-text-gray2 mb-2">종류</p>
                <SelectField
                  placeholder="종류 선택"
                  value={formValues.category}
                  onClick={() => setIsCategorySheetOpen(true)}
                />
              </div>
              <div>
                <p className="text-callout1 text-text-gray2 mb-2">톤</p>
                <SelectField
                  placeholder="톤 선택"
                  value={formValues.tone}
                  onClick={() => setIsToneSheetOpen(true)}
                />
              </div>
            </div>

            {/* 관여도 / 활용 범위 */}
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              <div>
                <p className="text-callout1 text-text-gray2 mb-2">관여도</p>
                <SelectField
                  placeholder="관여도 선택"
                  value={formValues.involvement}
                  onClick={() => setIsInvolvementSheetOpen(true)}
                />
              </div>
              <div>
                <p className="text-callout1 text-text-gray2 mb-2">활용 범위</p>
                <SelectField
                  placeholder="활용 범위 선택"
                  value={formValues.usageScope}
                  onClick={() => setIsUsageScopeSheetOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* 협찬품 / 원고료 */}
          <div className="grid grid-cols-2 gap-3 w-full h-auto">
            <div className="h-auto">
              <label className="text-title3 text-text-black mb-2 block">
                협찬품<span className="text-error">*</span>
              </label>
              <SelectField
                placeholder="협찬품 선택"
                value={formValues.sponsorProduct}
                onClick={() => setIsSponsorProductSheetOpen(true)}
              />
            </div>
            <div className="h-auto">
              <label className="text-title3 text-text-black mb-2 block">
                원고료<span className="text-error">*</span>
              </label>
              <FeeInput
                value={formValues.fee ?? ""}
                onChange={(v) => setValue("fee", v)}
              />
            </div>
          </div>

          {/* 제작 기간 */}
          <div className="w-full h-auto">
            <label className="text-title3 text-text-black mb-2 block">
              제작 기간<span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-2 w-full">
              <DateField
                placeholder="시작 날짜"
                value={formValues.startDate}
                onClick={() => {}}
              />
              <span className="text-text-gray3">~</span>
              <DateField
                placeholder="끝 날짜"
                value={formValues.endDate}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </form>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 left-0 right-0 p-5 bg-white">
        <Button
          variant="primary"
          size="action"
          fullWidth
          onClick={handleSubmit(onSubmit)}
        >
          <img src={MiniLogo} alt="" className="w-6 h-4" />
          캠페인 제안하기
        </Button>
      </div>

      {/* 바텀시트 */}
      {/* 기존 캠페인 선택 바텀시트 */}
      {type === "existing" && (
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
            {existingCampaigns.map((campaign) => (
              <label
                key={campaign.id}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div onClick={() => handleToggleCampaign(campaign.id)}>
                  <CheckIcon checked={selectedCampaignIds.includes(campaign.id)} />
                </div>
                <span className="text-title3 text-text-gray1">
                  {campaign.name}
                </span>
              </label>
            ))}
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
      )}

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
      />
    </div>
  );
}
