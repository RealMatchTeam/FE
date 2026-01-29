interface CheckIconProps {
  checked: boolean;
}

export function CheckIcon({ checked }: CheckIconProps) {
  if (checked) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="3" fill="#6666E5" />
        <path d="M4 8L6.5 10.5L12 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#404252" />
    </svg>
  );
}
