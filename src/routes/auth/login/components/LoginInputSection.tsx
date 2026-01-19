import { InputField } from "../../components/InputField";

interface LoginInputSectionProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function LoginInputSection({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LoginInputSectionProps) {
  return (
    <div className="w-full max-w-sm space-y-3">
      <InputField
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <InputField
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
    </div>
  );
}
