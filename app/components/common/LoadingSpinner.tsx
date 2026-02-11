import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type LoadingSpinnerProps = {
  className?: string;
  size?: number;
};

export default function LoadingSpinner({
  className = "",
  size = 300,
}: LoadingSpinnerProps) {
  return (
    <div
      className={["flex items-center justify-center", className]
        .join(" ")
        .trim()}
      role="status"
      aria-label="loading"
    >
      <DotLottieReact
        src="https://lottie.host/5974a1ca-5d4d-4c32-b0b7-61838491c7a0/j2Yvvr4FoN.lottie"
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </div>
  );
}
