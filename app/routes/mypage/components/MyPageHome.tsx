import { useState } from "react";
import ConfirmModal from "./mypage/ConfirmModal";
import GateModal from "./mypage/GateModal";
import MenuButton from "./mypage/MenuButton";

type Props = {
  hasMatchingTest: boolean | null;
  user: {
    name: string;
    roleText?: string;
    email: string;
    avatarUrl: string;
  };
  onGoMatchingTest: () => void;
  onOpenProfileCard: () => void;
  onOpenLikes: () => void;
  onOpenEditProfile: () => void;
  onOpenNotifications: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onLogout: () => void;
  onWithdraw: () => void;
};

export default function MyPageHome({
  hasMatchingTest,
  user,
  onGoMatchingTest,
  onOpenProfileCard,
  onOpenLikes,
  onOpenEditProfile,
  onOpenNotifications,
  onOpenTerms,
  onOpenPrivacy,
  onLogout,
  onWithdraw,
}: Props) {
  const [gateDismissed, setGateDismissed] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  const openGate = hasMatchingTest === false && !gateDismissed;
  const isButtonLocked = hasMatchingTest === false;

  return (
    <div className="min-h-screen bg-white">
      {/* profile card */}
      <div className="flex flex-col gap-[14px] px-4 py-5">
        <div className="flex items-center gap-[16px]">
          <div
            className="shrink-0 rounded-[20px] bg-white overflow-hidden"
            style={{ width: 50, height: 50 }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-[12px] text-[#5B5D6B]">
                logo
              </div>
            )}
          </div>

          <div className="min-w-0 flex flex-col gap-[3px]">
            <div className="flex items-center gap-[6px]">
              <div className="text-[16px] leading-[20px] font-semibold text-black">
                {user.name}
              </div>
              {user.roleText ? (
                <div className="text-[12px] leading-[16px] font-medium text-[#9B9BA1]">
                  {user.roleText}
                </div>
              ) : null}
            </div>
            <div className="truncate text-[12px] leading-[16px] text-[#5B5D6B]">
              {user.email}
            </div>
          </div>
        </div>

        {/* top buttons */}
        <div className="flex w-full max-w-[398px] gap-[10px]">
          <button
            type="button"
            disabled={isButtonLocked}
            onClick={() => {
              if (isButtonLocked) return;
              onOpenProfileCard();
            }}    
            className="flex h-11 flex-[2] items-center justify-center gap-[10px] rounded-[12px] text-white text-[14px] bg-[#6666E5] font-medium transition-colors active:bg-[#3F40C2]"
          >
            {/* 아이콘 */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 9C16 10.0609 15.5786 11.0783 14.8284 11.8284C14.0783 12.5786 13.0609 13 12 13C10.9391 13 9.92172 12.5786 9.17157 11.8284C8.42143 11.0783 8 10.0609 8 9C8 7.93913 8.42143 6.92172 9.17157 6.17157C9.92172 5.42143 10.9391 5 12 5C13.0609 5 14.0783 5.42143 14.8284 6.17157C15.5786 6.92172 16 7.93913 16 9ZM14 9C14 9.53043 13.7893 10.0391 13.4142 10.4142C13.0391 10.7893 12.5304 11 12 11C11.4696 11 10.9609 10.7893 10.5858 10.4142C10.2107 10.0391 10 9.53043 10 9C10 8.46957 10.2107 7.96086 10.5858 7.58579C10.9609 7.21071 11.4696 7 12 7C12.5304 7 13.0391 7.21071 13.4142 7.58579C13.7893 7.96086 14 8.46957 14 9Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM3 12C3 14.09 3.713 16.014 4.908 17.542C5.74744 16.4401 6.83015 15.5471 8.07164 14.9327C9.31312 14.3183 10.6798 13.9991 12.065 14C13.4324 13.9984 14.7821 14.3091 16.0111 14.9084C17.2402 15.5077 18.3162 16.3797 19.157 17.458C20.0234 16.3216 20.6068 14.9952 20.8589 13.5886C21.111 12.182 21.0244 10.7355 20.6065 9.36898C20.1886 8.00243 19.4512 6.75505 18.4555 5.73004C17.4598 4.70503 16.2343 3.93186 14.8804 3.47451C13.5265 3.01716 12.0832 2.88877 10.6699 3.09997C9.25652 3.31117 7.91379 3.85589 6.75277 4.68905C5.59175 5.52222 4.64581 6.61987 3.99323 7.8912C3.34065 9.16252 3.00018 10.571 3 12ZM12 21C9.93391 21.0033 7.93014 20.2926 6.328 18.988C6.97281 18.0646 7.83119 17.3107 8.83008 16.7905C9.82896 16.2702 10.9388 15.999 12.065 16C13.1772 15.999 14.2735 16.2635 15.263 16.7713C16.2524 17.2792 17.1064 18.0158 17.754 18.92C16.1395 20.267 14.1026 21.0033 12 21Z"
                fill="white"
              />
            </svg>
            내 프로필 카드
          </button>

          <button
            type="button"
            disabled={isButtonLocked}
            onClick={() => {
              if (isButtonLocked) return;
              onOpenLikes();
            }}    
            className="flex h-11 flex-[1] items-center justify-center gap-[10px] rounded-[12px] bg-[#EBEEFB] text-[#6666E5] text-[14px] font-medium transition-colors active:bg-[#E6E6EB]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.7663 7.05768C18.3753 6.68707 17.9111 6.39308 17.4002 6.19249C16.8893 5.99191 16.3417 5.88867 15.7887 5.88867C15.2357 5.88867 14.6881 5.99191 14.1772 6.19249C13.6663 6.39308 13.2021 6.68707 12.8112 7.05768L11.9998 7.82646L11.1884 7.05768C10.3987 6.30942 9.32768 5.88906 8.21089 5.88906C7.09409 5.88906 6.02303 6.30942 5.23334 7.05768C4.44365 7.80593 4 8.82078 4 9.87897C4 10.9372 4.44365 11.952 5.23334 12.7003L11.9998 19.1116L18.7663 12.7003C19.1574 12.3298 19.4677 11.89 19.6794 11.4059C19.891 10.9218 20 10.403 20 9.87897C20 9.35497 19.891 8.83611 19.6794 8.35202C19.4677 7.86793 19.1574 7.42811 18.7663 7.05768Z"
                stroke="#6666E5"
                strokeWidth="1.5"
              />
            </svg>
            내 찜
          </button>
        </div>
      </div>

      <div className="w-full max-w-[430px] h-[10px] bg-[#F3F3FA]"></div>

      {/* list */}
      <div>
        <div className="mt-[5px]">
          <MenuButton
            title="내 정보"
            label="회원정보 변경"
            onClick={onOpenEditProfile}
            py={11}
          />
        </div>
        <Divider />

        <MenuButton label="알림 설정" onClick={onOpenNotifications} py={16} />
        <Divider />

        <MenuButton
          title="고객센터"
          label="문의하기"
          onClick={() =>
            window.open(
              "https://open.kakao.com/o/sPvvelfi",
              "_blank",
              "noopener,noreferrer",
            )
          }
          py={11}
        />
        <Divider />

        <div className="px-5 pt-[11px] pb-[5px]">
          <div className="pb-[2px] text-[10px] leading-[12px] font-regular text-[#5B5D6B]">
            약관
          </div>

          <button
            type="button"
            onClick={onOpenTerms}
            className="w-full py-2 text-left text-[14px] leading-[20px] font-medium text-black transition-colors active:bg-[#E6E6EB]"
          >
            약관
          </button>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full py-2 text-left text-[14px] leading-[20px] font-medium text-black transition-colors active:bg-[#E6E6EB]"
          >
            개인정보 처리 방침
          </button>
        </div>
        <Divider />

        <MenuButton
          title=""
          label="로그아웃"
          onClick={() => setOpenLogout(true)}
          py={16}
        />
        <Divider />

        <MenuButton
          label="회원탈퇴"
          onClick={() => setOpenWithdraw(true)}
          muted={true}
          py={16}
        />
      </div>

      {/* gate modal */}
      {openGate ? (
        <GateModal
          onClose={() => setGateDismissed(true)}
          onGoTest={onGoMatchingTest}
        />
      ) : null}

      {/* logout modal */}
      {openLogout ? (
        <ConfirmModal
          title="로그아웃 하시겠습니까?"
          primaryText="로그아웃"
          onClose={() => setOpenLogout(false)}
          onPrimary={() => {
            setOpenLogout(false);
            onLogout(); // MyPageContent에서 로그인 페이지 이동 처리
          }}
        />
      ) : null}

      {/* withdraw modal */}
      {openWithdraw ? (
        <ConfirmModal
          title="회원탈퇴 하시겠습니까?"
          desc="회원 탈퇴할 경우, 기존 정보는 모두 삭제됩니다."
          primaryText="회원탈퇴"
          onClose={() => setOpenWithdraw(false)}
          onPrimary={() => {
            setOpenWithdraw(false);
            onWithdraw(); // 탈퇴 페이지 이동 or API 호출로 연결
          }}
        />
      ) : null}
    </div>
  );
}

function Divider() {
  return <div className="mx-5 h-px bg-[#F0F0F4]" />;
}
