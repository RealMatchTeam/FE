export type BadgePillSize = "sm";

export default function BadgePill({
  text,
  title,
  size = "sm",
}: {
  text: string;
  title?: string;
  size?: BadgePillSize;
}) {
  if (size === "sm") {
    return (
      <span
        className="
          inline-flex h-4 max-w-[38px] items-center justify-center truncate
          rounded-[5px]
          px-1
          text-title5 font-semibold leading-[14px]
          text-core-1
          bg-core-2
          align-middle
        "
        title={title ?? text}
      >
        {text}
      </span>
    );
  }

  return null;
}
