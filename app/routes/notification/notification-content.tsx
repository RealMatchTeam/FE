import { useState, useEffect } from "react";
import { fetchNotifications, readNotification, readAllNotifications, type NotificationItem as NotificationType } from "./api/notification";
import { useHideHeader } from "../../hooks/useHideHeader";
import NavigationHeader from "../../components/common/NavigateHeader";
import emptyImg from "./../../assets/empty.png";
import { useNavigate } from "react-router-dom";
import NotificationItem from "./components/NotificationItem";

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void; count?: number }) {
    return (
        <button
            onClick={onClick}
            className={`px-[10px] py-[6px] rounded-[8px] text-title2 font-medium transition-all flex items-center gap-1.5 ${active
                ? "bg-core-1 text-white"
                : "bg-white border border-[#E6E6F3] text-text-gray3"
                }`}
        >
            {label}
        </button>
    );
}

export default function NotificationContent() {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"ALL" | "PROPOSAL" | "MATCHING">("ALL");
    const navigate = useNavigate();

    useHideHeader(true);

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

    // 전체 읽기 핸들러
    const handleReadAll = async () => {
        if (unreadCount === 0) return;
        try {
            const data = await readAllNotifications();
            if (data.isSuccess) {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("전체 읽기 처리 실패:", error);
        }
    };

    const handleReadNotification = async (id: string, isRead: boolean) => {
        if (isRead) return;

        try {
            const data = await readNotification(id);
            if (data.isSuccess) {
                // 해당 알림만 읽음 처리
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
                );
                // 전체 미읽음 개수 감소
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("단건 읽기 처리 실패:", error);
        }
    };

    const groupedNotifications = notifications.reduce((acc: { [key: string]: NotificationType[] }, item) => {
        const date = item.createdAt.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedNotifications).sort((a, b) => b.localeCompare(a));

    const formatGroupDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} (${days[date.getDay()]})`;
    };
    return (
        <div className="h-screen-full bg-grad-auth ">
            <div className="h-[60px]">
                <NavigationHeader title="알림" onBack={() => navigate(-1)} />
            </div>

            <div className="px-4 flex flex-col gap-4 border-b border-text-gray5">
                <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <TabButton
                        label="전체"
                        active={activeTab === "ALL"}
                        onClick={() => setActiveTab("ALL")}
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

            <div className="overflow-y-auto pb-10" style={{ height: `calc(100vh - 127px)` }}>
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-text-gray3 text-callout1">로딩 중...</div>
                ) : sortedDates.length > 0 ? (
                    <div className="flex flex-col">
                        {sortedDates.map((date, index) => (
                            <div key={date} className="flex flex-col">
                                <div className="px-4 py-3 flex justify-between items-center">
                                    <span className="text-title1 font-bold text-text-black">
                                        {formatGroupDate(date)}
                                    </span>
                                    {/* 첫 번째 날짜 그룹(최신)에만 '전체 읽기' 노출 */}
                                    {index === 0 && (
                                        <button
                                            onClick={handleReadAll}
                                            className="text-callout1 text-core-1 active:scale-95 transition-all"
                                        >
                                            전체 읽기
                                        </button>
                                    )}
                                </div>
                                {groupedNotifications[date].map((item) => (
                                    <NotificationItem
                                        key={item.id}
                                        item={item}
                                        onClick={handleReadNotification}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[75vh]">
                        <img src={emptyImg} alt="" className="h-[160px] w-[160px] select-none" />
                        <p className="font-medium text-[14px] text-[#5B5D6B] text-center mt-2">
                            받은 알림이 없어요
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}