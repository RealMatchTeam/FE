import { forwardRef, type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-callout1 text-text-gray2">{label}</label>
        )}
        <input
          ref={ref}
          className={`flex w-full h-[46px] px-4 items-center gap-[10px] rounded-xl border border-core-2 bg-bg-w-80 text-callout1 text-text-gray1 placeholder:text-callout1 placeholder:text-text-gray3 focus:outline-none focus:border-core-1 transition-colors ${error ? "border-error" : ""} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 pl-3 text-error">* {error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
