import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import LoginLogo from "../../../assets/login-logo.svg";
import Button from "../../../components/common/Button";
import { SocialLoginSection } from "./components/SocialLoginSection";
import { InputField } from "../components/InputField";
import { AuthLinks } from "./components/AuthLinks";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginContent() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    console.log("로그인 데이터:", data);
    // 로그인 API 호출 로직
  };

  const openSignUp = () => {
    navigate({ to: "/signup/type" });
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-6 pt-32 py-6 bg-grad-auth">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center mb-12">
        <img src={LoginLogo} alt="Real Match Logo" className="mb-4" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        {/* 입력 영역 */}
        <div className="space-y-3">
          <InputField
            type="email"
            placeholder="이메일 입력"
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "올바른 이메일 형식이 아닙니다",
              },
            })}
            error={errors.email?.message}
          />
          <InputField
            type="password"
            placeholder="비밀번호 입력"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 6,
                message: "비밀번호는 최소 6자 이상이어야 합니다",
              },
            })}
            error={errors.password?.message}
          />
        </div>

        {/* 로그인 버튼 */}
        <div className="mt-8">
          <Button type="submit" variant="primary" size="lg" fullWidth>
            로그인
          </Button>

          {/* 아이디 찾기, 비밀번호 찾기, 회원가입 */}
          <AuthLinks onSignUpClick={openSignUp} />
        </div>
      </form>

      {/* 구분선 */}
      <div className="w-full max-w-sm flex items-center my-10 px-2">
        <div className="flex-1 h-px bg-text-gray4" />
        <span className="px-4 text-callout2 text-text-gray3">또는</span>
        <div className="flex-1 h-px bg-text-gray4" />
      </div>

      {/* 소셜 로그인 */}
      <SocialLoginSection onKakaoClick={openSignUp} onNaverClick={openSignUp} />
    </div>
  );
}

export default LoginContent;
