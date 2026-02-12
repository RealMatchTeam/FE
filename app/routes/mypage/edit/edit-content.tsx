import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import { axiosInstance } from "../../../api/axios";
import SuccessModal from "../../../components/common/SuccessModal";

type DaumPostcodeData = {
  address?: string;
  roadAddress?: string;
  jibunAddress?: string;
  zonecode?: string;
};

type DaumPostcodeConstructor = new (options: {
  oncomplete: (data: DaumPostcodeData) => void;
}) => { open: () => void };

declare global {
  interface Window {
    daum?: {
      Postcode: DaumPostcodeConstructor;
    };
  }
}

type MyEditInfoResponseDto = {
  name?: string;
  nickname?: string;
  address?: string;
  detailAddress?: string;
};

type CustomResponseMyEditInfoResponseDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyEditInfoResponseDto;
};

type CustomResponseNicknameAvailableResponseDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    available: boolean;
  };
};

type CustomResponseVoid = {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: unknown;
};

export default function MyPageEdit() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [originalAddress, setOriginalAddress] = useState("");
  const [originalDetailAddress, setOriginalDetailAddress] = useState("");
  const [isAddressApiReady, setIsAddressApiReady] = useState(false);
  const addressDetailRef = useRef<HTMLInputElement | null>(null);

  const [isNickSheetOpen, setIsNickSheetOpen] = useState(false);
  const [nickDraft, setNickDraft] = useState("");
  const [checkStatus, setCheckStatus] = useState<
    "idle" | "invalid" | "valid" | "format" | "error"
  >("idle");
  const [isNickChecking, setIsNickChecking] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [isNickSaving, setIsNickSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isSuccessOpen = Boolean(successMessage);
  useHideBottomTab(isNickSheetOpen || isSuccessOpen);

  useEffect(() => {
    const fetchMyEditInfo = async () => {
      try {
        const response =
          await axiosInstance.get<CustomResponseMyEditInfoResponseDto>(
            "/api/v1/users/me/edit",
          );

        if (!response.data.isSuccess) {
          throw new Error(response.data.message || "회원정보 조회 실패");
        }

        const data = response.data.result;
        const nextName = data.name ?? "";
        const nextNickname = data.nickname ?? "";
        const nextAddress = data.address ?? "";
        const nextDetailAddress = data.detailAddress ?? "";

        setName(nextName);
        setNickname(nextNickname);
        setAddress(nextAddress);
        setAddressDetail(nextDetailAddress);
        setOriginalNickname(nextNickname);
        setOriginalAddress(nextAddress);
        setOriginalDetailAddress(nextDetailAddress);
      } catch (error) {
        console.error("Failed to load edit info:", error);
        toast.error("회원정보를 불러오지 못했습니다.");
      }
    };

    fetchMyEditInfo();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.daum?.Postcode) {
      setIsAddressApiReady(true);
      return;
    }

    const scriptId = "daum-postcode-script";
    const existingScript = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    const handleLoad = () => setIsAddressApiReady(true);

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = handleLoad;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  const handleAddressSearch = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: (data) => {
        const nextAddress =
          data.roadAddress || data.jibunAddress || data.address || "";
        setAddress(nextAddress);
        requestAnimationFrame(() => addressDetailRef.current?.focus());
      },
    }).open();
  };

  const nickHelper = useMemo(() => {
    if (checkStatus === "invalid") return "이미 존재하는 닉네임입니다.";
    if (checkStatus === "valid") return "사용 가능한 닉네임입니다.";
    if (checkStatus === "format") {
      return "닉네임은 2자 이상 10자 이하, 한글/영문/숫자만 사용 가능합니다.";
    }
    if (checkStatus === "error") {
      return "닉네임 확인 중 오류가 발생했습니다.";
    }
    return "한글, 영문, 숫자만 사용 가능 (2-10자)";
  }, [checkStatus]);

  const nickHelperClass =
    checkStatus === "invalid" ||
    checkStatus === "format" ||
    checkStatus === "error"
      ? "text-[#FF4D4F]"
      : checkStatus === "valid"
        ? "text-[#4A4DFF]"
        : "text-[#9B9BA1]";

  const isNickValid = (value: string) => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
    return nicknameRegex.test(value);
  };

  const isAddressSearchEnabled = isAddressApiReady;
  const isNickCheckDisabled = isNickChecking || nickDraft.trim().length === 0;

  return (
    <div className="min-h-full w-full flex flex-col ">
      <div className="w-full flex flex-col flex-1">
        <div className="min-h-[60px]">
          <NavigationHeader
            title="회원정보 설정"
            onBack={() => navigate(-1)}
            bgClassName={"F6F6FF"}
          />
        </div>

        <div
          className="flex-1 overflow-y-auto"
          style={{
            paddingBottom:
              "calc(66px + 24px + 48px + env(safe-area-inset-bottom))",
          }}
        >
          <div className="px-4 py-6 space-y-6">
            {/* 본명 */}
            <div className="space-y-2">
              <div className="text-[14px] leading-[20px] font-medium text-[#171718]">
                본명
              </div>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
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
                  placeholder="닉네임을 입력해주세요"
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
                  readOnly
                  className="flex-1 h-[46px] rounded-[12px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white focus:outline-none focus:ring-0 focus:border-[#B7B7F3]"
                />
                <button
                  type="button"
                  disabled={!isAddressSearchEnabled}
                  onClick={handleAddressSearch}
                  className={[
                    "h-[46px] px-5 rounded-[12px] text-white text-[14px] font-semibold transition",
                    isAddressSearchEnabled
                      ? "bg-[#B7B7F3]"
                      : "bg-[#C8C8D4] cursor-not-allowed",
                  ].join(" ")}
                >
                  주소 찾기
                </button>
              </div>
              <input
                type="text"
                placeholder="상세 주소"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                ref={addressDetailRef}
                className="w-full h-[46px] rounded-[12px] border border-[#E8E8FB] px-4 text-[15px] text-[#171718] placeholder:text-[#9B9BA1] bg-white focus:outline-none focus:ring-0 focus:border-[#B7B7F3]"
              />
              <div className="text-[12px] text-[#9B9BA1]">
                *협찬품 받을 주소를 입력해주세요. 주소는 매칭된 브랜드에게만
                공개됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-4"
        style={{ bottom: "calc(66px + 24px + env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          disabled={isAddressSaving}
          className={[
            "w-full h-[48px] rounded-[12px] text-white text-[15px] font-semibold transition",
            isAddressSaving
              ? "bg-[#5A5A99] cursor-not-allowed"
              : "bg-[#6666E5]",
          ].join(" ")}
          onClick={async () => {
            const nextNickname = nickname.trim() || originalNickname;
            const nextAddress = address.trim() || originalAddress;
            const nextDetailAddress =
              addressDetail.trim() || originalDetailAddress;

            if (!nextNickname || !nextAddress || !nextDetailAddress) {
              return;
            }

            try {
              setIsAddressSaving(true);
              const payload = {
                nickname: nextNickname,
                address: nextAddress,
                detailAddress: nextDetailAddress,
              };

              const response = await axiosInstance.patch<CustomResponseVoid>(
                "/api/v1/users/me/edit",
                payload,
              );

              if (!response.data.isSuccess) {
                throw new Error(response.data.message || "회원정보 변경 실패");
              }

              setNickname(nextNickname);
              setOriginalNickname(nextNickname);
              setOriginalAddress(nextAddress);
              setOriginalDetailAddress(nextDetailAddress);
              setSuccessMessage("회원정보 변경 완료");
            } catch (error) {
              console.error("Failed to update address:", error);
              toast.error("주소 변경에 실패했습니다.");
            } finally {
              setIsAddressSaving(false);
            }
          }}
        >
          {isAddressSaving ? "변경 중..." : "변경 완료"}
        </button>
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
              onClick={async () => {
                const trimmed = nickDraft.trim();
                if (!trimmed) {
                  setCheckStatus("format");
                  return;
                }

                if (!isNickValid(trimmed)) {
                  setCheckStatus("format");
                  return;
                }

                if (trimmed === nickname.trim()) {
                  setCheckStatus("valid");
                  return;
                }

                try {
                  setIsNickChecking(true);
                  const response =
                    await axiosInstance.get<CustomResponseNicknameAvailableResponseDto>(
                      "/api/v1/users/nickname/available",
                      { params: { nickname: trimmed } },
                    );

                  if (
                    response.data.isSuccess &&
                    response.data.result.available
                  ) {
                    setCheckStatus("valid");
                  } else {
                    setCheckStatus("invalid");
                  }
                } catch (error: unknown) {
                  const status = (error as { response?: { status?: number } })
                    .response?.status;
                  if (status === 400) {
                    setCheckStatus("format");
                  } else {
                    setCheckStatus("error");
                    toast.error("닉네임 중복 확인 중 오류가 발생했습니다.");
                  }
                } finally {
                  setIsNickChecking(false);
                }
              }}
              disabled={isNickCheckDisabled}
              className={[
                "h-[48px] px-4 rounded-[12px] text-white text-[14px] font-semibold transition",
                isNickCheckDisabled
                  ? "bg-[#C8C8D4] cursor-not-allowed"
                  : "bg-[#B7B7F3]",
              ].join(" ")}
            >
              {isNickChecking ? "확인 중..." : "중복확인"}
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
            className={[
              "w-full h-[48px] rounded-[12px] text-white text-[15px] font-semibold transition",
              checkStatus !== "valid" || isNickSaving
                ? "bg-[#C8C8D4] cursor-not-allowed"
                : "bg-[#6666E5]",
            ].join(" ")}
            disabled={checkStatus !== "valid" || isNickSaving}
            onClick={async () => {
              if (checkStatus !== "valid" || isNickSaving) return;

              const nextNickname = nickDraft.trim();
              const nextAddress = address.trim() || originalAddress;
              const nextDetailAddress =
                addressDetail.trim() || originalDetailAddress;

              try {
                setIsNickSaving(true);
                const payload = {
                  nickname: nextNickname,
                  address: nextAddress,
                  detailAddress: nextDetailAddress,
                };

                const response = await axiosInstance.patch<CustomResponseVoid>(
                  "/api/v1/users/me/edit",
                  payload,
                );

                if (!response.data.isSuccess) {
                  throw new Error(
                    response.data.message || "회원정보 변경 실패",
                  );
                }

                setNickname(nextNickname);
                setOriginalNickname(nextNickname);
                setOriginalAddress(nextAddress);
                setOriginalDetailAddress(nextDetailAddress);
                setIsNickSheetOpen(false);
                setSuccessMessage("닉네임 변경 완료");
              } catch (error) {
                console.error("Failed to update nickname:", error);
              } finally {
                setIsNickSaving(false);
              }
            }}
          >
            {isNickSaving ? "변경 중..." : "변경 완료"}
          </button>
        </div>
      </FilterBottomSheet>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setSuccessMessage(null)}
        title={successMessage ?? ""}
      />
    </div>
  );
}
