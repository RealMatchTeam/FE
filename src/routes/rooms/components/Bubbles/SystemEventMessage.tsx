export const CHAT_NOTICE_TEXT = {
  MATCHED: "캠페인이 매칭 되었습니다.\n협업을 시작해 주세요.",
  ACCEPTED: "제안이 수락 되었습니다.\n협업을 시작해 주세요.",
  REJECTED: "제안이 수락되지 않았습니다.\n다른 캠페인을 확인해 주세요.",
} as const;

type Props = {
  text: string;
};

export default function ChatNoticeMessage({ text }: Props) {
  return (
    <div className="w-full flex justify-center py-6">
      <div className="text-[12px] leading-[16px] text-[#6666E5] text-center whitespace-pre-line">
        {text}
      </div>
    </div>
  );
}
