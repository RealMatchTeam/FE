const PRIMARY = "#5B5DEB";
const BADGE_BG = "#EEF0FF";

export type BadgePillSize = "sm"; // 지금은 sm만 필요

export default function BadgePill({
  text,
  title,
  size = "sm",
}: {
  text: string;
  title?: string;
  size?: BadgePillSize;
}) {
  // 캡쳐 기준: 작고 얇은 pill
  if (size === "sm") {
    return (
      <span
        className="inline-flex h-4 max-w-[38px] items-center justify-center truncate rounded-full px-1 text-[9px] font-semibold leading-none"
        style={{ backgroundColor: BADGE_BG, color: PRIMARY }}
        title={title ?? text}
      >
        {text}
      </span>
    );
  }

  return null;
}
