interface DateFieldProps {
  placeholder: string;
  value?: string;
  onClick: () => void;
}

export default function DateField({
  placeholder,
  value,
  onClick,
}: DateFieldProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center flex-1 py-[10px] px-4 gap-[10px] rounded-md border border-core-2 bg-white/80"
    >
      <span
        className={`text-title3 ${value ? "text-text-black" : "text-text-gray3"}`}
      >
        {value || placeholder}
      </span>
    </button>
  );
}
