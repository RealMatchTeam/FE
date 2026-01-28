import { useNavigate } from "@tanstack/react-router"; 
import BrandLogo from "../../../../assets/brand-logo.png";
import ArrowRight from "../../../../assets/arrow-right.svg";
import SearchIcon from "../../../../assets/search.svg";

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
  const BUTTON_WIDTH = "280px";
  
  // 2. navigate 함수 선언
  const navigate = useNavigate();

  const handleGoToCampaign = () => {
    navigate({ to: "/campaign" });
  };

  return (
    <div className="flex p-4 bg-[var(--color-bg-w)] rounded-2xl shadow-sm">
      <div className="flex w-full gap-3">
        {/* 1. 로고 영역 */}
        <div className="w-[72px] h-[72px] flex items-center justify-center border border-[var(--color-bluegray-2)] rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={logo || BrandLogo}
            alt={`${brand} 로고`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 2. 정보 및 버튼 영역 */}
        <div
          className="flex flex-col h-[72px] justify-between"
          style={{ width: BUTTON_WIDTH }}
        >
          {/* 브랜드 + 제목/날짜 */}
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <span className="text-[17px] font-bold text-[var(--color-text-black)] leading-tight">
                {brand}
              </span>
              <img
                src={ArrowRight}
                alt="이동"
                className="w-4 h-4 object-contain"
              />
            </div>

            <div className="flex justify-between items-start w-full">
              <p className="text-[13px] text-[var(--color-text-gray2)] truncate flex-1 leading-tight">
                {title}
              </p>
              <div className="flex flex-col items-end text-[10px] text-[var(--color-text-gray3)] leading-tight ml-2 flex-shrink-0">
                <span>{startDate}.25</span>
                <span>{endDate}.25</span>
              </div>
            </div>
          </div>

          {/* 캠페인 보기 버튼 - onClick 이벤트 연결 */}
          {showButton && (
            <button
              onClick={handleGoToCampaign} // 3. 클릭 시 이동 핸들러 연결
              className="relative flex items-center justify-center bg-[var(--color-bluegray-2)] rounded-[6px] transition-colors hover:bg-[var(--color-core-2)]"
              style={{ width: BUTTON_WIDTH, height: "50px" }}
            >
              <img
                src={SearchIcon}
                alt="돋보기"
                className="absolute left-[12px] w-3.5 h-3.5 object-contain"
              />
              <span className="text-[13px] font-medium text-[var(--color-text-black)]">
                캠페인 보기
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}