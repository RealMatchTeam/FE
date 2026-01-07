import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-headline1 text-center text-text-black mb-2">
          Real Match
        </h1>
        <p className="text-body1 text-center text-text-gray2 mb-12">
          실시간 매칭 서비스
        </p>

        <div className="flex flex-col gap-3">
          <button className="w-full h-14 bg-core-1 text-white text-title2 rounded-xl hover:opacity-90 transition-opacity">
            카카오로 시작하기
          </button>
          <button className="w-full h-14 bg-white border border-text-gray4 text-text-black text-title2 rounded-xl hover:bg-bluegray-1 transition-colors">
            이메일로 시작하기
          </button>
        </div>

        <p className="text-callout2 text-center text-text-gray3 mt-8">
          계속 진행하면{" "}
          <a href="#" className="underline">
            서비스 이용약관
          </a>
          과{" "}
          <a href="#" className="underline">
            개인정보 처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
