import { Link } from "@tanstack/react-router";

export default function StartMatchingTestButton() {
  return (
    <Link
      to="/matchingTest/step1"
      className={[
        "flex items-center justify-center gap-[10px]",
        "w-[342px] h-[52px]",
        "rounded-[12px]",
        "bg-core-1 text-white",
        "text-title1",
        "active:opacity-90",
      ].join(" ")}
    >
      <span aria-hidden="true" className="text-[14px] leading-[18px]">
        ∞
      </span>

      <span>매칭률 검사하기</span>
    </Link>
  );
}
