import type { ComponentType, SVGProps } from "react";
import { PurposeCard } from "./PurposeCard";
import { GiveStarIcon } from "../../components/icons/GiveStarIcon";
import { WonIcon } from "../../components/icons/WonIcon";
import { FollowersIcon } from "../../components/icons/FollowersIcon";
import { BrandingIcon } from "../../components/icons/BrandingIcon";
import { DiscoveryIcon } from "../../components/icons/DiscoveryIcon";
import { TrendIcon } from "../../components/icons/TrendIcon";

interface PurposeItem {
  id: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { width?: number; height?: number }>;
}

// 데이터와 렌더링 분리: 아이콘 컴포넌트 참조만 저장
const PURPOSES: PurposeItem[] = [
  { id: "sponsorship", label: "제품 협찬", Icon: GiveStarIcon },
  { id: "revenue", label: "수익 창출", Icon: WonIcon },
  { id: "followers", label: "팔로워 증대", Icon: FollowersIcon },
  { id: "branding", label: "브랜딩 강화", Icon: BrandingIcon },
  { id: "discovery", label: "신규 브랜드 발굴", Icon: DiscoveryIcon },
  { id: "trend", label: "트렌드 탐색", Icon: TrendIcon },
];

// 2x3 그리드를 위해 2개씩 묶기
const PURPOSE_ROWS = [
  PURPOSES.slice(0, 2),
  PURPOSES.slice(2, 4),
  PURPOSES.slice(4, 6),
];

interface PurposeSectionProps {
  selectedPurposes: string[];
  onTogglePurpose: (purpose: string) => void;
}

export function PurposeSection({
  selectedPurposes,
  onTogglePurpose,
}: PurposeSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 px-3.5">
      {PURPOSE_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map(({ id, label, Icon }) => (
            <PurposeCard
              key={id}
              label={label}
              icon={<Icon width={28} height={28} />}
              selected={selectedPurposes.includes(label)}
              onClick={() => onTogglePurpose(label)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
