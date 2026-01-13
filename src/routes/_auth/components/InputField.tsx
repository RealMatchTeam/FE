import type { InputFieldProps } from "../types";

function InputField({
  label,
  error,
  success,
  buttonText,
  onButtonClick,
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-title2 text-text-black font-semibold mb-3 block">
          {label}
        </label>
      )}
      <div className={`flex gap-3 ${buttonText ? "" : ""}`}>
        <input
          className={`flex-1 h-14 px-5 bg-white border border-text-gray4 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors ${className}`}
          {...props}
        />
        {buttonText && (
          <button
            type="button"
            onClick={onButtonClick}
            className="h-14 px-6 bg-core-2 text-core-1 rounded-2xl text-title2 font-semibold whitespace-nowrap hover:bg-core-3"
          >
            {buttonText}
          </button>
        )}
      </div>
      {error && <p className="text-callout2 text-red-500 mt-2">{error}</p>}
      {success && <p className="text-callout2 text-core-1 mt-2">{success}</p>}
    </div>
  );
}

export default InputField;
