export default function MenuButton({
  title,
  label,
  onClick,
  muted,
  py,
  disableActiveBg,
}: {
  title?: string;
  label: string;
  onClick: () => void;
  muted?: boolean;
  py?: number;
  disableActiveBg?: boolean;
}) {
  return (
    <div className="w-full">
      {title && (
        <div
          className={[
            "px-5 pt-[11px] mb-[-5px]",
            "text-[10px] leading-[12px] font-regular text-[#5B5D6B]",
            muted ? "opacity-70" : "",
          ].join(" ")}
        >
          {title}
        </div>
      )}

      {/* label */}
      <div className="px-5">
        <button
          type="button"
          onClick={onClick}
          className={[
            "w-full text-left rounded-none",
            "transition-colors",
            disableActiveBg ? "" : "active:bg-[#E6E6EB]",
            muted ? "text-[#E6E6EB]" : "text-[#111]",
            "text-[14px] leading-[20px] font-medium",
          ].join(" ")}
          style={{
            paddingTop: py,
            paddingBottom: py,
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
