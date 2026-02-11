import { useState } from "react";

type Props = {
  defaultPressed?: boolean;
  onChange?: (v: boolean) => void;
  className?: string;
};

export default function HeartButton({
  defaultPressed = false,
  onChange,
  className = "",
}: Props) {
  const [pressed, setPressed] = useState(defaultPressed);

  const toggle = () => {
    setPressed((prev) => {
      const next = !prev;
      onChange?.(next);
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={pressed ? "좋아요 취소" : "좋아요"}
      className={[
        "inline-flex h-6 w-6 items-center justify-center",
        className,
      ].join(" ")}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.7663 5.05755C16.3753 4.68695 15.9111 4.39295 15.4002 4.19237C14.8893 3.99179 14.3417 3.88855 13.7887 3.88855C13.2357 3.88855 12.6881 3.99179 12.1772 4.19237C11.6663 4.39295 11.2021 4.68695 10.8112 5.05755L9.9998 5.82634L9.18843 5.05755C8.39874 4.3093 7.32768 3.88894 6.21089 3.88894C5.09409 3.88894 4.02303 4.3093 3.23334 5.05755C2.44365 5.80581 2 6.82066 2 7.87884C2 8.93703 2.44365 9.95188 3.23334 10.7001L9.9998 17.1115L16.7663 10.7001C17.1574 10.3297 17.4677 9.88988 17.6794 9.40579C17.891 8.9217 18 8.40284 18 7.87884C18 7.35485 17.891 6.83599 17.6794 6.3519C17.4677 5.86781 17.1574 5.42799 16.7663 5.05755Z"
          stroke={pressed ? "var(--color-core-3)" : "var(--color-text-gray4)"}
          fill={pressed ? "var(--color-core-3)" : "transparent"}
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}
