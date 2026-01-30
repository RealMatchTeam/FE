import { Outlet } from "react-router";
import Tabs from "../../components/common/Tabs";

const MATCHING_TABS = [
  { label: "브랜드", value: "brand", path: "/matching/brand" },
  { label: "캠페인", value: "campaign", path: "/matching/campaign" },
];

export default function MatchingLayout() {
  return (
    <div className="flex flex-col w-full h-full bg-white">
      <Tabs tabs={MATCHING_TABS} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
