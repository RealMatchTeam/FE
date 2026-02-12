import HeartButton from "../../home/components/HeartButton";
import proposalIconUrl from "../../../assets/campaign-proposal-icon.svg";

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
    <div className="flex w-full items-center gap-2">
      <button
        type="button"
        onClick={onChat}
        className="flex h-[30px] flex-1 items-center justify-center rounded-[6px] bg-[#EBEEFB] px-4 text-title3 text-text-black"
      >
        채팅하기
      </button>

      <button
        type="button"
        onClick={onSuggest}
        className="flex h-[30px] flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-[#EBEEFB] px-4 text-title3 text-text-black"
      >
        <img src={proposalIconUrl} alt="" className="h-4 w-4 select-none" draggable={false} />
        제안하기
      </button>

      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] bg-[#EBEEFB]">
        <HeartButton pressed={isHearted} onChange={onToggleHeart} />
      </div>
    </div>
  );
}
