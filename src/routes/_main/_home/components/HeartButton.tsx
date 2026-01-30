// src/routes/_home/components/HeartButton.tsx
import { useState } from "react";
import heartOn from "../../../../assets/heart_on.svg";
import heartOff from "../../../../assets/heart_off.svg";

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

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // ✅ 핵심: 카드 클릭으로 전파 방지
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
      {/* 하트 아이콘 크기 고정 */}
      <img src={pressed ? heartOn : heartOff} alt="" className="h-5 w-5" />
    </button>
  );
}
