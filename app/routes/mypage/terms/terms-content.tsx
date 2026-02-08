import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";

const TERMS = [
  {
    title: "제 1 조 (목적)",
    body:
      "본 이용약관은 리얼매치(이하 \"회사\")가 운영하는 인터넷 사이트 및 모바일 " +
      "애플리케이션에서 제공하는 매칭 서비스(이하 \"서비스\")와 관련하여, 회사와 이용 고객(또는 \"회원\")간의 " +
      "권리, 의무 및 책임사항, 회사와 회원 간의 서비스 이용조건 및 절차를 규정함을 목적으로 합니다.",
  },
  {
    title: "제 2 조 (용어의 정의)",
    body:
      "본 약관에서 사용하는 용어의 정의는 다음과 같습니다.\n" +
      "1. \"서비스\"란 \"회원\"이 컴퓨터, 휴대용 단말기 등 각종 유·무선 또는 프로그램을 통해 이용할 수 있도록 " +
      "\"회사\"가 제공하는 모든 \"서비스\"를 의미합니다.\n" +
      "2. \"회원\"이란 \"회사\"에 개인정보를 제공하여 회원등록을 한 자로서, 테이블링이 제공하는 \"서비스\"를 이용하는 사용자를 말합니다.\n" +
      "3. \"비회원\"이란 회원가입 없이 \"회사\"가 제공하는 \"서비스\"를 이용하는 자를 말합니다.\n" +
      "4. \"이용자\"란 \"서비스\"를 이용하는 자를 말하며, 회원과 비회원을 모두 포함합니다.\n" +
      "5. \"게시물\"이란 \"회원\"이 \"서비스\"를 이용함에 있어 \"서비스\"상에 게시한 부호·문자·음성·음향 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.\n" +
      "6. 리얼매치가 발행/관리하는...",
  },
];

export default function MyPageTerms() {
  useHideHeader(true);
  const navigate = useNavigate();

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="서비스 이용 약관" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 60px)" }}
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
