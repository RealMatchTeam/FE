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
    
    // 피그마는 title3인데, 렌더링하면 작아 보여서 title2로 했습니다.

    <div className="mt-2 inline-flex w-full items-center gap-2">
      <button
        type="button"
        onClick={onChat}
        className="flex flex-1 items-center justify-center rounded-[6px] bg-[#EBEEFB] px-4 py-2 text-title2 font-medium leading-[20px] text-text-black"
      >
        채팅하기
      </button>

      <button
        type="button"
        onClick={onSuggest}
        className="flex flex-1 items-center justify-center rounded-[6px] bg-[#EBEEFB] px-4 py-2 text-title2 font-medium leading-[20px] text-text-black"
      >
        제안하기
      </button>

      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] bg-[#EBEEFB] p-[4px]">
        <HeartButton pressed={isHearted} onChange={onToggleHeart} />
      </div>
    </div>
  );
}
