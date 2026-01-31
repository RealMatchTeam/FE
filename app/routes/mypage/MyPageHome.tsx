import { useState } from "react";
import ConfirmModal from "./components/ConfirmModal";

type Props = {
  hasMatchingTest: boolean;
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
  onOpenInquiry: () => void;
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
  onOpenInquiry,
  onOpenTerms,
  onOpenPrivacy,
  onLogout,
  onWithdraw,
}: Props) {
  // hasMatchingTest가 false면 gate 모달을 바로 열기 위해 초기값으로 설정
  const [openGate, setOpenGate] = useState(!hasMatchingTest);
  const [openLogout, setOpenLogout] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  //const actionsDisabled = useMemo(() => !hasMatchingTest, [hasMatchingTest]); 매칭검사 안했을 시

  return (
    <div className="min-h-screen bg-white">
      {/* profile card */}
      <div className="flex flex-col gap-[14px] px-4 py-5">
        <div className="flex items-start gap-[16px]">
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

          <div className="min-w-0 flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px]">
              <div className="text-[16px] leading-[20px] font-SemiBold text-black">
                {user.name}
              </div>
              {user.roleText ? (
                <div className="text-[12px] leading-[16px] text-Medium text-[#9B9BA1]">{user.roleText}</div>
              ) : null}
            </div>
            <div className="truncate text-[12px] leading-[16px] text-[#5B5D6B]">{user.email}</div>
          </div>
        </div>

        {/* top buttons */}
        <div className="flex max-w-[398px] gap-[10px]">
          <button
            type="button"
            onClick={onOpenProfileCard}
            className="flex h-11 flex-[2] items-center justify-center gap-[10px] rounded-[12px] text-white text-[14px] bg-[#6666E5] style-Medium transition-colors active:bg-[#3F40C2]">
            {/* 아이콘 */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M16 9C16 10.0609 15.5786 11.0783 14.8284 11.8284C14.0783 12.5786 13.0609 13 12 13C10.9391 13 9.92172 12.5786 9.17157 11.8284C8.42143 11.0783 8 10.0609 8 9C8 7.93913 8.42143 6.92172 9.17157 6.17157C9.92172 5.42143 10.9391 5 12 5C13.0609 5 14.0783 5.42143 14.8284 6.17157C15.5786 6.92172 16 7.93913 16 9ZM14 9C14 9.53043 13.7893 10.0391 13.4142 10.4142C13.0391 10.7893 12.5304 11 12 11C11.4696 11 10.9609 10.7893 10.5858 10.4142C10.2107 10.0391 10 9.53043 10 9C10 8.46957 10.2107 7.96086 10.5858 7.58579C10.9609 7.21071 11.4696 7 12 7C12.5304 7 13.0391 7.21071 13.4142 7.58579C13.7893 7.96086 14 8.46957 14 9Z" fill="white" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM3 12C3 14.09 3.713 16.014 4.908 17.542C5.74744 16.4401 6.83015 15.5471 8.07164 14.9327C9.31312 14.3183 10.6798 13.9991 12.065 14C13.4324 13.9984 14.7821 14.3091 16.0111 14.9084C17.2402 15.5077 18.3162 16.3797 19.157 17.458C20.0234 16.3216 20.6068 14.9952 20.8589 13.5886C21.111 12.182 21.0244 10.7355 20.6065 9.36898C20.1886 8.00243 19.4512 6.75505 18.4555 5.73004C17.4598 4.70503 16.2343 3.93186 14.8804 3.47451C13.5265 3.01716 12.0832 2.88877 10.6699 3.09997C9.25652 3.31117 7.91379 3.85589 6.75277 4.68905C5.59175 5.52222 4.64581 6.61987 3.99323 7.8912C3.34065 9.16252 3.00018 10.571 3 12ZM12 21C9.93391 21.0033 7.93014 20.2926 6.328 18.988C6.97281 18.0646 7.83119 17.3107 8.83008 16.7905C9.82896 16.2702 10.9388 15.999 12.065 16C13.1772 15.999 14.2735 16.2635 15.263 16.7713C16.2524 17.2792 17.1064 18.0158 17.754 18.92C16.1395 20.267 14.1026 21.0033 12 21Z" fill="white" />
            </svg>

            내 프로필 카드
          </button>

          <button
            type="button"
            onClick={onOpenLikes}
            className="flex h-11 flex-[1] items-center justify-center gap-[10px] rounded-[12px] bg-[#EBEEFB] text-[#6666E5] text-[14px] style-Medium transition-colors active:bg-[#E6E6EB]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.7663 7.05768C18.3753 6.68707 17.9111 6.39308 17.4002 6.19249C16.8893 5.99191 16.3417 5.88867 15.7887 5.88867C15.2357 5.88867 14.6881 5.99191 14.1772 6.19249C13.6663 6.39308 13.2021 6.68707 12.8112 7.05768L11.9998 7.82646L11.1884 7.05768C10.3987 6.30942 9.32768 5.88906 8.21089 5.88906C7.09409 5.88906 6.02303 6.30942 5.23334 7.05768C4.44365 7.80593 4 8.82078 4 9.87897C4 10.9372 4.44365 11.952 5.23334 12.7003L11.9998 19.1116L18.7663 12.7003C19.1574 12.3298 19.4677 11.89 19.6794 11.4059C19.891 10.9218 20 10.403 20 9.87897C20 9.35497 19.891 8.83611 19.6794 8.35202C19.4677 7.86793 19.1574 7.42811 18.7663 7.05768Z" stroke="#6666E5" stroke-width="1.5" />
            </svg>

            내 찜
          </button>
        </div>
      </div>

      {/* list */}
      <div >
        <MenuButton title="내 정보" label="회원정보 변경" onClick={onOpenEditProfile} py={11} gap={6} />
        <Divider />

        <MenuButton label="알림 설정" onClick={onOpenNotifications} py={16} gap={6} />
        <Divider />

        <MenuButton title="고객센터" label="문의하기" onClick={onOpenInquiry} py={11} gap={6} />
        <Divider />

        <div className="px-5 pt-[11px] pb-[5px]">
          <div className="pb-[2px] text-[10px] leading-[12px] text-[#5B5D6B]">약관</div>

          <button
            type="button"
            onClick={onOpenTerms}
            className="w-full py-2 text-left text-[14px] leading-[20px] text-black transition-colors active:bg-[#E6E6EB]"
          >
            약관
          </button>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full py-2 text-left text-[14px] leading-[20px] text-black transition-colors active:bg-[#E6E6EB]"
          >
            개인정보 처리 방침
          </button>
        </div>
        <Divider />

        <MenuButton title="" label="로그아웃" onClick={() => setOpenLogout(true)} py={16} gap={6} />
        <Divider />

        <MenuButton label="회원탈퇴" onClick={() => setOpenWithdraw(true)} muted={true} py={16} gap={6} />
      </div>

      {/* gate modal */}
      {openGate ? (
        <GateModal
          onClose={() => setOpenGate(false)}
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
            onLogout();
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
            onWithdraw();
          }}
        />
      ) : null}

    </div>
  );
}

function MenuButton({
  title, label, onClick, muted, py, gap = 6,
}: { title?: string; label: string; onClick: () => void; muted?: boolean; py?: number; gap?: number; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left rounded-none",
        "transition-colors active:bg-[#E6E6EB]",
        muted ? "text-[#B7B7BF]" : "text-[#111]",
      ].join(" ")}
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: py,
        paddingBottom: py,
      }}
    >
      <div className="flex flex-col" style={{ gap }}>
        {title && (
          <div
            className={[
              "text-[10px] leading-[12px] style-Regular text-[#5B5D6B]",
              muted ? "opacity-70" : "",
            ].join(" ")}
          >
            {title}
          </div>
        )}

        <div className="text-[14px] leading-[20px] style-Medium">
          {label}
        </div>
      </div>
    </button>
  );
}

function Divider() {
  return <div className="mx-5 h-px bg-[#F0F0F4]" />;
}

function GateModal({
  onClose,
  onGoTest,
}: {
  onClose: () => void;
  onGoTest: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      {/* dim */}
      <div className="absolute inset-0 bg-black/45" />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-[#9B9BA1]"
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="flex flex-col items-center pt-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5B5CEB]">
            <span className="text-[28px] font-bold text-white">!</span>
          </div>

          <div className="mt-5 text-center text-[18px] font-semibold text-[#111] leading-6">
            매칭 검사를
            <br />
            먼저 진행해주세요
          </div>

          <button
            type="button"
            onClick={onGoTest}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B5CEB] text-[15px] font-semibold text-white"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <rect width="26" height="16" fill="url(#pattern0_2021_21638)" />
                <defs>
                  <pattern id="pattern0_2021_21638" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_2021_21638" transform="matrix(0.008 0 0 0.013 0 -0.007)" />
                  </pattern>
                  <image id="image0_2021_21638" width="125" height="78" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                </defs>
              </svg>

            </span>
            매칭 검사하기
          </button>
        </div>
      </div>
    </div>
  );
}