import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";

const TERMS = [
  {
    title: "제 1 조 (목적)",
    body:
      "본 약관은 리얼매치(이하 \"회사\")가 운영하는 인터넷 사이트 및 모바일 애플리케이션(이하 \"서비스\")과 관련하여, " +
      "회사와 회원 간의 권리, 의무 및 책임사항, 서비스 이용조건 및 절차 등을 규정함을 목적으로 합니다.",
  },
  {
    title: "제 2 조 (용어의 정의)",
    body:
      "본 약관에서 사용하는 용어의 정의는 다음과 같습니다.\n" +
      "1. \"서비스\"란 회사가 회원에게 제공하는 모든 제반 서비스 및 기능을 의미합니다.\n" +
      "2. \"회원\"이란 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.\n" +
      "3. \"소셜 로그인\"이란 카카오톡, 네이버 등 외부 플랫폼 계정을 통해 서비스를 이용하는 방식을 말합니다.\n" +
      "4. \"콘텐츠\"란 회원이 서비스에 게시하거나 등록한 모든 형태의 글, 이미지, 영상 등을 말합니다.\n" +
      "5. \"이용계약\"이란 회원이 회사의 서비스 이용을 신청하고 회사가 이를 승낙함으로써 성립되는 계약을 의미합니다.",
  },
  {
    title: "제 3 조 (약관의 효력 및 변경)",
    body:
      "1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.\n" +
      "2. 회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 변경된 약관은 서비스 내 공지 또는 이메일 등으로 회원에게 고지합니다.\n" +
      "3. 회원은 변경된 약관에 동의하지 않을 경우 탈퇴할 수 있으며, 변경 이후에도 서비스를 계속 이용하는 경우 변경에 동의한 것으로 간주합니다.",
  },
  {
    title: "제 4 조 (서비스의 제공 및 변경)",
    body:
      "1. 회사는 회원에게 다음과 같은 서비스를 제공합니다.\n" +
      "- 브랜드–크리에이터 매칭 플랫폼 기능\n" +
      "- 캠페인 관리 및 참여 기능\n" +
      "- 소셜미디어 연동 기능 등\n" +
      "2. 회사는 서비스의 내용, 운영상 또는 기술상 필요에 따라 변경할 수 있으며, 변경 시 사전 고지합니다.",
  },
  {
    title: "제 5 조 (회원 탈퇴 및 이용 제한)",
    body:
      "1. 회원은 언제든지 서비스 내 설정 기능을 통해 탈퇴를 요청할 수 있습니다.\n" +
      "2. 회사는 회원이 다음 각 호의 사유에 해당하는 경우 사전 통보 없이 이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다.\n" +
      "- 타인의 정보 도용, 부정 사용\n" +
      "- 서비스 운영을 고의로 방해하는 행위\n" +
      "- 공공질서 및 미풍양속에 반하는 행위",
  },
];

export default function MyPageTerms() {
  useHideHeader(true);
  const navigate = useNavigate();

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="서비스 이용 약관" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: `calc(100vh - 60px - 67px)` }}
        >
          <div className="bg-white px-4 py-6 space-y-6">
            <div className="text-[16px] font-semibold text-[#171718]">약관</div>

            {TERMS.map((section) => (
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
