import NavigationHeader from "../../../components/common/NavigateHeader";
import ConfirmModal from "../components/mypage/ConfirmModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useHideHeader } from "../../../hooks/useHideHeader";
import ProfileSection from "../components/profileCard/ProfileSection";
import SnsSection from "../components/profileCard/SnsSection";
import MatchingSection from "../components/profileCard/MatchingSection";
import TraitsSection from "../components/profileCard/TraitsSection";
import CampaignsSection from "../components/profileCard/CampaignsSection";
import { axiosInstance } from "../../../api/axios";

export default function ProfileCard() {

  useHideHeader(true);

  const [openReMatchModal, setOpenReMatchModal] = useState(false);
  const navigate = useNavigate();
  const [profileCard, setProfileCard] = useState<ProfileCardResult | null>(
    null,
  );
  const [feature, setFeature] = useState<FeatureResult | null>(null);

  const onOpenReMatch = () => {
    setOpenReMatchModal(true);
  };

  const onCloseReMatch = () => {
    setOpenReMatchModal(false);
  };

  const onConfirmReMatch = () => {
    setOpenReMatchModal(false);
    navigate("/matching/test/step1")
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [profileRes, featureRes] = await Promise.all([
          axiosInstance.get<ProfileCardResponse>("/api/v1/users/me/profile-card"),
          axiosInstance.get<FeatureResponse>("/api/v1/users/me/feature"),
        ]);

        if (!isMounted) return;

        setProfileCard(profileRes.data?.isSuccess ? profileRes.data.result : null);
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

  return (
    <div className="h-screen-full">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        {/* header */}
        <div className="h-[60px]">
          <NavigationHeader
            title={"내 프로필 카드"}
            onBack={() => history.back()}
          />
        </div>

        <div className="overflow-y-auto" style={{ height: `calc(100vh - 60px - 67px)` }}>
          
          <ProfileSection
            profileImageUrl={profileCard?.profileImageUrl}
            nickname={profileCard?.nickname}
            gender={profileCard?.gender}
            age={profileCard?.age ?? null}
            contentCategories={profileCard?.contentCategories ?? null}
          />
          <div className="w-full max-w-[430px] h-[10px] bg-[#F3F3FA]"></div>

          <div className="px-4">
            
            <SnsSection snsAccount={profileCard?.snsAccount ?? null} />
            <div className="w-full max-w-[430px] h-[1px] bg-[#F3F3FA]"></div>
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
                <span className="text-[#6666E5]">기존 매칭 정보는 모두 삭제</span>
                <span className="text-[#8B8D99]">되며</span>
                <br />
                <span className="text-[#8B8D99]">새로운 검사 결과가 저장됩니다.</span>
                </>
              }
              primaryText="검사하기"
              onClose={onCloseReMatch}
              onPrimary={onConfirmReMatch}
              showCloseIcon
              closeOnDim
              icon={
                <div className="w-[64px] h-[64px] rounded-full bg-[#6666E5] grid place-items-center">
                  <div className="text-white text-[28px] font-semibold leading-none">!</div>
                </div>
              }
              titleClassName="text-[18px] leading-[26px] whitespace-pre-line"
              descClassName="text-[13px] leading-[18px] text-[#8B8D99] whitespace-pre-line"
              heightClassName="h-[329px]"
              />
          ) : null}    

          <div className="shrink-0 h-[66px]"/>
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
