// components/common/NotificationItem.tsx
import proposalIcon from "../../../assets/icon/icon-notification-proposal.svg";
import proposalGrayIcon from "../../../assets/icon/icon-notification-proposal-gray.svg";
import matchingIcon from "../../../assets/icon/icon-notification-matching.svg";
import matchingGrayIcon from "../../../assets/icon/icon-notification-matching-gray.svg";
import { type NotificationItem as NotificationType } from "../api/notification";

interface Props {
  item: NotificationType;
  onClick: (id: string, isRead: boolean) => void;
}

export default function NotificationItem({ item, onClick }: Props) {
  const getIcon = () => {
    const isMatching = item.category === "MATCHING" || item.iconType === "MATCHING";
    
    if (item.isRead) {
      // 읽은 상태
      return isMatching ? matchingGrayIcon : proposalGrayIcon;
    }
    
    // 안 읽은 상태
    return isMatching ? matchingIcon : proposalIcon;
  };

  // 시간 포맷 로직
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const ampm = date.getHours() >= 12 ? '오후' : '오전';
    let hours = date.getHours() % 12;
    hours = hours ? hours : 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${ampm} ${hours}시 ${minutes}분`;
  };

  return (
    <div
      onClick={() => onClick(item.id, item.isRead)}
      className={`px-4 py-4 flex gap-3 cursor-pointer transition-colors active:bg-gray-50 ${
        !item.isRead ? "bg-[#F5F6FF]" : "bg-[#F5F6FF]"
      }`}
    >
      <div className="relative shrink-0">
        <img src={getIcon()} alt="icon" className="w-10 h-10" />
        {!item.isRead && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-core-1 rounded-full border border-white" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        <p className={`text-title2 leading-[22px] ${!item.isRead ? "text-text-black font-medium" : "text-text-gray3 font-medium"}`}>
          {item.body}
        </p>
        <span className="text-callout1 text-text-gray3">
          {formatTime(item.createdAt)}
        </span>
      </div>
    </div>
  );
}