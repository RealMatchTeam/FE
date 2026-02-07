import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";

export default function MyPageEdit() {
  useHideHeader(true);
  const navigate = useNavigate();

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="회원정보 설정" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="bg-gradient-to-b from-[#F2F3FF] to-white px-4 py-6 space-y-6">
            {/* 본명 */}
            <div className="space-y-2">
              <div className="text-[16px] font-semibold text-[#171718]">
                본명
              </div>
              <input
                type="text"
                placeholder="아이비"
                className="w-full h-[52px] rounded-[14px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white"
              />
            </div>

            {/* 닉네임 */}
            <div className="space-y-2">
              <div className="text-[16px] font-semibold text-[#171718]">
                닉네임
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="비비"
                  className="w-full h-[52px] rounded-[14px] border border-[#E8E8FB] px-4 pr-[88px] text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6D6AFE] text-[14px] font-semibold"
                >
                  변경하기
                </button>
              </div>
            </div>

            {/* 주소 */}
            <div className="space-y-2">
              <div className="text-[16px] font-semibold text-[#171718]">
                주소
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="주소"
                  className="flex-1 h-[52px] rounded-[14px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white"
                />
                <button
                  type="button"
                  className="h-[52px] px-5 rounded-[16px] bg-[#B7B7F3] text-white text-[14px] font-semibold"
                >
                  주소 찾기
                </button>
              </div>
              <input
                type="text"
                placeholder="상세 주소"
                className="w-full h-[52px] rounded-[14px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white"
              />
              <div className="text-[12px] text-[#9B9BA1]">
                *협찬품 받을 주소를 입력해주세요. 주소는 매칭된
                브랜드에게만 공개됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
