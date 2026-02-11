export const CHAT_NOTICE_TEXT = {
  PROPOSAL_ACCEPTED: "제안이 수락되었습니다.\n협업을 시작해 주세요.",
  PROPOSAL_REJECTED: "제안이 수락되지 않았습니다.\n다른 협업 기회를 확인해보세요.",
  PROPOSAL_CANCELED: "제안이 취소되었습니다.\n다른 협업 기회를 확인해보세요.",

  APPLY_ACCEPTED: "지원이 수락되었습니다.\n협업을 시작해 주세요.",
  APPLY_REJECTED: "지원이 수락되지 않았습니다.\n다른 협업 기회를 확인해보세요.",
  APPLY_CANCELED: "지원이 취소되었습니다.\n다른 협업 기회를 확인해보세요.",

  DEFAULT: "시스템 메시지 오류입니다.",
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
