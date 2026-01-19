import { Link, useLocation } from "@tanstack/react-router";
import ChatIcon from "../../../assets/bottom-chatting.svg";
import MatchingListIcon from "../../../assets/bottom-matchinglist.svg";
import BusinessIcon from "../../../assets/bottom-business.svg";
import MyPageIcon from "../../../assets/bottom-mypage.svg";

interface TabItem {
  path: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}

const tabs: TabItem[] = [
  {
    path: "/",
    label: "홈",
    icon: (isActive) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isActive ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    path: "/matching/brand",
    label: "매칭리스트",
    icon: (isActive) => (
      <img
        src={MatchingListIcon}
        alt="매칭리스트"
        className={`w-6 h-6 ${isActive ? "text-core-1" : "text-text-gray3"}`}
      />
    ),
  },
  {
    path: "/calendar",
    label: "비즈니스",
    icon: (isActive) => (
      <img
        src={BusinessIcon}
        alt="비즈니스"
        className={`w-6 h-6 ${isActive ? "text-core-1" : "text-text-gray3"}`}
      />
    ),
  },
  {
    path: "/chat",
    label: "채팅",
    icon: (isActive) => (
      <img
        src={ChatIcon}
        alt="채팅"
        className={`w-6 h-6 ${isActive ? "text-core-1" : "text-text-gray3"}`}
      />
    ),
  },
  {
    path: "/mypage",
    label: "마이페이지",
    icon: (isActive) => (
      <img
        src={MyPageIcon}
        alt="마이페이지"
        className={`w-6 h-6 ${isActive ? "text-core-1" : "text-text-gray3"}`}
      />
    ),
  },
];

export default function BottomTab() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="w-full shrink-0 mx-auto max-w-[430px] bg-white border-t border-text-gray5 safe-area-bottom">
      <div className="flex items-center justify-center h-[66px] px-0 py-4 gap-[20px] shrink-0 self-stretch">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center justify-center gap-1 transition-colors min-w-[50px]"
            >
              <div
                className={
                  isActive ? "text-core-1" : "text-text-gray3"
                }
              >
                {tab.icon(isActive)}
              </div>
              <span
                className={`text-callout4 ${isActive
                  ? "text-core-1 font-semibold"
                  : "text-text-gray3"
                  }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
