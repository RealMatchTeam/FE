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
    <div className="flex flex-col items-start w-full py-[10px] px-4 gap-[10px] rounded-[6px] border border-core-2 bg-white/80">
      <textarea
        ref={textareaRef}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        className="flex-1 w-full bg-transparent text-title3 text-text-black placeholder:text-callout4 placeholder:text-text-gray4 focus:outline-none resize-none overflow-auto leading-[20px]"
      />
      <span className="text-callout4 text-text-gray4 self-end">
        {value.length}/{maxLength}
      </span>
    </div>
  );
}
