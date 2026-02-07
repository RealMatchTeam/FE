import { useNavigate } from "react-router";
import NavigationHeader from "../../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../../hooks/useHideHeader";

const ROWS = [
  {
    title: "수집 및 이용 목적",
    desc: "각종 이벤트, 유저 혜택, 행사 등의 안내 및 이를 기반한 마케팅 활용",
  },
  {
    title: "수집항목",
    desc:
      "이름, 성별, 주소, 나이, 쇼셜로그인 계정(카카오톡, 네이버), 소셜미디어 링크(인스타), " +
      "서비스 이용 내역, 광고성 정보 수신 채널 (APP PUSH, 이메일)",
  },
  {
    title: "보유 및 이용 기간",
    desc:
      "회원탈퇴후 30일까지 또는 해당 서비스 동의 철회 시까지 " +
      "회원은 본 서비스 이용 동의에 대한 거부를 할 수 있으며, " +
      "미동의 시 본 서비스에 대한 혜택을 받으실 수 없습니다.",
  },
];

export default function MarketingDetail() {
  useHideHeader(true);
  const navigate = useNavigate();

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader
            title="마케팅 활용 및 광고성 정보 수신 동의"
            onBack={() => navigate(-1)}
          />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="px-4 py-6">
            <div className="border border-[#E8E8FB] rounded-[12px] overflow-hidden">
              {ROWS.map((row, idx) => (
                <div
                  key={row.title}
                  className={[
                    "grid grid-cols-[120px_1fr]",
                    idx === 0 ? "" : "border-t border-[#E8E8FB]",
                  ].join(" ")}
                >
                  <div className="px-4 py-4 text-[13px] font-semibold text-[#171718] bg-[#F7F8FC]">
                    {row.title}
                  </div>
                  <div className="px-4 py-4 text-[12px] text-[#5B5D6B] leading-[18px]">
                    {row.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
