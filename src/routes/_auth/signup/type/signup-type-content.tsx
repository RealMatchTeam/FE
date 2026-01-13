import { Icon } from "@iconify/react";
import { useNavigate } from "@tanstack/react-router";

function SignUpTypeContent() {
  const navigate = useNavigate();

  const handleCreatorClick = () => {
    navigate({ to: "/signup/terms" });
  };

  const handleBrandClick = () => {
    alert("준비중입니다!");
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-40 pb-10 bg-grad-auth">
      <h2 className="text-title text-text-black text-center mb-32">
        가입 유형을 선택해주세요
      </h2>
      <div className="flex flex-col items-center space-y-6 w-full">
        <button
          onClick={handleCreatorClick}
          className="w-[343px] h-[90px] bg-core-70 rounded-[15px] border border-[#B7B7F3] flex items-center justify-center gap-[10px] py-5 transition-all active:scale-[0.98] hover:brightness-95 cursor-pointer"
        >
          <Icon icon="solar:stars-linear" width="48" height="48" className="text-core-1" />
          <span className="text-title text-core-1">크리에이터</span>
        </button>
        <button
          onClick={handleBrandClick}
          className="w-[343px] h-[90px] bg-core-70 rounded-[15px] border border-[#B7B7F3] flex items-center justify-center gap-[10px] py-5 transition-all active:scale-[0.98] hover:brightness-95 cursor-pointer"
        >
          <Icon icon="fluent:building-48-regular" width="48" height="48" className="text-core-1" />
          <span className="text-title text-core-1">브랜드</span>
        </button>
      </div>
    </div>
  );
}

export default SignUpTypeContent;
