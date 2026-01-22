
type Props = {
  title: string;
  subtitle: string;
  subTitleClass?: string;
  onBack?: () => void;
};

export default function ChatRoomHeader({ title, subtitle, subTitleClass, onBack }: Props) {
  return (
    <div className="h-[60px] flex items-center px-4 py-[10px] bg-[#F6F6FF]">
      <button
        type="button"
        onClick={onBack}
        className="w-6 h-6 grid place-items-center text-gray2"
        aria-label="back"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14.5 5.5L8.5 12l6 6.5"
            stroke="#5B5D6B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex-1 text-center">
        <div className="text-Title1 text-black text-4">{title}</div>
        {subtitle ? (
          <div className={["text-Semibold text-[12px] text", subTitleClass ?? "text-[#9B9BA1]"].join(" ")}>{subtitle}</div>
        ) : null}
      </div>

      {/* 오른쪽 여백 맞추기 */}
      <div className="w-6" />
    </div>
  );
}