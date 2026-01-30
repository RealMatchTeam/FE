import type { ComponentType, SVGProps, ReactNode } from "react";
import { PurposeCard } from "./PurposeCard";
import { GiveStarIcon } from "../../components/icons/GiveStarIcon";
import { WonIcon } from "../../components/icons/WonIcon";
import { TrendIcon } from "../../components/icons/TrendIcon";
import FollowUpIcon from "../../../assets/icon/follow-up.svg";
import BrandingUpIcon from "../../../assets/icon/branding-up.svg";
import NewBrandIcon from "../../../assets/icon/new-brand.svg";

interface PurposeItem {
  id: string;
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement> & { width?: number; height?: number }>;
  imgSrc?: string;
  imgSize?: number;
  noGap?: boolean;
  imgOffsetY?: number;
  labelOffsetY?: number;
}

// 데이터와 렌더링 분리: 아이콘 컴포넌트 또는 이미지 경로 저장
const PURPOSES: PurposeItem[] = [
  { id: "sponsorship", label: "제품 협찬", Icon: GiveStarIcon },
  { id: "revenue", label: "수익 창출", Icon: WonIcon },
  { id: "followers", label: "팔로워 증대", imgSrc: FollowUpIcon, imgSize: 48, labelOffsetY: -4 },
  { id: "branding", label: "브랜딩 강화", imgSrc: BrandingUpIcon, imgSize: 60, noGap: true, imgOffsetY: -8 },
  { id: "discovery", label: "신규 브랜드 발굴", imgSrc: NewBrandIcon },
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
  const renderIcon = (item: PurposeItem): ReactNode => {
    if (item.Icon) {
      return <item.Icon width={28} height={28} />;
    }
    if (item.imgSrc) {
      const size = item.imgSize || 28;
      return (
        <img
          src={item.imgSrc}
          alt={item.label}
          style={{
            width: size,
            height: size,
            marginTop: item.imgOffsetY || 0,
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 px-3.5">
      {PURPOSE_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((item) => (
            <PurposeCard
              key={item.id}
              label={item.label}
              icon={renderIcon(item)}
              selected={selectedPurposes.includes(item.label)}
              onClick={() => onTogglePurpose(item.label)}
              noGap={item.noGap}
              labelOffsetY={item.labelOffsetY}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
