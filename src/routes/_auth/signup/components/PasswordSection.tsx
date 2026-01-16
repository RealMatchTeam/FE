import { useState } from "react";
import type { FieldErrors, FieldValues, Path, UseFormGetValues, UseFormRegister } from "react-hook-form";
import { InputField } from "../../components/InputField";

interface PasswordSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  getValues: UseFormGetValues<T>;
}

export function PasswordSection<T extends FieldValues>({
  register,
  errors,
  getValues,
}: PasswordSectionProps<T>) {
  const [passwordMatchStatus, setPasswordMatchStatus] = useState<"match" | "mismatch" | null>(null);

  const handlePasswordConfirmBlur = () => {
    const password = getValues("password" as Path<T>);
    const passwordConfirm = getValues("passwordConfirm" as Path<T>);
    
    if (passwordConfirm && passwordConfirm.length > 0) {
      if (password === passwordConfirm) {
        setPasswordMatchStatus("match");
      } else {
        setPasswordMatchStatus("mismatch");
      }
    } else {
      setPasswordMatchStatus(null);
    }
  };

  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">비밀번호</h3>
      <div className="flex flex-col gap-1">
        <p className="text-callout4 text-text-gray3">
          * 영문, 숫자, 특수 문자 중 2종류 이상을 조합하여 20자리로 설정
        </p>
        <InputField
          type="password"
          placeholder="비밀번호를 입력해주세요"
          {...register("password" as Path<T>, {
            required: "비밀번호를 입력해주세요",
            minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다" },
            maxLength: { value: 20, message: "비밀번호는 20자 이하여야 합니다" },
          })}
          error={(errors.password as { message?: string } | undefined)?.message}
        />
        <div>
          <InputField
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            {...register("passwordConfirm" as Path<T>, {
              required: "비밀번호를 다시 입력해주세요",
              validate: (value) =>
                value === getValues("password" as Path<T>) || "비밀번호가 일치하지 않습니다",
            })}
            onBlur={handlePasswordConfirmBlur}
          />
          {passwordMatchStatus === "mismatch" && (
            <p className="mt-1 pl-3 text-error">* 비밀번호가 일치하지 않습니다</p>
          )}
          {passwordMatchStatus === "match" && (
            <p className="mt-1 pl-3 text-success">* 비밀번호가 일치합니다</p>
          )}
        </div>
      </div>
    </div>
  );
}
