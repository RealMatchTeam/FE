import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";

export default function MyPageEdit() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const [isNickSheetOpen, setIsNickSheetOpen] = useState(false);
  const [nickDraft, setNickDraft] = useState("");
  const [checkStatus, setCheckStatus] = useState<"idle" | "invalid" | "valid">("idle");

  const nickHelper = useMemo(() => {
    if (checkStatus === "invalid") return "이미 존재하는 닉네임입니다.";
    if (checkStatus === "valid") return "사용 가능한 닉네임입니다.";
    return "영문, 숫자, 특수 문자 중 2종류 이상을 포함하여 8-20자리로 설정";
  }, [checkStatus]);

  const nickHelperClass =
    checkStatus === "invalid"
      ? "text-[#FF4D4F]"
      : checkStatus === "valid"
        ? "text-[#4A4DFF]"
        : "text-[#9B9BA1]";

  const isNickValid = (value: string) => {
    if (value.length < 8 || value.length > 20) return false;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^a-zA-Z0-9]/.test(value);
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    return typeCount >= 2;
  };

  return (
    <div className="h-screen-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <div className="w-full max-w-[430px] shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="회원정보 설정" onBack={() => navigate(-1)} bgClassName={"F6F6FF"}/>
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: `calc(100vh - 60px - 67px)` }}
        >
          <div className="px-4 py-6 space-y-6">
            {/* 본명 */}
            <div className="space-y-2">
              <div className="text-[14px] leading-[20px] font-medium text-[#171718]">
                본명
              </div>
              <input
                type="text"
                placeholder="아이비"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled
                className="w-full h-[46px] rounded-[12px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white"
              />
            </div>

            {/* 닉네임 */}
            <div className="space-y-2">
              <div className="text-[14px] leading-[20px] font-medium text-[#171718]">
                닉네임
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="비비"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  readOnly
                  className="w-full h-[46px] rounded-[12px] border border-[#E8E8FB] px-4 pr-[88px] text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white focus:outline-none focus:ring-0 focus:border-[#B7B7F3]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNickDraft(nickname || "");
                    setCheckStatus("idle");
                    setIsNickSheetOpen(true);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6666E5] text-[14px] font-Pretendard"
                >
                  변경하기
                </button>
              </div>
            </div>

            {/* 주소 */}
            <div className="space-y-2">
              <div className="text-[14px] leading-[20px] font-medium text-[#171718]">
                주소
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="주소"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 h-[46px] rounded-[12px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white focus:outline-none focus:ring-0 focus:border-[#B7B7F3]"
                />
                <button
                  type="button"
                  className="h-[46px] px-5 rounded-[12px] bg-[#B7B7F3] text-white text-[14px] font-semibold"
                >
                  주소 찾기
                </button>
              </div>
              <input
                type="text"
                placeholder="상세 주소"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                className="w-full h-[46px] rounded-[12px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white focus:outline-none focus:ring-0 focus:border-[#B7B7F3]"
              />
              <div className="text-[12px] text-[#9B9BA1]">
                *협찬품 받을 주소를 입력해주세요. 주소는 매칭된
                브랜드에게만 공개됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilterBottomSheet
        isOpen={isNickSheetOpen}
        onClose={() => setIsNickSheetOpen(false)}
        className="h-[55%]"
      >
        <div className="px-5 pt-5 pb-6 flex flex-col h-full">
          <div className="text-[16px] font-semibold text-[#171718] mb-1">
            닉네임 변경
          </div>
          <div className={`text-[12px] ${nickHelperClass} mb-3`}>
            *{nickHelper}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={nickDraft}
              onChange={(e) => {
                setNickDraft(e.target.value);
                setCheckStatus("idle");
              }}
              placeholder="새 닉네임을 입력해주세요"
              className="flex-1 h-[48px] rounded-[12px] border border-[#E8E8FB] px-4 text-[14px] text-[#171718] placeholder:text-[#9B9BA1] bg-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!isNickValid(nickDraft)) {
                  setCheckStatus("invalid");
                  return;
                }
                setCheckStatus("valid");
              }}
              className="h-[48px] px-4 rounded-[12px] bg-[#B7B7F3] text-white text-[14px] font-semibold"
            >
              중복확인
            </button>
          </div>

          {checkStatus !== "idle" ? (
            <div className={`mt-2 text-[12px] ${nickHelperClass}`}>
              *{nickHelper}
            </div>
          ) : null}

          <div className="flex-1" />

          <button
            type="button"
            className="w-full h-[48px] rounded-[12px] bg-[#6666E5] text-white text-[15px] font-semibold"
            onClick={() => {
              if (checkStatus === "valid") {
                setNickname(nickDraft);
                setIsNickSheetOpen(false);
              }
            }}
          >
            변경 완료
          </button>
        </div>
      </FilterBottomSheet>
    </div>
  );
}
