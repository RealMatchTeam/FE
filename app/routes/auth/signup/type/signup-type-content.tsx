import { useNavigate, useSearchParams } from "react-router";
import Button from "../../../../components/common/Button";

function SignUpTypeContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider");

  const handleSocialSignUp = () => {
    if (provider) {
      navigate(`/auth/signup/terms?provider=${provider}`);
    }
  };

  return (
    <div className="flex flex-col flex-1 px-5 pt-[10px] pb-10">
      <div className="flex flex-col gap-10 mt-10">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            회원가입 방식을<br />확인해주세요
          </h1>
          <p className="text-gray-500">
            {provider ? `${provider} 계정으로 가입을 진행합니다.` : "간편하게 회원가입을 진행해보세요."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSocialSignUp}
            className="justify-center"
          >
            {provider ? "가입 계속하기" : "소셜 계정으로 가입하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignUpTypeContent;
