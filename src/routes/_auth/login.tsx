import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-32 pb-10 bg-bluegray-1">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center mb-12">
        <div className="mb-4">
          <svg
            width="80"
            height="44"
            viewBox="0 0 80 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 10C15.3726 10 10 15.3726 10 22C10 28.6274 15.3726 34 22 34C28.6274 34 34 28.6274 34 22C34 19 36 14 46 14C56 14 58 19 58 22C58 28.6274 63.3726 34 70 34C76.6274 34 82 28.6274 82 22C82 15.3726 76.6274 10 70 10C63.3726 10 58 15.3726 58 22C58 25 56 30 46 30C36 30 34 25 34 22C34 15.3726 28.6274 10 22 10Z"
              stroke="#6666E5"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-core-1 tracking-tight">Real Match</h1>
      </div>

      {/* 입력 영역 */}
      <div className="w-full max-w-sm space-y-3">
        <div className="relative">
          <input
            type="email"
            placeholder="이메일 입력"
            className="w-full h-[56px] px-5 bg-white border border-core-2 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full h-[56px] px-5 bg-white border border-core-2 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
          />
        </div>
      </div>

      {/* 로그인 버튼 및 링크 */}
      <div className="w-full max-w-sm mt-8">
        <button className="w-full h-[56px] bg-core-1 text-white text-title font-semibold rounded-2xl transition-all hover:brightness-105 active:scale-[0.98]">
          로그인
        </button>

        <div className="flex justify-center items-center mt-6 space-x-3 text-callout2 text-text-gray3">
          <button className="hover:text-text-gray2">아이디 찾기</button>
          <span className="w-[1px] h-3 bg-text-gray4" />
          <button className="hover:text-text-gray2">비밀번호 찾기</button>
          <span className="w-[1px] h-3 bg-text-gray4" />
          <button className="hover:text-text-gray2">회원가입</button>
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full max-w-sm flex items-center my-10 px-2">
        <div className="flex-1 h-[1px] bg-text-gray4" />
        <span className="px-4 text-callout2 text-text-gray3">또는</span>
        <div className="flex-1 h-[1px] bg-text-gray4" />
      </div>

      {/* 소셜 로그인 */}
      <div className="flex space-x-12">
        <div className="flex flex-col items-center gap-3">
          <button className="w-[64px] h-[64px] bg-[#FEE500] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 0.8C5.372 0.8 0 4.951 0 10.07C0 13.253 2.078 16.06 5.242 17.729L3.911 22.593C3.793 23.022 4.285 23.365 4.662 23.116L10.498 19.264C10.99 19.312 11.491 19.34 12 19.34C18.627 19.34 24 15.189 24 10.07C24 4.951 18.627 0.8 12 0.8Z" fill="black" fillOpacity="0.85"/>
            </svg>
          </button>
          <span className="text-callout2 text-text-gray2 font-medium">카카오로 시작</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button className="w-[64px] h-[64px] bg-[#03C75A] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.561 10.703L6.146 0H0V20H6.439V9.295L13.854 20H20V0H13.561V10.703Z" fill="white"/>
            </svg>
          </button>
          <span className="text-callout2 text-text-gray2 font-medium">네이버로 시작</span>
        </div>
      </div>
    </div>
  );
}
