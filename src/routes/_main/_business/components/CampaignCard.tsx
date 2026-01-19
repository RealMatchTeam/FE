import BrandLogo from "../../../../assets/brand-logo.png";
import ArrowRight from "../../../../assets/arrow-right.svg";
import SearchIcon from "../../../../assets/search.svg";
import Card from "../../../../components/common/Card";

interface CampaignCardProps {
  brand: string;
  title: string;
  startDate: string;
  endDate: string;
  logo?: string;
  showButton?: boolean;
}

export default function CampaignCard({
  brand,
  title,
  startDate,
  endDate,
  logo,
  showButton = true,
}: CampaignCardProps) {
  const BUTTON_WIDTH = '280px';

  // 로고 컴포넌트
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
      <div
        className="flex flex-col h-[72px] justify-between"
        style={{ width: BUTTON_WIDTH }}
      >
        {/* 브랜드 + 제목/날짜 */}
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <span className="text-[17px] font-bold text-text-black leading-tight">{brand}</span>
            <img src={ArrowRight} alt="이동" className="w-4 h-4 object-contain" />
          </div>

          <div className="flex justify-between items-start w-full">
            <p className="text-[13px] text-text-gray2 truncate flex-1 leading-tight">
              {title}
            </p>
            <div className="flex flex-col items-end text-[10px] text-text-gray3 leading-tight ml-2 flex-shrink-0">
              <span>{startDate}.25</span>
              <span>{endDate}.25</span>
            </div>
          </div>
        </div>

        {/* 캠페인 보기 버튼 */}
        {showButton && (
          <button
            className="relative flex items-center justify-center bg-[#EBEEFB] rounded-[6px] transition-colors hover:bg-[#DEE2F5]"
            style={{ width: BUTTON_WIDTH, height: '50px' }}
          >
            <img
              src={SearchIcon}
              alt="돋보기"
              className="absolute left-[12px] w-3.5 h-3.5 object-contain"
            />
            <span className="text-[13px] font-medium text-text-black">
              캠페인 보기
            </span>
          </button>
        )}
      </div>
    </Card>
  );
}