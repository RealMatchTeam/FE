import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";

const PRIVACY = [
  {
    title: "제 1 조 (목적)",
    body:
      "본 개인정보처리방침은 리얼매치(이하 \"회사\")가 운영하는 인터넷 사이트 및 모바일 " +
      "애플리케이션에서 제공하는 매칭 서비스(이하 \"서비스\")와 관련하여, 회사가 개인정보를 " +
      "어떻게 수집·이용·보관·파기하는지에 관한 사항을 안내함을 목적으로 합니다.",
  },
  {
    title: "제 2 조 (수집 항목)",
    body:
      "회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.\n" +
      "1. 이름, 닉네임, 성별, 나이\n" +
      "2. 주소, 연락처, 이메일\n" +
      "3. 소셜 로그인 계정 정보(카카오톡, 네이버)\n" +
      "4. 서비스 이용 내역, 접속 로그, 쿠키\n" +
      "5. 광고성 정보 수신 채널(APP PUSH, 이메일)",
  },
  {
    title: "제 3 조 (보유 및 이용 기간)",
    body:
      "회사는 회원 탈퇴 시 지체 없이 개인정보를 파기합니다. 단, 관계 법령에 따라 일정 기간 보관이 " +
      "필요한 경우 해당 기간 동안 보관할 수 있습니다.\n" +
      "회원은 언제든지 동의를 철회할 수 있으며, 동의 철회 시 일부 서비스 이용이 제한될 수 있습니다.",
  },
];

export default function MyPagePrivacy() {
  useHideHeader(true);
  const navigate = useNavigate();

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="개인정보 처리방침" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="bg-white px-4 py-6 space-y-6">
            <div className="text-[16px] font-semibold text-[#171718]">
              개인정보 처리방침
            </div>

            {PRIVACY.map((section) => (
              <div key={section.title} className="space-y-2">
                <div className="text-[14px] font-semibold text-[#171718]">
                  {section.title}
                </div>
                <div className="text-[13px] text-[#5B5D6B] whitespace-pre-line leading-[20px]">
                  {section.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
