import { useState, useEffect, useMemo } from "react";
import { fetchNotifications } from "./api/notification";

interface Notification {
  id: string; 
  date: string;
  message: string;
  status: "read" | "unread";
  type: "proposal" | "matching";
}

// 탭 버튼 컴포넌트
function TabButton({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-all flex items-center gap-1.5 ${
        active 
          ? "bg-core-1 text-white" 
          : "bg-white border border-text-gray5 text-text-gray3"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className={`flex items-center justify-center rounded-full text-[10px] min-w-[18px] h-[18px] px-1 ${
          active ? "bg-white text-core-1" : "bg-core-1 text-white"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function NotificationContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "proposal" | "matching">("all");
  const [loading, setLoading] = useState(true);

  const fetchNotificationsData = async () => {
    setLoading(true); // 로딩 시작
    try {
      const accessToken = localStorage.getItem('accessToken') || ''; // 토큰 가져오기
      const data = await fetchNotifications(accessToken); // API 호출
      if (data.isSuccess) {
        const formattedNotifications = data.result.items.map((item: any) => ({
          id: item.id, 
          date: new Date(item.createdAt).toLocaleDateString('ko-KR'), 
          message: item.body, 
          status: item.isRead ? "read" : "unread",
          type: item.category === "PROPOSAL" ? "proposal" : "matching",
        }));
        setNotifications(formattedNotifications);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchNotificationsData(); // 컴포넌트 마운트 시 호출
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  const handleReadNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
  };

  return (
    <div className="flex flex-col w-full h-screen bg-grad-auth">
      <div className="px-4 pt-6 pb-4 flex flex-col gap-4 border-b border-text-gray5">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-text-black">알림</h1>
          {unreadCount > 0 && (
            <button 
              onClick={handleReadAll}
              className="text-[13px] font-medium text-text-gray3 underline"
            >
              전체 읽음 처리
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <TabButton 
            label="전체" 
            active={activeTab === "all"} 
            onClick={() => setActiveTab("all")} 
            count={activeTab === "all" ? unreadCount : undefined}
          />
          <TabButton 
            label="받은 제안" 
            active={activeTab === "proposal"} 
            onClick={() => setActiveTab("proposal")} 
          />
          <TabButton 
            label="캠페인 매칭" 
            active={activeTab === "matching"} 
            onClick={() => setActiveTab("matching")} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="flex flex-col">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleReadNotification(notification.id)}
                className={`p-4 border-b border-gray-50 flex flex-col gap-1 transition-colors active:bg-gray-50 ${
                  notification.status === "unread" ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pretendard text-[16px] font-semibold text-core-1 leading-[20px]">
                    {notification.date}
                  </span>
                  {notification.status === "unread" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-core-1" />
                  )}
                </div>
                <p className={`text-[14px] leading-relaxed ${
                  notification.status === "unread" ? "text-text-black font-semibold" : "text-text-gray2 font-medium"
                }`}>
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-text-gray4">
            <p>표시할 알림이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}