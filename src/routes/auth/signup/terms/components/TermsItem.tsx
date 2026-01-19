import { CheckIcon } from "../../../components/CheckIcon";

interface TermsItemProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  required?: boolean;
  hasArrow?: boolean;
  textColor?: string;
}

export function TermsItem({
  checked,
  onChange,
  label,
  required = false,
  hasArrow = false,
  textColor = "text-text-black"
}: TermsItemProps) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer w-full"
      onClick={onChange}
    >
      <div className="flex-shrink-0">
        <CheckIcon checked={checked} />
      </div>
      <div className="flex items-start gap-1 flex-1">
        <span className={`text-body1 ${textColor}`}>
          {label}{" "}
          {required && <span className="text-callout4 text-core-1">(필수)</span>}
          {!required && <span className="text-callout4 text-text-gray3">(선택)</span>}
        </span>
        {hasArrow && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#d4d4d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}
