import { type KeyboardEvent } from "react";

type Props = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onToggleSheet: () => void;
  isSheetOpen: boolean;
  sheetHeight: number;
};

export default function ChatComposer({
  inputRef,
  value,
  onChange,
  onSend,
  onToggleSheet,
  isSheetOpen,
  sheetHeight,
}: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 중이면 무시
    if (e.nativeEvent.isComposing) return;
    if (e.key !== "Enter") return;
    e.preventDefault();
    onSend();
  };

  const sheetOffset = isSheetOpen ? sheetHeight : 0;

  return (
    <div
      className="fixed w-full bg-[#1A1A1A] left-1/2 -translate-x-1/2 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        bottom: "calc(var(--kb, 0px) + env(safe-area-inset-bottom, 0px))",
        transform: isSheetOpen ? `translateY(-${sheetOffset}px)` : "translateY(0px)",
        willChange: "transform",
      }}
    >
      <div className="mx-auto max-w-md px-5 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSheet}
            className={[
              "w-8 h-8 rounded-full grid place-items-center",
              "bg-[#262626] text-[#F3F3F3]",
              "active:opacity-90",
              isSheetOpen ? "opacity-90" : "",
            ].join(" ")}
            aria-label="open actions"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 17 17" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M8.25 1.25V15.25M1.25 8.25H15.25" 
                stroke="#F3F3F3" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>

          </button>

          <div className="flex-1 h-[33px] rounded-[50px] bg-[#3A3A3A] px-3 py-[6px] flex items-center">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-Regular text-[#F3F3F3]"
            />
          </div>

          <button
            type="button"
            onClick={onSend}
            className="w-8 h-8 rounded-full grid place-items-center bg-[#6666E5]"
            aria-label="send"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2.12402 1.87305C2.45141 1.82288 2.73272 1.91403 2.86816 1.96094C3.04818 2.02333 3.26133 2.12068 3.46191 2.21094L17.3926 8.47949C17.5886 8.56771 17.7988 8.66161 17.9629 8.75391C18.0878 8.82418 18.3383 8.97207 18.5166 9.24609L18.5879 9.37109L18.6523 9.52246C18.7808 9.88174 18.7589 10.2807 18.5879 10.627C18.4121 10.9825 18.1056 11.1648 17.9629 11.2451C17.7988 11.3374 17.5886 11.4313 17.3926 11.5195L3.4668 17.7861C3.26537 17.8768 3.05156 17.9736 2.87109 18.0361C2.71639 18.0897 2.37118 18.2009 1.9834 18.0928C1.55427 17.973 1.20587 17.6582 1.04395 17.2432C0.897968 16.8684 0.974784 16.5138 1.0127 16.3545C1.05692 16.1688 1.13208 15.9466 1.20215 15.7373L2.87012 10.75H8.33301C8.7469 10.7498 9.08279 10.4139 9.08301 10C9.08301 9.58592 8.74704 9.25022 8.33301 9.25H2.85254L1.19531 4.25586C1.12602 4.04709 1.05147 3.82509 1.00781 3.63965C0.970305 3.48019 0.895538 3.12577 1.04199 2.75195L1.11133 2.60059C1.29267 2.26152 1.60642 2.00865 1.98145 1.9043L2.12402 1.87305Z"
                fill="#1A1A1A"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}