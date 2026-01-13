interface SignUpChoiceProps {
  onBrand: () => void;
  onCreator: () => void;
}

function SignUpChoice({ onBrand, onCreator }: SignUpChoiceProps) {
  return (
    <div className="fixed inset-0 bg-bluegray-1 z-50 px-4 pt-40 pb-10">
      <h2 className="text-[28px] font-bold text-text-black text-center mb-32">
        가입 유형을 선택해주세요
      </h2>
      <div className="space-y-6 max-w-sm mx-auto">
        <button
          onClick={onCreator}
          className="w-full h-[168px] bg-core-2 rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] hover:bg-core-3"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4L28.4 16.8H41.6L31.6 24L36 36.8L24 28L12 36.8L16.4 24L6.4 16.8H19.6L24 4Z"
              stroke="#6666E5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="24" cy="32" r="8" stroke="#6666E5" strokeWidth="2.5" fill="none" />
            <path
              d="M24 38C24 38 18 42 18 44C18 45.1046 20.6863 46 24 46C27.3137 46 30 45.1046 30 44C30 42 24 38 24 38Z"
              stroke="#6666E5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="text-[32px] font-bold text-core-1">크리에이터</span>
        </button>
        <button
          onClick={onBrand}
          className="w-full h-[168px] bg-core-2 rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] hover:bg-core-3"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="8" y="12" width="32" height="32" rx="2" stroke="#6666E5" strokeWidth="2.5" fill="none" />
            <rect x="12" y="16" width="4" height="4" fill="#6666E5" />
            <rect x="20" y="16" width="4" height="4" fill="#6666E5" />
            <rect x="28" y="16" width="4" height="4" fill="#6666E5" />
            <rect x="12" y="24" width="4" height="4" fill="#6666E5" />
            <rect x="20" y="24" width="4" height="4" fill="#6666E5" />
            <rect x="28" y="24" width="4" height="4" fill="#6666E5" />
            <rect x="12" y="32" width="4" height="4" fill="#6666E5" />
            <rect x="28" y="32" width="4" height="4" fill="#6666E5" />
            <rect x="18" y="36" width="12" height="8" fill="#6666E5" />
          </svg>
          <span className="text-[32px] font-bold text-core-1">브랜드</span>
        </button>
      </div>
    </div>
  );
}

export default SignUpChoice;
