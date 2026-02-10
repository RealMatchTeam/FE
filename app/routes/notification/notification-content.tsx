import { useState, useEffect } from "react";
import { fetchNotifications, readAllNotifications, type NotificationItem } from "./api/notification";

function TabButton({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count?: number }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-all flex items-center gap-1.5 ${active
                    ? "bg-core-1 text-white"
                    : "bg-white border border-text-gray5 text-text-gray3"
                }`}
        >
            {label}
            {count !== undefined && count > 0 && (
                <span className={`flex items-center justify-center rounded-full text-[10px] min-w-[18px] h-[18px] px-1 ${active ? "bg-white text-core-1" : "bg-core-1 text-white"
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

export default function NotificationContent() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"ALL" | "PROPOSAL" | "MATCHING">("ALL");

    const fetchNotificationsData = async () => {
        setLoading(true);
        try {
            const data = await fetchNotifications(activeTab);
            if (data.isSuccess) {
                setNotifications(data.result.items);
                setUnreadCount(data.result.unreadCount);
            }
        } catch (error) {
            console.error("알림 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificationsData();
    }, [activeTab]);

    const handleReadAll = async () => {
        try {
            const data = await readAllNotifications();
            if (data.isSuccess) {
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("전체 읽기 처리 실패:", error);
        }
    };


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        }).replace(/ /g, '').slice(0, -1);
    };

    const handleReadNotification = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="flex flex-col w-full h-screen bg-grad-auth">
            <div className="px-4 pt-6 pb-4 flex flex-col gap-4 border-b border-text-gray5 bg-white">
                <div className="flex items-center justify-between">
                    <h1 className="text-[20px] font-bold text-text-black">알림</h1>
                        <button
                            className="text-[13px] font-medium text-text-gray3 underline active:text-core-1 transition-colors"
                            onClick={handleReadAll}
                        >
                            전체 읽기
                        </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <TabButton
                        label="전체"
                        active={activeTab === "ALL"}
                        onClick={() => setActiveTab("ALL")}
                        count={activeTab === "ALL" ? unreadCount : undefined}
                    />
                    <TabButton
                        label="받은 제안"
                        active={activeTab === "PROPOSAL"}
                        onClick={() => setActiveTab("PROPOSAL")}
                    />
                    <TabButton
                        label="캠페인 매칭"
                        active={activeTab === "MATCHING"}
                        onClick={() => setActiveTab("MATCHING")}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-text-gray3">로딩 중...</div>
                ) : notifications.length > 0 ? (
                    <div className="flex flex-col">
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleReadNotification(item.id)}
                                className={`p-4 border-b border-gray-50 flex flex-col gap-1 transition-colors active:bg-gray-50 ${!item.isRead ? "bg-blue-50/50" : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-pretendard text-[14px] font-semibold leading-[20px] ${
                                        /* 읽었을 때는 텍스트도 회색으로 변경 */
                                        !item.isRead ? "text-core-1" : "text-text-gray3"
                                        }`}>
                                        {formatDate(item.createdAt)}
                                    </span>
                                    {!item.isRead && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-core-1" />
                                    )}
                                </div>
                                {/* API 명세서의 title과 body 사용 */}
                                <p className={`text-[14px] leading-relaxed ${!item.isRead ? "text-text-black font-semibold" : "text-text-gray2 font-medium"
                                    }`}>
                                    {item.body}
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