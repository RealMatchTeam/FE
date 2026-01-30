import { CheckCircleIcon } from "../components/icons/CheckCircleIcon";
import Button from "../../../components/common/Button";

function SignUpSuccessContent() {

  return (
    <div className="flex flex-col h-screen bg-grad-auth">
      {/* 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        {/* 체크 아이콘 */}
        <CheckCircleIcon />

        {/* 텍스트 */}
        <h2 className="text-callout3 text-text-black mt-6 mb-2">
          회원가입 완료
        </h2>
        <p className="text-title2 text-text-gray3 text-center whitespace-pre-line">
          홈에서 매칭률 검사를{"\n"}완료해 주세요
        </p>
      </div>

      {/* 고정 하단 버튼 */}
      <div className="px-6 pb-6 pt-4">
        <Button variant="primary" size="lg" fullWidth withLogo to="/">
          RealMatch 시작하기
        </Button>
      </div>
    </div>
  );
}

export default SignUpSuccessContent;
