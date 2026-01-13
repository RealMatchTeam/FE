import type { CheckboxProps } from "../types";

function Checkbox({ checked, onChange, label, required, hasArrow }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-6 h-6 accent-core-1"
      />
      {label && (
        <span className="text-title2 text-text-black flex items-center flex-1 justify-between">
          {label}
          {required && <span className="text-core-1 ml-1">(필수)</span>}
          {hasArrow && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="#9B9BA1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      )}
    </label>
  );
}

export default Checkbox;
