import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import Button from "../../../../components/common/Button";
import { InputField } from "../../components/InputField";

interface EmailSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  emailValue: string | undefined;
  verificationCodeError: string | null;
  onEmailVerify: () => void;
  readOnly?: boolean;
}

export function EmailSection<T extends FieldValues>({
  register,
  errors,
  emailValue,
  verificationCodeError,
  onEmailVerify,
  readOnly = false,
}: EmailSectionProps<T>) {
  const isEmailValid = emailValue && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue);

  if (readOnly) {
    return (
      <div className="space-y-1">
        <h3 className="text-title1 text-text-black">이메일</h3>
        <InputField
          type="email"
          placeholder="이메일을 입력해주세요"
          {...register("email" as Path<T>)}
          disabled
          className="bg-white cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">이메일</h3>
      <div className="flex gap-1.5 items-start">
        <div className="flex-1">
          <InputField
            type="email"
            placeholder="이메일을 입력해주세요"
            {...register("email" as Path<T>, {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "올바른 이메일 형식이 아닙니다",
              },
            })}
            error={(errors.email as { message?: string } | undefined)?.message}
          />
        </div>
        <Button
          type="button"
          variant="action"
          size="action"
          active={!!isEmailValid}
          onClick={onEmailVerify}
        >
          인증하기
        </Button>
      </div>
      <InputField
        placeholder="인증코드 입력"
        {...register("verificationCode" as Path<T>)}
        error={verificationCodeError || undefined}
      />
    </div>
  );
}
