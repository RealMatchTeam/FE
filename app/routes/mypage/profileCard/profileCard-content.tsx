import NavigationHeader from "../../../components/common/NavigateHeader";
import ConfirmModal from "../components/mypage/ConfirmModal";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useHideHeader } from "../../../hooks/useHideHeader";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import ProfileSection from "../components/profileCard/ProfileSection";
import SnsSection from "../components/profileCard/SnsSection";
import MatchingSection from "../components/profileCard/MatchingSection";
import TraitsSection from "../components/profileCard/TraitsSection";
import CampaignsSection from "../components/profileCard/CampaignsSection";
import { axiosInstance } from "../../../api/axios";
import { tokenStorage } from "../../../lib/token";
import { uploadAttachment } from "../../room/api/attachments";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import closeIcon from "../../../assets/cancel.svg";

const compressImage = (
  file: File,
  maxWidth = 1080,
  quality = 0.8,
): Promise<File> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject("canvas context error");
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) return reject("Blob conversion failed");

          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
  });

const extractInstagramId = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const withoutAt = trimmed.replace(/^@/, "");
  const match = withoutAt.match(/instagram\.com\/([^/?#]+)/i);
  if (match?.[1]) return match[1];

  return withoutAt;
};

const isValidInstagramId = (id: string) => /^[A-Za-z0-9._]{0,30}$/.test(id);

export default function ProfileCard() {
  useHideHeader(true);

  const [openReMatchModal, setOpenReMatchModal] = useState(false);
  const navigate = useNavigate();
  const [profileCard, setProfileCard] = useState<ProfileCardResult | null>(
    null,
  );
  const [feature, setFeature] = useState<FeatureResult | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isSnsSheetOpen, setIsSnsSheetOpen] = useState(false);
  const [snsInput, setSnsInput] = useState("");
  const [isSavingSns, setIsSavingSns] = useState(false);

  useHideBottomTab(isSnsSheetOpen);

  const onOpenReMatch = () => {
    setOpenReMatchModal(true);
  };

  const onCloseReMatch = () => {
    setOpenReMatchModal(false);
  };

  const onConfirmReMatch = () => {
    setOpenReMatchModal(false);
    navigate("/matching/test/step1");
  };

  const handlePickImage = () => {
    if (isUploadingImage) return;
    imageInputRef.current?.click();
  };

  const openSnsSheet = () => {
    setSnsInput(extractInstagramId(profileCard?.snsAccount ?? ""));
    setIsSnsSheetOpen(true);
  };

  const closeSnsSheet = () => {
    if (isSavingSns) return;
    setIsSnsSheetOpen(false);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = tokenStorage.getAccessToken();
    if (!token) return;

    try {
      setIsUploadingImage(true);
      const compressedFile = await compressImage(file);
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
      const uploaded = await uploadAttachment({
        token,
        file: compressedFile,
        attachmentType: "IMAGE",
        usage: "PUBLIC",
        baseUrl,
      });

      const response =
        await axiosInstance.patch<CustomResponseMyProfileCardResponseDto>(
          "/api/v1/users/me/profile-image",
          { profileImageUrl: uploaded.accessUrl },
        );

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "프로필 이미지 변경 실패");
      }

      const profileRes = await axiosInstance.get<ProfileCardResponse>(
        "/api/v1/users/me/profile-card",
      );
      setProfileCard(
        profileRes.data?.isSuccess ? profileRes.data.result : null,
      );
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSaveSns = async () => {
    const snsId = extractInstagramId(snsInput);
    if (!isValidInstagramId(snsId) || isSavingSns) return;

    try {
      setIsSavingSns(true);
      const response =
        await axiosInstance.patch<CustomResponseMyProfileCardResponseDto>(
          "/api/v1/users/me/instagram",
          { snsAccount: snsId },
        );

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "SNS 계정 변경 실패");
      }

      setProfileCard((prev) =>
        prev ? { ...prev, snsAccount: snsId } : { snsAccount: snsId },
      );

      setIsSnsSheetOpen(false);
    } catch (error) {
      console.error("SNS 계정 변경 실패:", error);
    } finally {
      setIsSavingSns(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [profileRes, featureRes] = await Promise.all([
          axiosInstance.get<ProfileCardResponse>(
            "/api/v1/users/me/profile-card",
          ),
          axiosInstance.get<FeatureResponse>("/api/v1/users/me/feature"),
        ]);

        if (!isMounted) return;

        setProfileCard(
          profileRes.data?.isSuccess ? profileRes.data.result : null,
        );
        setFeature(featureRes.data?.isSuccess ? featureRes.data.result : null);
      } catch (error) {
        console.error("프로필 카드 조회 실패:", error);
        if (!isMounted) return;
        setProfileCard(null);
        setFeature(null);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const nickname = profileCard?.nickname ?? null;
  const creatorType = profileCard?.matchingResult?.creatorType ?? null;
  const snsId = extractInstagramId(snsInput);
  const isSnsValid = isValidInstagramId(snsId);
  const showSnsError = snsInput.trim().length > 0 && !isSnsValid;

  return (
    <div className="h-screen-full">
      <div className="w-full bg-white shadow-2xl flex flex-col">
        {/* header */}
        <div className="min-h-[60px]">
          <NavigationHeader
            title={"내 프로필 카드"}
            onBack={() => history.back()}
          />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: `calc(100vh - 60px - 67px)` }}
        >
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleImageChange}
          />
          <ProfileSection
            profileImageUrl={profileCard?.profileImageUrl}
            nickname={profileCard?.nickname}
            gender={profileCard?.gender}
            age={profileCard?.age ?? null}
            contentCategories={profileCard?.contentCategories ?? null}
            onEditImage={handlePickImage}
            isUploadingImage={isUploadingImage}
          />
          <div className="w-full h-[10px] bg-[#F3F3FA]"></div>

          <div className="px-4">
            <SnsSection
              snsAccount={profileCard?.snsAccount ?? null}
              onEdit={openSnsSheet}
            />
            <div className="w-full h-[1px] bg-[#F3F3FA]"></div>
            <MatchingSection
              onOpenReMatch={onOpenReMatch}
              nickname={nickname}
              creatorType={creatorType}
            />
            <TraitsSection feature={feature} />
            <CampaignsSection />
          </div>

          {openReMatchModal ? (
            <ConfirmModal
              title={"매칭 검사를\n다시 진행하시겠습니까?"}
              desc={
                <>
                  <span className="text-[#6666E5]">
                    기존 매칭 정보는 모두 삭제
                  </span>
                  <span className="text-[#8B8D99]">되며</span>
                  <br />
                  <span className="text-[#8B8D99]">
                    새로운 검사 결과가 저장됩니다.
                  </span>
                </>
              }
              primaryText="검사하기"
              onClose={onCloseReMatch}
              onPrimary={onConfirmReMatch}
              showCloseIcon
              closeOnDim
              icon={
                <div className="w-[64px] h-[64px] rounded-full bg-[#6666E5] grid place-items-center">
                  <div className="text-white text-[28px] font-semibold leading-none">
                    !
                  </div>
                </div>
              }
              titleClassName="text-[18px] leading-[26px] whitespace-pre-line"
              descClassName="text-[13px] leading-[18px] text-[#8B8D99] whitespace-pre-line"
              heightClassName="h-[329px]"
            />
          ) : null}

          {isSnsSheetOpen ? (
            <FilterBottomSheet
              isOpen={isSnsSheetOpen}
              onClose={closeSnsSheet}
              className="h-auto"
            >
              <div className="px-5 pt-5 pb-6">
                <div className="flex items-center justify-between">
                  <div className="text-title2 text-text-black">
                    SNS 계정 수정
                  </div>
                  <button
                    type="button"
                    onClick={closeSnsSheet}
                    aria-label="닫기"
                    className="p-1 active:opacity-80"
                  >
                    <img src={closeIcon} alt="" className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <div
                    className={[
                      "flex items-center",
                      "h-[52px]",
                      "rounded-2xl",
                      "border",
                      "bg-white",
                      "px-4",
                      showSnsError ? "border-error" : "border-core-3",
                    ].join(" ")}
                  >
                    <input
                      autoFocus
                      value={snsInput}
                      onChange={(e) => setSnsInput(e.target.value)}
                      placeholder="인스타그램 아이디 또는 URL"
                      className={[
                        "flex-1",
                        "bg-transparent",
                        "text-title3",
                        "text-text-gray1",
                        "outline-none",
                        "placeholder:text-text-gray4",
                      ].join(" ")}
                    />
                  </div>

                  <div className="min-h-[18px] mt-2">
                    {showSnsError ? (
                      <p className="text-callout2 text-error">
                        영문/숫자/._ 만 입력해주세요
                      </p>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!isSnsValid || isSavingSns}
                  onClick={handleSaveSns}
                  className={[
                    "mt-8 w-full h-[52px] rounded-2xl text-title7 transition-opacity",
                    !isSnsValid || isSavingSns
                      ? "bg-bluegray-2 text-text-gray3"
                      : "bg-core-1 text-white active:opacity-90",
                  ].join(" ")}
                >
                  {isSavingSns ? "저장 중" : "변경 완료"}
                </button>
              </div>
            </FilterBottomSheet>
          ) : null}

          <div className="shrink-0 h-[66px]" />
        </div>
      </div>
    </div>
  );
}

type ProfileCardResult = {
  nickname?: string;
  profileImageUrl?: string | null;
  gender?: string;
  age?: number | null;
  snsAccount?: string | null;
  contentCategories?: string[] | null;
  matchingResult?: {
    creatorType?: string | null;
  } | null;
};

type ProfileCardResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ProfileCardResult;
};

type CustomResponseMyProfileCardResponseDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    profileImageUrl?: string;
    snsAccount?: string;
  };
};

type FeatureResult = {
  beautyType?: {
    skinType?: number[] | null;
    skinBrightness?: number[] | null;
    makeupStyle?: number[] | null;
    interestCategories?: number[] | null;
    interestFunctions?: number[] | null;
  } | null;
  fashionType?: {
    height?: number[] | null;
    bodyShape?: number[] | null;
    topSize?: number[] | null;
    bottomSize?: number[] | null;
    interestFields?: number[] | null;
    interestStyles?: number[] | null;
    interestBrands?: number[] | null;
  } | null;
  contentsType?: {
    viewerGender?: number[] | null;
    viewerAge?: number[] | null;
    avgVideoLength?: number[] | null;
    avgViews?: number[] | null;
    contentFormats?: number[] | null;
    contentTones?: number[] | null;
    desiredInvolvement?: number[] | null;
    desiredUsageScope?: number[] | null;
  } | null;
};

type FeatureResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FeatureResult;
};
