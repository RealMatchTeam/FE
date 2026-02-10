import HeartButton from "../../home/components/HeartButton";

type Props = {
  isHearted: boolean;
  onChat: () => void;
  onSuggest: () => void;
  onToggleHeart: (next: boolean) => void;
};

export default function BrandActionBar({
  isHearted,
  onChat,
  onSuggest,
  onToggleHeart,
}: Props) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        onClick={onChat}
        className="h-9 flex-1 rounded-xl bg-[#F5F6FA] text-[13px] font-medium text-text-black"
      >
        채팅하기
      </button>

      <button
        type="button"
        onClick={onSuggest}
        className="h-9 flex-1 rounded-xl bg-[#F5F6FA] text-[13px] font-medium text-text-black"
      >
        제안하기
      </button>

      <div className="grid h-9 w-9 place-items-center rounded-xl border border-bluegray-2 bg-bluegray-2">
        <HeartButton defaultPressed={isHearted} onChange={onToggleHeart} />
      </div>
    </div>
  );
}
