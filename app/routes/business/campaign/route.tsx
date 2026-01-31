// app/routes/business/campaign/route.tsx
import { Outlet } from "react-router";

export default function CampaignLayout() {
  return (
    <div className="campaign-layout">
      {/* 만약 목록 페이지와 상세 페이지에서 공통으로 쓸 헤더가 있다면 여기 두세요 */}
      <Outlet /> {/* 👈 이게 있어야 상세 페이지($campaignId 혹은 detail)가 이 자리에 뜹니다! */}
    </div>
  );
}