type SocialProvider = "kakao" | "naver";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onClick: () => void;
}

const providerConfig = {
  kakao: {
    bgColor: "bg-[#FEE500]",
    label: "카카오로 시작",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 0.8C5.372 0.8 0 4.951 0 10.07C0 13.253 2.078 16.06 5.242 17.729L3.911 22.593C3.793 23.022 4.285 23.365 4.662 23.116L10.498 19.264C10.99 19.312 11.491 19.34 12 19.34C18.627 19.34 24 15.189 24 10.07C24 4.951 18.627 0.8 12 0.8Z"
          fill="black"
          fillOpacity="0.85"
        />
      </svg>
    ),
  },
  naver: {
    bgColor: "bg-[#03C75A]",
    label: "네이버로 시작",
    icon: (
      <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.561 10.703L6.146 0H0V20H6.439V9.295L13.854 20H20V0H13.561V10.703Z" fill="white" />
      </svg>
    ),
  },
};

function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm`}
      >
        {config.icon}
      </button>
      <span className="text-callout2 text-text-gray2 font-medium">{config.label}</span>
    </div>
  );
}

export default SocialLoginButton;
