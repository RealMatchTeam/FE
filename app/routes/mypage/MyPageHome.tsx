type MyPageHomeProps = {
  hasMatchingTest: boolean;
  user: {
    name: string;
    roleText: string;
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

export default function MyPageHome(props: MyPageHomeProps) {
  return (
    <div className="min-h-screen bg-white px-5 py-6">
      <h1 className="text-title7 text-text-black mb-4">마이페이지</h1>

      <div className="flex items-center gap-4 p-4 bg-bluegray-1 rounded-lg mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
        <div>
          <p className="text-title3 text-text-black">{props.user.name}</p>
          <p className="text-callout1 text-text-gray2">{props.user.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        {!props.hasMatchingTest && (
          <button
            onClick={props.onGoMatchingTest}
            className="w-full p-4 text-left border-b border-bluegray-2"
          >
            매칭 테스트 하기
          </button>
        )}
        {props.hasMatchingTest && (
          <button
            onClick={props.onOpenProfileCard}
            className="w-full p-4 text-left border-b border-bluegray-2"
          >
            프로필 카드 보기
          </button>
        )}
        <button
          onClick={props.onOpenLikes}
          className="w-full p-4 text-left border-b border-bluegray-2"
        >
          내 찜 목록
        </button>
        <button
          onClick={props.onOpenEditProfile}
          className="w-full p-4 text-left border-b border-bluegray-2"
        >
          회원정보 수정
        </button>
        <button
          onClick={props.onOpenNotifications}
          className="w-full p-4 text-left border-b border-bluegray-2"
        >
          알림 설정
        </button>
        <button
          onClick={props.onOpenInquiry}
          className="w-full p-4 text-left border-b border-bluegray-2"
        >
          문의하기
        </button>
        <button
          onClick={props.onOpenTerms}
          className="w-full p-4 text-left border-b border-bluegray-2"
        >
          이용약관
        </button>
        <button
          onClick={props.onOpenPrivacy}
          className="w-full p-4 text-left border-b border-bluegray-2"
        >
          개인정보처리방침
        </button>
        <button
          onClick={props.onLogout}
          className="w-full p-4 text-left border-b border-bluegray-2 text-error"
        >
          로그아웃
        </button>
        <button
          onClick={props.onWithdraw}
          className="w-full p-4 text-left text-text-gray3"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}
