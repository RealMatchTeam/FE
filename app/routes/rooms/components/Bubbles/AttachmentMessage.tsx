import { useAuthStore } from "../../../../stores/auth-store";

type Props = {
  avatarSrc?: string;
  senderId: number | null; // 시스템 메시지는 null
  createdAt: string;
  attachmentType: "IMAGE" | "FILE";
  contentType: string;
  originalName: string;
  accessUrl: string | null; // Presigned URL. null이면 에러 토스트 등 처리 필요
  status: "UPLOADED" | "READY" | "FAILED"; // READY만 채팅 메시지 첨부 가능
};

export default function AttachmentMessage({
  avatarSrc,
  senderId,
  createdAt,
  attachmentType,
  contentType,
  originalName,
  accessUrl,
  status,
 }: Props) {
  // IMAGE / FILE
  if (attachmentType !== "IMAGE" && attachmentType !== "FILE") return null;

  const myId = Number(useAuthStore((s) => s.me?.id ?? 0));
  
  const isMe = senderId === myId;
  const timeText = createdAt ?? "";

  // 파일 정보
  const fileName = originalName;
  const ext = contentType;

  const handleOpen = () => {
    if (status !== "READY" || !accessUrl) {
      // 여기서 토스트 나중에 추가
      console.warn("Attachment is not ready or accessUrl is missing");
      return;
    }

    if (attachmentType === "IMAGE") {
      window.open(accessUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const link = document.createElement("a");
    link.href = accessUrl;
    link.download = originalName; // 확인 필요
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 아이콘 SVG 분기
  const Icon = attachmentType === "IMAGE" ? ImageIcon : FileIcon;
 
  // 내 채팅
  if (isMe) {
    return (
      <div className="flex w-full justify-end">
        <div className="inline-flex items-end gap-[10px]">
          {timeText ? (
            <div className="text-[10px] leading-[12px] text-[#9B9BA1] text-right whitespace-pre-line">
              {timeText}
            </div>
          ) : null}

          {/* 버블 전체가 버튼 */}
          <button
            type="button"
            onClick={handleOpen}
            className="w-[160px] h-[52px] rounded-[10px] bg-[#B7B7F380] px-2 py-2 flex items-center gap-[10px] text-left"
          >
            <div className="w-9 h-9 rounded-[8px] grid place-items-center shrink-0">
              <Icon />
            </div>

            <div className="min-w-0 flex flex-col">
              <div className="text-[14px] leading-[20px] style-Medium text-[#404252] truncate">
                {fileName}
              </div>
              <div className="text-[12px] leading-[16px] text-[#9B9BA1] truncate">
                {ext}
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // 상대 채팅
  if (!isMe) {
    return (
      <div className="flex justify-start">
        <div className="w-fit flex items-start gap-[10px] max-w-full">
          {/* avatar */}
          <div
            className="shrink-0 rounded-[10px] bg-white overflow-hidden"
            style={{ width: 38, height: 38 }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-[12px] text-[#5B5D6B]">
                logo
              </div>
            )}
          </div>

          {/* bubble + time */}
          <div className="flex justify-start">
            <div className="flex items-end gap-[8px] max-w-[calc(100%-48px)]">
              <button
                type="button"
                onClick={handleOpen}
                className="w-[160px] h-[52px] shrink-0 rounded-[10px] bg-[#FFFFFFCC] px-2 py-2 flex items-center gap-[10px] text-left"
              >
                <div className="w-9 h-9 rounded-[8px] grid place-items-center shrink-0">
                  <Icon />
                </div>

                <div className="min-w-0 flex flex-col">
                <div className="text-[14px] leading-[20px] style-Medium text-[#404252] truncate">
                    {fileName}
                </div>
                <div className="text-[12px] leading-[16px] text-[#9B9BA1] truncate">
                    {ext}
                </div>
                </div>
              </button>

              {timeText ? (
                <div className="shrink-0 text-[10px] leading-[12px] text-[#9B9BA1] whitespace-pre-line">
                  {timeText}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// SVG: IMAGE / FILE 분기
function ImageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.83333 24.5C5.19167 24.5 4.64256 24.2717 4.186 23.8152C3.72944 23.3586 3.50078 22.8091 3.5 22.1667V5.83333C3.5 5.19167 3.72867 4.64256 4.186 4.186C4.64333 3.72944 5.19244 3.50078 5.83333 3.5H22.1667C22.8083 3.5 23.3578 3.72867 23.8152 4.186C24.2725 4.64333 24.5008 5.19244 24.5 5.83333V22.1667C24.5 22.8083 24.2717 23.3578 23.8152 23.8152C23.3586 24.2725 22.8091 24.5008 22.1667 24.5H5.83333ZM5.83333 22.1667H22.1667V5.83333H5.83333V22.1667ZM7 19.8333H21L16.625 14L13.125 18.6667L10.5 15.1667L7 19.8333Z" fill="#B7B7F3"/>
    </svg>

  );
}

function FileIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.3337 10.4297C23.3216 10.3225 23.2981 10.2169 23.2637 10.1147V10.0097C23.2089 9.88898 23.1339 9.77851 23.042 9.68301L16.042 2.68301C15.9465 2.5911 15.836 2.51614 15.7153 2.46134H15.6103L15.237 2.33301H8.16699C7.23873 2.33301 6.3485 2.70176 5.69212 3.35813C5.03574 4.01451 4.66699 4.90475 4.66699 5.83301V22.1663C4.66699 23.0946 5.03574 23.9848 5.69212 24.6412C6.3485 25.2976 7.23873 25.6663 8.16699 25.6663H19.8337C20.7619 25.6663 21.6522 25.2976 22.3085 24.6412C22.9649 23.9848 23.3337 23.0946 23.3337 22.1663V10.4297ZM16.3337 6.31134L19.3553 9.33301H16.3337V6.31134ZM21.0003 22.1663C21.0003 22.4758 20.8774 22.7725 20.6586 22.9913C20.4398 23.2101 20.1431 23.333 19.8337 23.333H8.16699C7.85757 23.333 7.56083 23.2101 7.34203 22.9913C7.12324 22.7725 7.00033 22.4758 7.00033 22.1663V5.83301C7.00033 5.52359 7.12324 5.22684 7.34203 5.00805C7.56083 4.78926 7.85757 4.66634 8.16699 4.66634H14.0003V10.4997C14.0003 10.8091 14.1232 11.1058 14.342 11.3246C14.5608 11.5434 14.8576 11.6663 15.167 11.6663H21.0003V22.1663Z" fill="#B7B7F3"/>
    </svg>

  );
}