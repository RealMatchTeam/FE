import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { InputField } from "../../components/InputField";

interface AgeSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function AgeSection<T extends FieldValues>({ register, errors }: AgeSectionProps<T>) {
  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">나이</h3>
      <InputField
        type="number"
        placeholder="나이를 입력해주세요"
        {...register("age" as Path<T>, { required: "나이를 입력해주세요" })}
        error={(errors.age as { message?: string } | undefined)?.message}
      />
    </div>
  );
}
