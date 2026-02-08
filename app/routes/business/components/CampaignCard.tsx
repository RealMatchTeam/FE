import { useNavigate } from "react-router";
import BrandLogo from "../../../assets/brand-logo.png";
import ArrowRight from "../../../assets/icon/arrow-right.svg";
import SearchIcon from "../../../assets/icon/search.svg";
import Card from "../../../components/common/Card";

interface CampaignCardProps {
  brand: string;
  title: string;
  startDate: string;
  endDate: string;
  logo?: string;
  showButton?: boolean;
  campaignId?: string | number;
  proposalId?: string | number;
  type?: "SENT" | "RECEIVED" | "APPLIED";
}

export default function CampaignCard({
  brand,
  title,
  startDate,
  endDate,
  logo,
  showButton = true,
  campaignId,
  proposalId,
  type = "SENT",
}: CampaignCardProps) {
  
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 사용자가 제공한 라우팅 규칙에 따른 분기 로직
    const id = proposalId || campaignId;

    if (type === "APPLIED") {
      navigate(`/business/proposal?type=applied&applicationId=${id}`);
    } else if (type === "RECEIVED") {
      navigate(`/business/proposal?type=received&proposalId=${id}`);
    } else {
      // 기본값 또는 SENT
      navigate(`/business/proposal?type=sent&proposalId=${id}`);
    }
  };

  const Logo = (
    <div className="w-[72px] h-[72px] flex items-center justify-center border border-gray-100 rounded-lg overflow-hidden">
      <img
        src={logo || BrandLogo}
        alt={`${brand} 로고`}
        className="w-full h-full object-contain"
      />
    </div>
  );

  return (
    <Card image={Logo}>
      <div className="flex flex-col justify-end items-end gap-[10px] w-full self-stretch">
        
        <div className="flex flex-col w-full gap-1">
          {/* 브랜드명 */}
          <div className="flex items-center gap-1">
            <span className="text-[17px] font-bold text-text-black leading-tight">
              {brand}
            </span>
            <img src={ArrowRight} alt="이동" className="w-4 h-4 object-contain" />
          </div>

          {/* 제목 및 날짜 */}
          <div className="flex justify-between items-start w-full">
            <p className="text-[13px] text-text-gray2 truncate flex-1 leading-tight mr-2">
              {title}
            </p>
            <div className="flex flex-col items-end text-[10px] text-text-gray3 leading-tight flex-shrink-0">
              <span>{startDate}</span>
              <span>{endDate}</span>
            </div>
          </div>
        </div>

        {/* 캠페인 보기 버튼 */}
        {showButton && (
          <button
            onClick={handleDetailClick}
            className="flex items-center justify-center bg-[#EBEEFB] rounded-[6px] transition-colors hover:bg-[#DEE2F5] w-full h-[32px] gap-[4px]"
          >
            <img src={SearchIcon} alt="돋보기" className="w-3.5 h-3.5 object-contain" />
            <span className="text-[13px] font-medium text-text-black">캠페인 보기</span>
          </button>
        )}
      </div>
    </Card>
  );
}