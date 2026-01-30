import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import Button from "../../../components/common/Button";
import { InputField } from "../../components/InputField";

interface NameSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  nicknameValue: string | undefined;
  nicknameError: string | null;
  nicknameSuccess: string | null;
  onNicknameCheck: () => void;
}

export function NameSection<T extends FieldValues>({
  register,
  errors,
  nicknameValue,
  nicknameError,
  nicknameSuccess,
  onNicknameCheck,
}: NameSectionProps<T>) {
  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">이름</h3>
      <InputField
        placeholder="성함을 입력해주세요"
        {...register("name" as Path<T>, { required: "성함을 입력해주세요" })}
        error={(errors.name as { message?: string } | undefined)?.message}
      />
      <div>
        <div className="flex gap-1.5 items-start">
          <div className="flex-1">
            <InputField
              placeholder="닉네임을 입력해주세요"
              {...register("nickname" as Path<T>, { required: "닉네임을 입력해주세요" })}
              error={(errors.nickname as { message?: string } | undefined)?.message}
            />
          </div>
          <Button
            type="button"
            variant="action"
            size="action"
            active={!!nicknameValue}
            onClick={onNicknameCheck}
          >
            중복확인
          </Button>
        </div>
        {nicknameError && (
          <p className="mt-1 pl-3 text-error">* {nicknameError}</p>
        )}
        {nicknameSuccess && !nicknameError && (
          <p className="mt-1 pl-3 text-success">* {nicknameSuccess}</p>
        )}
      </div>
    </div>
  );
}
