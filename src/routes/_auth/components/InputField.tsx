import { forwardRef, type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="block mb-2 text-callout1 text-text-gray2">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full h-14 px-5 bg-white border border-core-2 rounded-2xl text-callout1 text-text-gray3 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-caption text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
