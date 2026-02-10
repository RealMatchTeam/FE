import { Link, useLocation } from "react-router";
// Normal icons
import ChatIcon from "../../assets/bottom-tab/normal/bottom-chatting.svg";
import MatchingListIcon from "../../assets/bottom-tab/normal/bottom-matchinglist.svg";
import BusinessIcon from "../../assets/bottom-tab/normal/bottom-business.svg";
import MyPageIcon from "../../assets/bottom-tab/normal/bottom-mypage.svg";
import HomeIcon from "../../assets/bottom-tab/normal/bottom-home.svg";
// Selected icons
import ChatIconSelected from "../../assets/bottom-tab/selected/bottom-chatting-selected.svg";
import MatchingListIconSelected from "../../assets/bottom-tab/selected/bottom-matchinglist-selected.svg";
import BusinessIconSelected from "../../assets/bottom-tab/selected/bottom-business-selected.svg";
import MyPageIconSelected from "../../assets/bottom-tab/selected/bottom-mypage-selected.svg";
import HomeIconSelected from "../../assets/bottom-tab/selected/bottom-home-selected.svg";

interface TabItem {
  path: string;
  label: string;
  icon: string;
  iconSelected: string;
}

const tabs: TabItem[] = [
  {
    path: "/",
    label: "홈",
    icon: HomeIcon,
    iconSelected: HomeIconSelected,
  },
  {
    path: "/matching/brand",
    label: "매칭리스트",
    icon: MatchingListIcon,
    iconSelected: MatchingListIconSelected,
  },
  {
    path: "/business/calendar",
    label: "비즈니스",
    icon: BusinessIcon,
    iconSelected: BusinessIconSelected,
  },
  {
    path: "/chat",
    label: "채팅",
    icon: ChatIcon,
    iconSelected: ChatIconSelected,
  },
  {
    path: "/mypage",
    label: "마이페이지",
    icon: MyPageIcon,
    iconSelected: MyPageIconSelected,
  },
];

export default function BottomTab() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="w-full shrink-0 mx-auto max-w-[430px] bg-white border-t border-text-gray5 safe-area-bottom">
      <div className="flex items-center justify-center h-[66px] py-4 pl-[3vw] gap-[12.5vw] shrink-0 self-stretch">
        {tabs.map((tab) => {
          let isActive = currentPath === tab.path;
          if (tab.path === "/matching/brand" && currentPath.startsWith("/matching")) {
            isActive = true;
          }
          if (tab.path === "/business/calendar" && currentPath.startsWith("/business")) {
            isActive = true;
          }
          const isHome = tab.path === "/";
          if (isHome && (currentPath === "/" || currentPath.startsWith("/home") || currentPath.startsWith("/pre"))) {
            isActive = true;
          }
          const isMyPage = tab.path === "/mypage";
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`transition-colors ${isHome ? "pl-[2.5vw]" : ""} ${isMyPage ? "pr-[3.646vw]" : ""}`}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <img
                  src={isActive ? tab.iconSelected : tab.icon}
                  alt={tab.label}
                  className={isHome ? "w-6 h-6" : "w-4 h-4"}
                />
                <span
                  className={`text-callout4 whitespace-nowrap ${isActive
                    ? "text-core-1 font-semibold"
                    : "text-text-gray3"
                    }`}
                >
                  {tab.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
