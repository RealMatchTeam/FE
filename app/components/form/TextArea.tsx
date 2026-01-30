import { useRef, useEffect } from "react";

interface TextAreaProps {
  placeholder: string;
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
}

export default function TextArea({
  placeholder,
  maxLength,
  value,
  onChange,
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="flex items-center w-full py-[10px] px-4 gap-[10px] rounded-md border border-core-2 bg-white/80">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        className="flex-1 bg-transparent text-title3 text-text-black placeholder:text-text-gray3 focus:outline-none resize-none overflow-hidden leading-[20px]"
      />
      <span className="text-callout1 text-text-gray3 shrink-0">
        {value.length}/{maxLength}
      </span>
    </div>
  );
}
