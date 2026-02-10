import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";

const PRIVACY = [
  {
    title: "제 1 조 (목적)",
    body:
      "본 개인정보 처리방침은 리얼매치(이하 \"회사\")가 운영하는 인터넷 사이트 및 모바일 애플리케이션(이하 \"서비스\")와 관련하여, " +
      "정보주체의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리하기 위한 방침을 설명합니다.",
  },
  {
    title: "제 2 조 (수집하는 개인정보 항목)",
    body:
      "회사는 다음과 같은 항목의 개인정보를 수집할 수 있습니다.\n" +
      "- 이름, 나이, 성별\n" +
      "- 배송지 주소\n" +
      "- 소셜 로그인 계정 (카카오, 네이버 등)\n" +
      "- 소셜미디어 링크 (인스타그램 등)\n" +
      "- 서비스 이용 내역 (캠페인 참여 내역, 제안 수락/거절 이력 등)\n" +
      "- 광고성 정보 수신 채널 설정 정보 (앱 푸시, 이메일 수신 여부 등)",
  },
  {
    title: "제 3 조 (개인정보의 수집 및 이용 목적)",
    body:
      "회사는 수집한 개인정보를 다음 목적을 위해 활용합니다.\n" +
      "- 회원 가입 및 본인 인증\n" +
      "- 브랜드-크리에이터 매칭을 위한 정보 제공\n" +
      "- 캠페인 운영 및 정산 관련 업무\n" +
      "- 맞춤형 콘텐츠 및 광고 제공\n" +
      "- 고객 상담 및 문의 응대\n" +
      "- 마케팅 및 서비스 개선을 위한 통계 분석",
  },
  {
    title: "제 4 조 (개인정보의 보유 및 이용기간)",
    body:
      "1. 회원의 개인정보는 원칙적으로 회원 탈퇴 시 지체 없이 파기됩니다.\n" +
      "2. 단, 아래의 정보는 관계 법령에 따라 일정 기간 보관됩니다.\n" +
      "- 계약 또는 청약철회 등에 관한 기록: 5년\n" +
      "- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년\n" +
      "- 표시/광고에 관한 기록: 6개월",
  },
  {
    title: "제 5 조 (개인정보의 제3자 제공)",
    body:
      "회사는 회원의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.\n" +
      "- 법령에 의거하거나 수사기관의 요청이 있는 경우\n" +
      "- 회원이 별도로 제3자 제공에 동의한 경우",
  },
  {
    title: "제 6 조 (개인정보의 파기 절차 및 방법)",
    body:
      "1. 개인정보는 수집 및 이용 목적이 달성된 후 내부 방침 및 관련 법령에 따라 즉시 파기됩니다.\n" +
      "2. 전자적 파일 형태는 복구 불가능한 방법으로, 종이 문서는 분쇄 또는 소각 등의 방법으로 파기합니다.",
  },
  {
    title: "제 7 조 (이용자의 권리와 행사 방법)",
    body:
      "회원은 언제든지 자신의 개인정보를 열람하거나 정정, 삭제, 처리정지를 요청할 수 있으며, " +
      "‘마이페이지’ 내 설정에서 직접 수정 또는 삭제 가능합니다.",
  },
];

export default function MyPagePrivacy() {
  useHideHeader(true);
  const navigate = useNavigate();

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="개인정보 처리방침" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: `calc(100vh - 60px - 67px)` }}
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
