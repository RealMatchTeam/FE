import { useNavigate, useSearch } from "@tanstack/react-router";
import CreatorIcon from "./components/CreatorIcon";
import BuildingIcon from "./components/BuildingIcon";

function SignUpTypeContent() {
  const navigate = useNavigate();
  const { type } = useSearch({ from: "/auth/signup/type" });

  const handleCreatorClick = () => {
    navigate({ to: "/auth/signup/terms", search: { type } });
  };

  const handleBrandClick = () => {
    alert("준비중입니다!");
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-40 pb-10 bg-grad-auth">
      <h2 className="text-title text-text-black text-center mb-32">
        가입 유형을 선택해주세요
      </h2>
      <div className="flex flex-col justify-center items-center space-y-6 w-full">
        <button
          onClick={handleCreatorClick}
          className="w-[343px] h-[90px] bg-core-70 rounded-[15px] border border-[#B7B7F3] flex items-center justify-center py-5 transition-all active:scale-[0.98] hover:brightness-95 cursor-pointer"
        >
          <div className="flex items-center gap-[10px]">
            <CreatorIcon width={48} height={48} className="text-core-1" strokeWidth={1} />
            <span className="text-title text-core-1">크리에이터</span>
          </div>
        </button>
        <button
          onClick={handleBrandClick}
          className="w-[343px] h-[90px] bg-core-70 rounded-[15px] border border-[#B7B7F3] flex items-center justify-center py-5 transition-all active:scale-[0.98] hover:brightness-95 cursor-pointer"
        >
          <div className="flex items-center gap-[10px]">
            <BuildingIcon width={48} height={48} className="text-core-1" strokeWidth={1} />
            <span className="text-title text-core-1">브랜드</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SignUpTypeContent;
