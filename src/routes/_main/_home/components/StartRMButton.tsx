import { Link } from "@tanstack/react-router";
import WhiteLogo from "../../../../assets/whitelogo.svg"

export default function StartMatchingTestButton() {
  return (
    <Link
      to="/matchingTest/step1"
      className={[
        " flex h-[44px] w-full items-center justify-center gap-[6px] rounded-2xl bg-[#6666E5] text-[14px] font-semibold text-white active:scale-[0.99]"
      ].join(" ")}
    >
      <img
        src={WhiteLogo}
        alt="흰 로고 "
        className="h-auto w-[26px] select-none"
        draggable={false}
      />

      <span>매칭률 검사하기</span>
    </Link>
  );
}
