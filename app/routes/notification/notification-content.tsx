import { useState, useEffect } from "react";
import { fetchNotifications, readNotification, type NotificationItem } from "./api/notification";
import { useHideHeader } from "../../hooks/useHideHeader";
import NavigationHeader from "../../components/common/NavigateHeader";
import emptyImg from "./../../assets/empty.png";
import { useNavigate } from "react-router-dom";

function TabButton({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count?: number }) {
    return (
        <button
            onClick={onClick}
            className={`px-[10px] py-[6px] rounded-[8px] text-[14px] font-medium transition-all flex items-center gap-1.5 ${active
                ? "bg-core-1 text-white"
                : "bg-white border border-[#E6E6F3] text-text-gray3"
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

    /*const handleReadAll = async () => {
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
    };*/

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


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        }).replace(/ /g, '').slice(0, -1);
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

            <div
                className="overflow-y-auto"
                style={{ height: `calc(100vh - 60px - 67px - 60px)` }}
            >
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-text-gray3">로딩 중...</div>
                ) : notifications.length > 0 ? (
                    <div className="flex flex-col">
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                // 클릭 시 단건 읽기 함수 호출
                                onClick={() => handleReadNotification(item.id, item.isRead)}
                                className={`p-4 border-b border-gray-50 flex flex-col gap-1 transition-colors active:bg-gray-50 ${!item.isRead ? "bg-blue-50/50" : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-pretendard text-[14px] font-semibold leading-[20px] ${!item.isRead ? "text-core-1" : "text-text-gray3"
                                        }`}>
                                        {formatDate(item.createdAt)}
                                    </span>
                                    {!item.isRead && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-core-1" />
                                    )}
                                </div>
                                <p className={`text-[14px] leading-relaxed transition-colors ${!item.isRead
                                        ? "text-text-black font-semibold"
                                        : "text-text-gray3 font-medium"
                                    }`}>
                                    {item.body}
                                </p>
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