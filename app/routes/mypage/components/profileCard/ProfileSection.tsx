import { useMemo } from "react";
import mypageDefault from "../../../../assets/mypage-default.svg";

type ProfileSectionProps = {
  profileImageUrl?: string | null;
  nickname?: string | null;
  gender?: string | null;
  age?: number | null;
  interestFields?: string[] | null;
};

export default function ProfileSection({
  profileImageUrl,
  nickname,
  gender,
  age,
  interestFields,
}: ProfileSectionProps) {
  const profileImage = profileImageUrl ?? mypageDefault;
  const displayName = nickname || "비비";
  const genderLabel = useMemo(() => {
    if (gender === "MALE") return "남성";
    if (gender === "FEMALE") return "여성";
    if (!gender) return "성별";
    return gender;
  }, [gender]);
  const ageLabel =
    age != null && Number.isFinite(age)
      ? `${age}세`
      : "나이";
  const interestLabel = interestFields?.length
    ? interestFields.join(", ")
    : "";

  return (
    <div className="px-4 py-6">
      {/* profile summary */}
      <div className="flex items-center gap-4 mt-[10px]">
        <div className="relative">
          <div className="relative w-[50px] h-[50px] rounded-[20px] border border-[#E6E6F3] bg-gray-200 overflow-hidden">
            {/* 프로필 이미지 */}
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
            )}
          </div>

          <button
            type="button"
            className="absolute -right-[2px] -bottom-[2px] w-[18px] h-[18px] rounded-full bg-white grid place-items-center shadow active:scale-95 transition"
            aria-label="프로필 수정"
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.9375 7.91973V6.74536L5.4875 2.19536L6.6625 3.36973L2.1125 7.91973H0.9375ZM7.325 2.70661L7.82812 2.20348C7.85723 2.17445 7.88032 2.13997 7.89607 2.102C7.91182 2.06404 7.91993 2.02334 7.91993 1.98223C7.91993 1.94113 7.91182 1.90043 7.89607 1.86246C7.88032 1.8245 7.85723 1.79001 7.82812 1.76098L7.09625 1.02911C7.06722 1.00001 7.03274 0.976917 6.99477 0.961163C6.95681 0.945409 6.9161 0.937299 6.875 0.937299C6.8339 0.937299 6.79319 0.945409 6.75523 0.961163C6.71726 0.976917 6.68278 1.00001 6.65375 1.02911L6.15062 1.53223L7.325 2.70661ZM0 7.91973V6.35723L5.99125 0.365983C6.22566 0.131644 6.54354 0 6.875 0C7.20646 0 7.52434 0.131644 7.75875 0.365983L8.49125 1.09848C8.72559 1.33289 8.85723 1.65078 8.85723 1.98223C8.85723 2.31369 8.72559 2.63157 8.49125 2.86598L2.5 8.85723H0V7.91973Z"
                fill="#9B9BA1"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 gap-[6px]">
          <div className="text-[16px] font-Semibold leading-[20px]">
            {displayName}
          </div>
          <div className="text-[12px] text-black/50 leading-[16px] mt-[2px]">
            {genderLabel} {ageLabel}
          </div>
          {interestLabel ? (
            <div className="text-[12px] text-[#6D6AFE] leading-[16px] mt-[2px]">
              관심분야: {interestLabel}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
