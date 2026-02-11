import { CheckIcon } from "../../../components/CheckIcon";

interface TermsItemProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  required?: boolean;
  hasArrow?: boolean;
  textColor?: string;
  onDetailClick?: () => void;
  noWrap?: boolean;
}

export function TermsItem({
  checked,
  onChange,
  label,
  required = false,
  hasArrow = false,
  textColor = "text-text-black",
  onDetailClick,
  noWrap = false
}: TermsItemProps) {
  return (
    <div className="flex items-start gap-3 w-full overflow-visible">
      <div
        className="flex items-start gap-3 flex-1 cursor-pointer overflow-visible"
        onClick={onChange}
      >
        <div className="flex-shrink-0 mt-0.5">
          <CheckIcon checked={checked} />
        </div>
        <div className={`flex flex-wrap items-center gap-1 flex-1 overflow-visible ${noWrap ? 'whitespace-nowrap' : ''}`}>
          <span className={`text-body1 ${textColor}`}>
            {label}
          </span>
          {required && <span className="text-callout4 text-core-1 flex-shrink-0">(필수)</span>}
          {!required && <span className="text-callout4 text-text-gray3 flex-shrink-0">(선택)</span>}
        </div>
      </div>

      {hasArrow && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick?.();
          }}
          className="p-1 -mr-1 mt-0.5"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#d4d4d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
