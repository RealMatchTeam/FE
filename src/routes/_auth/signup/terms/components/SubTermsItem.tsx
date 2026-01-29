interface SubTermsItemProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  onDetailClick?: () => void;
}

export function SubTermsItem({ checked, onChange, label, onDetailClick }: SubTermsItemProps) {
  return (
    <div className="flex items-center gap-1 w-full">
      <div
        className="flex items-center gap-1 flex-1 cursor-pointer"
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
        <span className="text-title3 text-text-gray3">
          {label}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDetailClick?.();
        }}
        className="p-1 -mr-1"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path
            d="M6 4L10 8L6 12"
            stroke="#d4d4d9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
