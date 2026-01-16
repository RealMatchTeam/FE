interface SubTermsItemProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function SubTermsItem({ checked, onChange, label }: SubTermsItemProps) {
  return (
    <div
      className="flex items-center gap-1 cursor-pointer w-full"
      onClick={onChange}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M5 10L8 13L15 6"
          stroke={checked ? "#6666E5" : "#D4D4D9"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-start gap-1 flex-1">
        <span className="text-title3 text-text-gray3">
          {label}
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path
            d="M6 4L10 8L6 12"
            stroke="#d4d4d9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
