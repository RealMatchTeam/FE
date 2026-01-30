import { useNavigate } from "@tanstack/react-router";
import chatIcon from "../../../../assets/chat-icon2.svg";
import searchIcon from "../../../../assets/icon/search.svg";

interface MatchingCardProps {
  brand: string;
  status: "매칭" | "검토 중" | "거절";
  date: string;
  actionLabel: string;
  type: "sent" | "received";
}

export default function MatchingCard({
  brand,
  status,
  date,
  actionLabel,
  type,
}: MatchingCardProps) {

  const getStatusStyle = () => {
    switch (status) {
      case "매칭": return "text-core-1";
      case "검토 중": return "text-core-3";
      case "거절": return "text-text-gray3";
      default: return "text-text-gray3";
    }
  };

  const navigate = useNavigate();

  const handleGoToProposal = () => {
    navigate({
      to: "/proposal", // routeTree
      search: { type: type },
    });
  };

  const handleGoToChat = () => {
    navigate({ to: "/chat" });
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-bluegray-1">
      <div className="w-16 h-16 flex items-center justify-center border border-text-gray5 rounded-lg bg-white overflow-hidden flex-shrink-0">
        <span className="text-title5 text-text-gray3 text-center">{brand}</span>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-end h-4">
          <span className="text-callout4 text-text-gray3 scale-[0.9] origin-right">
            {date}
          </span>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-title1 font-bold text-text-black truncate">{brand}</span>
          <span className={`text-title3 font-bold ${getStatusStyle()}`}>{status}</span>
        </div>

        <div className="flex gap-2 items-center">
          <button 
            onClick={handleGoToProposal}
            className="flex-1 py-2 flex items-center justify-center gap-1.5 bg-bluegray-2 rounded-lg transition-opacity hover:opacity-90"
          >
            <img src={searchIcon} alt="조회" className="w-3.5 h-3.5" />
            <span className="text-title7 text-text-gray2">{actionLabel}</span>
          </button>

          <button 
            onClick={handleGoToChat}
            className="w-10 h-10 flex items-center justify-center bg-core-50 rounded-lg transition-opacity hover:opacity-90 flex-shrink-0"
          >
            <img src={chatIcon} alt="채팅" className="w-5 h-5 object-contain" />
          </button>
        </div>
      </div>
    </div>
  );
}