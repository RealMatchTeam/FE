import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/layout/Header";

export const Route = createFileRoute("/_main/mypage")({
  component: MyPage,
});

function MyPage() {
  return (
    <div>
      <Header title="마이페이지" />
      <main className="p-4">
        {/* 프로필 섹션 */}
        <div className="bg-bluegray-1 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-grad-creator rounded-full flex items-center justify-center text-white text-callout4">
              U
            </div>
            <div>
              <h2 className="text-title mb-1">사용자</h2>
              <p className="text-body1 text-text-gray2">user@example.com</p>
            </div>
          </div>
          <button className="w-full h-12 bg-white text-core-1 text-title2 rounded-xl border border-core-1 hover:bg-core-2 transition-colors">
            프로필 수정
          </button>
        </div>

        {/* 메뉴 섹션 */}
        <div className="bg-white rounded-2xl border border-text-gray5 overflow-hidden">
          <MenuItem label="계정 설정" />
          <MenuItem label="알림 설정" />
          <MenuItem label="개인정보 처리방침" />
          <MenuItem label="서비스 이용약관" />
          <MenuItem label="고객센터" />
          <MenuItem label="로그아웃" isLast />
        </div>
      </main>
    </div>
  );
}

interface MenuItemProps {
  label: string;
  isLast?: boolean;
}

function MenuItem({ label, isLast = false }: MenuItemProps) {
  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-4 text-left hover:bg-bluegray-1 transition-colors ${
        !isLast ? "border-b border-text-gray5" : ""
      }`}
    >
      <span className="text-title2 text-text-black">{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 text-text-gray3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
}
